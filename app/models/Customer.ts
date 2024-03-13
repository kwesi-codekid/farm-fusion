import type { Schema } from "mongoose";
import mongoose from "~/mongoose";
import type { CustomerInterface } from "../types";

const CustomerSchema: Schema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    address: String,
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
