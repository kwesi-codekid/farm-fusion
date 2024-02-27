import { Schema } from "mongoose";
import mongoose from "~/mongoose";
import { NotificationInterface } from "~/types";

// Create a Mongoose schema
const schema = new Schema<NotificationInterface>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
      required: false,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
      required: false,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

let Notification: mongoose.Model<NotificationInterface>;
try {
  Notification = mongoose.model<NotificationInterface>("notifications");
} catch (error) {
  Notification = mongoose.model<NotificationInterface>("notifications", schema);
}

export default Notification;
