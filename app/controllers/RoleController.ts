import { redirect } from "@remix-run/node";
import type { RoleInterface } from "../types";
import { commitFlashSession, getFlashSession } from "~/flash-session";
import Role from "~/models/Role";

export default class RoleController {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  /**
   * Retrieve all Role
   * @param param0 pag
   * @returns {roles: RoleInterface, page: number}
   */
  public async getRoles({
    page,
    search_term,
    limit = 12,
  }: {
    page?: number;
    search_term?: string;
    limit?: number;
  }): Promise<{ roles: RoleInterface[]; totalPages: number }> {
    const skipCount = (page - 1) * limit; // Calculate the number of documents to skip

    const searchFilter = search_term
      ? {
          $or: [
            {
              name: {
                $regex: new RegExp(
                  search_term
                    .split(" ")
                    .map((term) => `(?=.*${term})`)
                    .join(""),
                  "i"
                ),
              },
            },
            {
              description: {
                $regex: new RegExp(
                  search_term
                    .split(" ")
                    .map((term) => `(?=.*${term})`)
                    .join(""),
                  "i"
                ),
              },
            },
          ],
        }
      : {};

    try {
      const roles = await Role.find(searchFilter)
        // .skip(skipCount)
        // .limit(limit)
        .populate("permissions")
        .sort({ name: "asc" })
        .exec();

      const totalRolesCount = await Role.countDocuments(searchFilter).exec();
      const totalPages = Math.ceil(totalRolesCount / limit);

      return { roles, totalPages };
    } catch (error) {
      console.log(error);

      throw new Error("Error retrieving roles");
    }
  }

  public async getRole({ id }: { id: string }) {
    try {
      const role = await Role.findById(id).populate("images");
      // const reviews = await this.Reviews.find({ role: id }).populate("user");

      // role.reviews = reviews;
      return role;
    } catch (error) {
      console.error("Error retrieving role:", error);
    }
  }

  public createRole = async ({
    path,
    name,
    permissions,
  }: {
    path: string;
    name: string;
    permissions: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const existingRole = await Role.findOne({ name });
    // const settingsController = await new SettingsController(this.request);
    // const generalSettings = await settingsController.getGeneralSettings();

    if (existingRole) {
      session.flash("message", {
        title: "Role already exists",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    const role = await Role.create({
      name,
      permissions,
    });

    if (!role) {
      session.flash("message", {
        title: "Error Adding Role",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    // if (generalSettings?.separateStocks) {
    //   const newRole = await Role.findById(role?._id);
    //   let stock = await StockHistory.create({
    //     user: adminId,
    //     role: role?._id,
    //     quantity: parseInt(quantity),
    //     price: parseFloat(price),
    //     costPrice: parseFloat(costPrice),
    //   });
    //   newRole.stockHistory.push(stock);
    //   await newRole.save();
    // }

    session.flash("message", {
      title: "Role Added Successful",
      status: "success",
    });
    return redirect(path, {
      headers: {
        "Set-Cookie": await commitFlashSession(session),
      },
    });
  };

  /**
   * Update role
   * @param param0 _id, name, price, description, category, quantity, costPrice
   * @returns null
   */
  public updateRole = async ({
    path,
    _id,
    name,
    permissions,
  }: {
    path: string;
    _id: string;
    name: string;
    permissions: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Role.findByIdAndUpdate(_id, {
        name,
        permissions,
      });

      session.flash("message", {
        title: "Role Updated Successful",
        status: "success",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      session.flash("message", {
        title: "Error Updating Role",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public deleteRole = async ({ _id, path }: { _id: string; path: string }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Role.findByIdAndDelete(_id);

      session.flash("message", {
        title: "Role Deleted Successful",
        status: "success",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (err) {
      console.log(err);

      session.flash("message", {
        title: "Error Deleting Role",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };
}
