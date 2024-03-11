import type { Schema } from "mongoose";
import mongoose from "~/mongoose";
import type { InventoryInterface } from "../types";

const InventorySchema: Schema = new mongoose.Schema(
  {
    code: String,
    description: String,
    quantity: {
      type: Number,
      default: 1,
    },
    stockDate: {
      type: Date,
      default: Date.now,
    },
    location: String,
    availability: String,
  },
  { timestamps: true }
);

let Inventory: mongoose.Model<InventoryInterface>;

try {
  Inventory = mongoose.model<InventoryInterface>("Inventorys");
} catch (error) {
  Inventory = mongoose.model<InventoryInterface>("Inventorys", InventorySchema);
}

export default Inventory;
