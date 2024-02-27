import { redirect } from "@remix-run/node";
import type { PermissionInterface } from "../types";
import { commitFlashSession, getFlashSession } from "~/flash-session";
import Permission from "~/models/Permission";

export default class PermissionController {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  /**
   * Retrieve all Permission
   * @param param0 pag
   * @returns {permissions: PermissionInterface, page: number}
   */
  public async getPermissions({
    page,
    search_term,
    limit = 12,
  }: {
    page?: number;
    search_term?: string;
    limit?: number;
  }): Promise<{ permissions: PermissionInterface[]; totalPages: number }> {
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
      const permissions = await Permission.find(searchFilter)
        // .skip(skipCount)
        // .limit(limit)
        // .populate("category")
        // .populate("stockHistory")
        .sort({ name: "asc" })
        .exec();

      const totalPermissionsCount = await Permission.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalPermissionsCount / limit);

      return { permissions, totalPages };
    } catch (error) {
      console.log(error);

      throw new Error("Error retrieving permissions");
    }
  }

  public async getPermission({ id }: { id: string }) {
    try {
      const permission = await Permission.findById(id).populate("images");
      // const reviews = await this.Reviews.find({ permission: id }).populate("user");

      // permission.reviews = reviews;
      return permission;
    } catch (error) {
      console.error("Error retrieving permission:", error);
    }
  }

  public createPermission = async ({
    // path,
    name,
    action,
    description,
  }: {
    // path: string;
    name: string;
    action: string;
    description: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const existingPermission = await Permission.findOne({ name });
    // const settingsController = await new SettingsController(this.request);
    // const generalSettings = await settingsController.getGeneralSettings();

    if (existingPermission) {
      return {
        error: "Permission already exists",
      };
      session.flash("message", {
        title: "Permission already exists",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    const permission = await Permission.create({
      name,
      description,
      action,
    });

    if (!permission) {
      return {
        error: "Error Adding Permission",
      };
      session.flash("message", {
        title: "Error Adding Permission",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    return {
      message: "Permission Added Successful",
      status: "success",
    };
    session.flash("message", {
      title: "Permission Added Successful",
      status: "success",
    });
    return redirect(path, {
      headers: {
        "Set-Cookie": await commitFlashSession(session),
      },
    });
  };

  /**
   * Update permission
   * @param param0 _id, name, price, description, category, quantity, costPrice
   * @returns null
   */
  public updatePermission = async ({
    path,
    _id,
    name,
    action,
    description,
    category,
    quantity,
    costPrice,
  }: {
    path: string;
    _id: string;
    name: string;
    action: string;
    description: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Permission.findByIdAndUpdate(_id, {
        name,
        action,
        description,
      });

      session.flash("message", {
        title: "Permission Updated Successful",
        status: "success",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      session.flash("message", {
        title: "Error Updating Permission",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public deletePermission = async ({
    _id,
    path,
  }: {
    _id: string;
    path: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Permission.findByIdAndDelete(_id);

      session.flash("message", {
        title: "Permission Deleted Successful",
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
        title: "Error Deleting Permission",
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
