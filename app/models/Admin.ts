import { Schema } from "mongoose";
import mongoose from "~/mongoose";
import { AdminInterface } from "~/types";
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// Create a Mongoose schema
const adminSchema = new Schema<AdminInterface>(
  {
    firstName: String,
    lastName: String,
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [emailRegex, "Invalid email format"],
    },
    phone: {
      type: String,
      required: false,
      unique: true,
    },
    role: {
      type: String,
      required: false,
    },
    permissions: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

let Admin: mongoose.Model<AdminInterface>;
try {
  Admin = mongoose.model<AdminInterface>("admins");
} catch (error) {
  Admin = mongoose.model<AdminInterface>("admins", adminSchema);
}

export default Admin;
