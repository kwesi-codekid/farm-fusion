import mongoose from "~/mongoose";
import type { RoleInterface } from "~/types";

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "permissions",
      },
    ],
  },
  {
    timestamps: true,
  }
);

let Role: mongoose.Model<RoleInterface>;
try {
  Role = mongoose.model<RoleInterface>("roles");
} catch (error) {
  Role = mongoose.model<RoleInterface>("roles", RoleSchema);
}

export default Role;
