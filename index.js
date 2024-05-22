const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xyqwep0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// my middleware
const verifyToken = async (req, res, next) => {
    const token = req.cookies?.token;
    console.log('Verifying token', token);
    if (!token) {
        return res.status(401).send({ message: 'Not authorized' });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).send({ message: 'Not authorized' });
        }
        req.user = decoded;
        console.log(decoded);
        next();
    })

};


async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();

        const database = client.db("BistroDB");
        const menusCollection = database.collection("menu");
        const cartsCollection = database.collection("cart");
        const userCollection = database.collection("users");
        const paymentCollection = database.collection("payments");

        // admin check middleware
        const verifyAdmin = async (req, res, next) => {
            const email = req.user.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            const isAdmin = user?.role === "admin";
            if (!isAdmin) {
                return res.status(403).send({ message: 'Forbidden' });
            }
            next();
        };

        //jwt auth
        app.post("/jwt", async (req, res) => {
            const user = req.body;
            console.log(user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10h' });
            res
                .cookie("token", token, {
                    httpOnly: true,
                    secure: false,
                })
                .send({ success: true });
        });

        app.get("/logout", async (req, res) => {
            res.clearCookie("token")
                .send({ success: true });
        });

        app.get("/menus", async (req, res) => {
            let filter = {};
            const page = parseInt(req.query?.page);
            const size = parseInt(req.query?.size);
            const query = req.query?.category;
            console.log({ page, size });
            if (query) {
                filter = { category: query }
            }
            const result = await menusCollection.find(filter).skip(page * size).limit(size).toArray();
            res.send(result);

        });

        app.get("/menus/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await menusCollection.findOne(query);
            res.send(result);
        });

        app.get("/menusCount", async (req, res) => {
            let options = {};
            const query = req.query?.category;
            console.log(query);
            if (query) {
                options = { category: query }
            }
            const count = await menusCollection.countDocuments(options);
            res.send({ count });

        });

        app.post("/menus", verifyToken, verifyAdmin, async (req, res) => {
            const menu = req.body;
            console.log(menu);
            const result = await menusCollection.insertOne(menu);
            res.send(result);
        });

        app.patch("/menus/:id", async (req, res) => {
            const id = req.params.id;
            const menu = req.body;
            console.log(id, menu);
            const filter = { _id: new ObjectId(id) };
            const UpdatedMenu = {
                $set: {
                    name: menu.name,
                    recipe: menu.recipe,
                    category: menu.category,
                    price: parseFloat(menu.price),
                }
            };
            const result = await menusCollection.updateOne(filter, UpdatedMenu);
            res.send(result);
        });

        app.patch("/menus/image/:id", async (req, res) => {
            const id = req.params.id;
            const menu = req.body;
            console.log(id, menu);
            const filter = { _id: new ObjectId(id) };
            const UpdatedMenu = {
                $set: {
                    image: menu.image,
                }
            };
            const result = await menusCollection.updateOne(filter, UpdatedMenu);
            res.send(result);
        });


        app.delete("/menus/:id", verifyToken, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await menusCollection.deleteOne(query);
            res.send(result);
        });

        app.post("/carts", async (req, res) => {
            const cart = req.body;
            console.log(cart);
            const result = await cartsCollection.insertOne(cart);
            res.send(result);
        });

        app.get("/carts", async (req, res) => {
            let options = {};
            const email = req.query?.email;
            if (email) {
                options = { userEmail: email };
            }
            const result = await cartsCollection.find(options).toArray();
            res.send(result);
        });

        app.delete("/carts/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartsCollection.deleteOne(query);
            res.send(result);
        });

        app.delete("/carts", async (req, res) => {
            const email = req.query?.email;
            const query = { userEmail: email };
            const result = await cartsCollection.deleteMany(query);
            res.send(result);
        });


        app.get("/users", verifyToken, verifyAdmin, async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        });

        app.put("/users", async (req, res) => {
            const user = req.body;
            console.log(user);
            const filter = { email: user.email };
            const options = { upsert: true };
            const UpdatedUser = {
                $set: {
                    name: user.name,
                    email: user.email,
                    image: user.image,
                }
            };
            const result = await userCollection.updateOne(filter, UpdatedUser, options);
            res.send(result);
        });

        app.patch("/users/admin/:id", async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            console.log(id, user);
            const filter = { _id: new ObjectId(id) };
            const UpdatedUser = {
                $set: {
                    role: user.role,
                }
            };
            const result = await userCollection.updateOne(filter, UpdatedUser);
            res.send(result);
        });

        app.get("/users/admin/:email", verifyToken, async (req, res) => {
            const email = req.params.email;
            if (req.user?.email !== email) {
                return res.status(403).send({ message: 'Forbidden' });
            }
            const query = { email: email };
            const user = await userCollection.findOne(query);
            const admin = user.role === "admin";
            console.log({ admin });
            res.send({ admin });
        });

        // payment intent
        app.post("/create-payment-intent", async (req, res) => {
            const { price } = req.body;
            const amount = parseInt(price * 100);
            console.log({ amount });
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: "usd",
                payment_method_types: ['card']
            });
            res.send({
                clientSecret: paymentIntent.client_secret,
            });
        });

        app.post("/payments", async (req, res) => {
            const payment = req.body;
            console.log(payment);
            const query = {
                _id: {
                    $in: payment.cartIds?.map(id => new ObjectId(id))
                }
            };
            const paymentResult = await paymentCollection.insertOne(payment);
            const deletedResult = await cartsCollection.deleteMany(query);
            res.send({ paymentResult, deletedResult });
        });

        app.get("/payments", async (req, res) => {
            const result = await paymentCollection.find().toArray();
            res.send(result);
        });



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Bistro Boss Server is running');
});

app.listen(port, () => {
    console.log(`Bistro Boss Server is running on port ${port}`);
});