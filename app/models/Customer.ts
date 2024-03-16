import type { Schema } from "mongoose";
import mongoose from "~/mongoose";
import type { CustomerInterface } from "../types";

const CustomerSchema: Schema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: String,
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

let Customer: mongoose.Model<CustomerInterface>;

try {
  Customer = mongoose.model<CustomerInterface>("customers");
} catch (error) {
  Customer = mongoose.model<CustomerInterface>("customers", CustomerSchema);
}

export default Customer;
