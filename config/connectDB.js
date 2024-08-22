import { MongoClient } from "mongodb";

const connect = async () => {
  try {
    const client = new MongoClient(`${process.env.MONGO_URL}`);
    await client.connect();
    console.log("db connected");
    const db = client.db("test"); // Replace with your database name
    return db;
  } catch (error) {
    console.log(error);
  }
};

export default connect;
