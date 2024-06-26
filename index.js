const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors({
    origin: [
        // "http://localhost:5173",
        "https://bistro-boss-restaurant-sazidulalam47.vercel.app"
    ],
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
        // await client.connect();

        const database = client.db("BistroDB");
        const menusCollection = database.collection("menu");
        const cartsCollection = database.collection("cart");
        const userCollection = database.collection("users");
        const paymentCollection = database.collection("payments");

        // admin check middleware
        const verifyAdmin = async (req, res, next) => {
            const email = req.user?.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            const isAdmin = user?.role === "admin";
            console.log({ isAdmin: isAdmin });
            console.log("check email", email);
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
                    secure: true,
                    sameSite: "none",
                })
                .send({ success: true });
        });

        app.get("/logout", async (req, res) => {
            res.clearCookie("token")
                .send({ success: true });
        });

        //menus
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

        app.patch("/menus/:id", verifyToken, verifyAdmin, async (req, res) => {
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

        app.patch("/menus/image/:id", verifyToken, verifyAdmin, async (req, res) => {
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

        app.post("/carts", verifyToken, async (req, res) => {
            const cart = req.body;
            console.log(cart);
            const result = await cartsCollection.insertOne(cart);
            res.send(result);
        });

        app.get("/carts/:email", verifyToken, async (req, res) => {
            const email = req.params?.email;
            if (email !== req.user.email) {
                return res.status(403).send({ message: 'Forbidden' });
            }
            const options = { userEmail: email };
            const result = await cartsCollection.find(options).toArray();
            res.send(result);
        });

        app.get("/carts", verifyToken, verifyAdmin, async (req, res) => {
            const result = await cartsCollection.find().toArray();
            res.send(result);
        });

        app.delete("/carts/:id", verifyToken, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartsCollection.deleteOne(query);
            res.send(result);
        });

        app.delete("/carts", verifyToken, async (req, res) => {
            const email = req.query?.email;
            const query = { userEmail: email };
            const result = await cartsCollection.deleteMany(query);
            res.send(result);
        });


        app.get("/users", verifyToken, verifyAdmin, async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        });

        app.put("/users", verifyToken, async (req, res) => {
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

        app.patch("/users/admin/:id", verifyToken, verifyAdmin, async (req, res) => {
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

            res.send({ admin });
        });

        // payment intent
        app.post("/create-payment-intent", verifyToken, async (req, res) => {
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

        app.post("/payments", verifyToken, async (req, res) => {
            const payment = req.body;
            console.log(payment);
            const query = {
                _id: {
                    $in: payment.cartIds?.map(id => new ObjectId(id))
                }
            };
            const paymentResult = await paymentCollection.insertOne(payment);
            const deletedResult = await cartsCollection.deleteMany(query);

            // send email to user
            mg.messages.create('sandboxbd823edc3f8b4d98b09b3571eca206d6.mailgun.org', {
                from: "Bistro boss <bistroboss@sandboxbd823edc3f8b4d98b09b3571eca206d6.mailgun.org>",
                to: ["anik55883@gmail.com"],
                subject: "Bistro Boss Order confirmation",
                text: "Testing some Mailgun awesomness!",
                html: `
                    <div>
                        <h1>Thank you for your order!</h1>
                        <p>Your order has been placed successfully.</p>
                        <p>your Transaction ID : ${payment.tnxId} </p>
                        <h3>We will send your Food very soon</h3>
                    </div>
                `
            })
                .then(msg => console.log(msg)) // logs response data
                .catch(err => console.error(err)); // logs any error

            res.send({ paymentResult, deletedResult });
        });

        app.get("/payments/email/:email", verifyToken, async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            if (email !== req.user.email) {
                return res.status(403).send({ message: 'Forbidden access' });
            }
            const result = await paymentCollection.find(query).toArray();
            res.send(result);
        });

        app.get("/payments", verifyToken, verifyAdmin, async (req, res) => {
            const result = await paymentCollection.find().toArray();
            res.send(result);
        });

        app.get("/payments/:id", verifyToken, async (req, res) => {
            const id = req.params.id;

            //check admin
            const email = req.user?.email;
            const queryAdmin = { email: email };
            const user = await userCollection.findOne(queryAdmin);
            const admin = user?.role === "admin";
            console.log({ admin: admin });

            const query = { _id: new ObjectId(id) };
            const result = await paymentCollection.findOne(query);

            if (req.user.email !== result.email && !admin) {
                return res.status(403).send({ message: 'Forbidden access' });
            }

            res.send(result);
        });

        app.get("/order-items/:orderId", verifyToken, async (req, res) => {
            const orderId = req.params.orderId;

            //check admin
            const email = req.user?.email;
            const queryAdmin = { email: email };
            const user = await userCollection.findOne(queryAdmin);
            const admin = user?.role === "admin";
            console.log({ admin: admin });

            const query = { _id: new ObjectId(orderId) };
            const options = {
                projection: { menuItemIds: 1, email: 1 },
            };
            const order = await paymentCollection.findOne(query, options);
            if (req.user.email !== order.email && !admin) {
                return res.status(403).send({ message: 'Forbidden access' });
            }
            const menuItemIdsObj = order.menuItemIds?.map(id => new ObjectId(id));
            const orderOption = {
                _id: {
                    $in: menuItemIdsObj
                }
            }
            const orderedItems = await menusCollection.find(orderOption).toArray();
            res.send(orderedItems);
        });

        app.patch("/orders/status/:id", verifyToken, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            console.log('update status');
            const payment = req.body;
            console.log(id, payment);
            const filter = { _id: new ObjectId(id) };
            const UpdatedPayment = {
                $set: {
                    status: payment.status,
                }
            };
            const result = await paymentCollection.updateOne(filter, UpdatedPayment);
            res.send(result);
        });


        // status
        app.get("/admin-status", verifyToken, verifyAdmin, async (req, res) => {
            const customers = await userCollection.estimatedDocumentCount();
            const products = await menusCollection.estimatedDocumentCount();
            const orders = await paymentCollection.estimatedDocumentCount();

            const result = await paymentCollection.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: "$price"
                        }
                    }
                }
            ]).toArray();

            const revenue = result.length > 0 ? result[0].totalRevenue : 0;

            res.send({ customers, products, orders, revenue });
        });

        app.get("/admin-order-status", verifyToken, verifyAdmin, async (req, res) => {
            const result = await paymentCollection.aggregate([
                {
                    $unwind: '$menuItemIds'
                },
                {
                    $addFields: {
                        menuItemIds: {
                            $toObjectId: '$menuItemIds'
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'menu',
                        localField: 'menuItemIds',
                        foreignField: '_id',
                        as: 'menuItems'
                    }
                },
                {
                    $unwind: '$menuItems'
                },
                {
                    $group: {
                        _id: '$menuItems.category',
                        quantity: { $sum: 1 },
                        revenue: { $sum: '$menuItems.price' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        category: '$_id',
                        quantity: 1,
                        revenue: 1
                    }
                }
            ]).toArray();

            res.send(result);
        });



        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch {
        console.log('Something went wrong');

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