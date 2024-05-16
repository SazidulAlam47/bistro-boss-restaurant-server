const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xyqwep0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();

        const database = client.db("BistroDB");
        const menusCollection = database.collection("menu");
        const cartsCollection = database.collection("cart");
        const userCollection = database.collection("users");

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

        app.delete("/carts/", async (req, res) => {
            const email = req.query?.email;
            const query = { userEmail: email };
            const result = await cartsCollection.deleteMany(query);
            res.send(result);
        });


        app.get("/users", async (req, res) => {
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