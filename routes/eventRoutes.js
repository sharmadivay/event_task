import express from "express";
import {
  deleteController,
  getEventsController,
  getOneEventController,
  registerController,
  updateController,
} from "../controllers/eventController.js";
import { upload } from "../middlewares/multerMiddleware.js";

const route = express.Router();

// create a event
route.post("/events", upload.single("image"), registerController);

// get event by id
route.get("/events/:id", getOneEventController);

// update an event
route.put("/events/:id", upload.single("image"), updateController);

// delete an event
route.delete("/events/:id", deleteController);

// get all events
route.get("/events", getEventsController);

export default route;
