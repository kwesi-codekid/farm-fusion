import mongoose from "~/mongoose";
import type { PermissionInterface } from "../types";

const PermissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let Permission: mongoose.Model<PermissionInterface>;
try {
  Permission = mongoose.model<PermissionInterface>("permissions");
} catch (error) {
  Permission = mongoose.model<PermissionInterface>(
    "permissions",
    PermissionSchema
  );
}

export default Permission;
