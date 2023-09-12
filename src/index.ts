import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookiesParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router/index";
import dotenv from "dotenv";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookiesParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server is running on port 8080");
});

const config = dotenv.config();
const MONGO_URI = `mongodb+srv://${config.parsed!.MONGO_USER}:${
  config.parsed!.MONGO_API_KEY
}@cluster0.qkaum13.mongodb.net/?retryWrites=true&w=majority`;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URI);
mongoose.connection.on("connected", () => console.log("Connected to Mongo"));
mongoose.connection.on("error", (error) => console.log(error.message));

app.use("/", router());

// async function run() {
//   try {
//     await mongoose.connect(MONGO_URI, {
//       serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//       },
//     });
//     await mongoose.connection.db.command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//     app.use("/", router());
//   } catch (error) {
//     if (error instanceof Error) {
//       console.log(error.message);
//       mongoose.connection.on("error", (error) => console.log(error.message));
//     }
//   }
//   // finally {
//   //   await mongoose.connection.close();
//   // }
// }
//run();

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(MONGO_URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } catch (error) {
//     error instanceof Error ? console.log(error.message) : console.log(error);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
