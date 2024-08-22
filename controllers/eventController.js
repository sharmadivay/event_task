import connect from "../config/connectDB.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import { MongoClient } from "mongodb";

// create an event
export const registerController = async (req, res) => {
  const db = await connect();
  // console.log(req);
  try {
    const {
      name,
      tagline,
      schedule,
      description,
      moderator,
      category,
      sub_category,
      rigor_rank,
    } = req.body;

    const imageLocalPath = req.file.path;

    const image = await uploadOnCloudinary(imageLocalPath);

    const newEvent = {
      name,
      tagline,
      schedule,
      description,
      moderator,
      category,
      sub_category,
      rigor_rank,
      image: image?.url || "",
    };

    const collection = db.collection("events");
    await collection.insertOne(newEvent);

    res.send("Success");
  } catch (error) {
    console.log(error);
    res.send("Error occur in registration");
  }
};

// get event from id
export const getOneEventController = async (req, res) => {
  try {
    const { id } = req.params.id;
    const db = await connect();
    const collection = db.collection("events");

    const event = await collection.findOne({
      id,
    });

    if (!event) {
      res.status(404).send("Event not found");
    }
    res.json(event);
  } catch (error) {
    console.log(error);
    res.send("Error occur in get event");
  }
};

// update an event
export const updateController = async (req, res) => {
  const { id } = req.params.id;
  try {
    const {
      name,
      tagline,
      schedule,
      description,
      moderator,
      category,
      sub_category,
      rigor_rank,
    } = req.body;

    const imageLocalPath = req.file ? req.file.path : "";

    const image = imageLocalPath
      ? await uploadOnCloudinary(imageLocalPath)
      : "";

    const db = await connect();
    const collection = db.collection("events");

    const event = await collection.findOne({
      id,
    });

    if (!event) {
      return res.status(404).send("Event not found");
    }

    const newEvent = {
      name: name || event.name,
      tagline: tagline || event.tagline,
      schedule: schedule || event.schedule,
      description: description || event.description,
      moderator: moderator || event.moderator,
      category: category || event.category,
      sub_category: sub_category || event.sub_category,
      rigor_rank: rigor_rank || event.rigor_rank,
      image: image?.url || event.image,
    };

    await collection.findOneAndUpdate({ id }, { $set: newEvent });

    res.send("Updated");
  } catch (error) {
    console.log(error);
    res.send("Error occur in update");
  }
};

// delete an event
export const deleteController = async (req, res) => {
  try {
    const { id } = req.params.id;
    const db = await connect();
    const collection = db.collection("events");

    const event = await collection.findOne({ id });

    if (!event) {
      res.send("Event not found");
    }

    const deletedEvent = await collection.findOneAndDelete({ id });

    res.send("Event deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in deleting");
  }
};

// get events
export const getEventsController = async (req, res) => {
  try {
    const { type, limit = 5, page = 1 } = req.query;

    const db = await connect();
    const collection = db.collection("events");

    let query = {};
    if (type === "latest") {
      query = {};
    }

    const options = {
      sort: { schedule: -1 },
      skip: (page - 1) * parseInt(limit),
      limit: parseInt(limit),
    };

    const events = await collection.find(query, options).toArray();

    res.json(events);
  } catch (error) {
    console.log(error);
    res.send("Error in getting events");
  }
};
