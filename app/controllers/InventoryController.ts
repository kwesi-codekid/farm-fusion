import { redirect } from "@remix-run/node";
import type { InventoryInterface } from "../types";
import { commitFlashSession, getFlashSession } from "~/flash-session";
import Inventory from "~/models/Inventory";

export default class InventoryController {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  /**
   * Retrieve all Inventory
   * @param param0 pag
   * @returns {inventories: InventoryInterface[], page: number}
   */
  public async getInventories({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<{ inventories: InventoryInterface[]; totalPages: number }> {
    const skipCount = (page - 1) * limit;
    const searchFilter = search_term
      ? {
          $or: [
            {
              code: {
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
      const inventories = await Inventory.find(searchFilter)
        // .skip(skipCount)
        // .limit(limit)
        // .populate("images")
        // .populate("category")
        // .populate("stockHistory")
        .sort({ name: "asc" })
        .exec();

      const totalInventoriesCount = await Inventory.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalInventoriesCount / limit);

      return { inventories, totalPages };
    } catch (error) {
      console.log(error);

      throw new Error("Error retrieving inventories");
    }
  }

  public async getInventory({ id }: { id: string }) {
    try {
      const product = await Inventory.findById(id).populate("images");
      // const reviews = await this.Reviews.find({ product: id }).populate("user");

      // product.reviews = reviews;
      return product;
    } catch (error) {
      console.error("Error retrieving product:", error);
    }
  }

  public createInventory = async ({
    path,
    quantity,
    stockDate,
    description,
    location,
    availability,
    code,
  }: {
    path: string;
    quantity: string;
    stockDate: string;
    description: string;
    location: string;
    availability: string;
    code: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const inventory = await Inventory.create({
      quantity,
      stockDate,
      description,
      location,
      availability,
      code,
    });

    if (!inventory) {
      session.flash("message", {
        title: "Error Adding Inventory",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    session.flash("message", {
      title: "Inventory Added Successful",
      status: "success",
    });
    return redirect(path, {
      headers: {
        "Set-Cookie": await commitFlashSession(session),
      },
    });
  };

  /**
   * Import inventory from csv
   * @param data Array of inventory
   * @returns null
   */
  public importBatch = async (data) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const inventory = await Inventory.create(data);
    if (!inventory) {
      session.flash("message", {
        title: "Error Importing Inventories",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    session.flash("message", {
      title: "Inventories Imported Successful",
      status: "success",
    });
    return redirect(path, {
      headers: {
        "Set-Cookie": await commitFlashSession(session),
      },
    });
  };

  /**
   * Update product
   * @param param0 _id, name, price, description, category, quantity, costPrice
   * @returns null
   */
  public updateInventory = async ({
    _id,
    path,
    stockDate,
    description,
    location,
    availability,
    quantity,
    code,
  }: {
    _id: string;
    path: string;
    stockDate: string;
    description: string;
    location: string;
    availability: string;
    quantity: string;
    code: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const updated = await Inventory.findByIdAndUpdate(
        _id,
        {
          stockDate,
          description,
          location,
          availability,
          quantity,
          code,
        },
        { new: true }
      );

      session.flash("message", {
        title: "Inventory Updated Successful",
        status: "success",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      console.log(error);

      session.flash("message", {
        title: "Error Updating Inventory",
        status: "error",
      });
      return redirect("/inventory", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public stockInventory = async ({
    _id,
    quantity,
    operation,
    price,
    costPrice,
    note,
  }: {
    _id: string;
    quantity: string;
    operation: string;
    price: string;
    costPrice: string;
    note: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const product = await Inventory.findById(_id);
    const generalSettings = await new SettingsController(
      this.request
    ).getGeneralSettings();

    // const adminController = await new AdminController(this.request);
    // const adminId = await adminController.getAdminId();

    if (generalSettings?.separateStocks) {
      product.quantity += parseInt(quantity);
      product.stockHistory.push(stock);
      await product.save();
    } else {
      product.price = parseFloat(price);
      product.quantity += parseInt(quantity);
      await product.save();
    }

    await RestockHistory.create({
      user: adminId,
      product: _id,
      quantity,
      price: parseFloat(price),
      costPrice: parseFloat(costPrice),
      note,
    });

    session.flash("message", {
      title: "Inventory Stocked Successful",
      status: "success",
    });
    return redirect(`/inventory/${_id}`, {
      headers: {
        "Set-Cookie": await commitFlashSession(session),
      },
    });
  };

  public getStockHistory = async ({ id }: { id: string }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const stockHistory = await RestockHistory.find({ product: id })
        .populate("user")
        .sort({ createdAt: -1 })
        .exec();

      return stockHistory;
    } catch (error) {
      console.log(error);

      session.flash("message", {
        title: "Error Getting Stock History",
        status: "error",
      });
      return redirect(`/inventory/${id}`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public deleteInventory = async ({
    _id,
    path,
  }: {
    _id: string;
    path: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Inventory.findByIdAndDelete(_id);

      // return true;
      session.flash("message", {
        title: "Inventory Deleted Successful",
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
        title: "Error Deleting Inventory",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public async getAllCategories() {
    try {
      const categories = await Category.find();

      return categories;
    } catch (error) {
      console.error("Error retrieving categories:", error);
    }
  }

  public async getCategories({
    page,
    search_term,
  }: {
    page: number;
    search_term: string;
  }) {
    const limit = 10; // Number of orders per page
    const skipCount = (page - 1) * limit; // Calculate the number of documents to skip

    const searchFilter = search_term
      ? {
          $or: [
            { name: { $regex: search_term, $options: "i" } }, // Case-insensitive search for email
            { description: { $regex: search_term, $options: "i" } }, // Case-insensitive search for username
          ],
        }
      : {};

    try {
      const categories = await Category.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .exec();

      const totalInventoriesCount = await Category.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalInventoriesCount / limit);

      return { categories, totalPages };
    } catch (error) {
      console.error("Error retrieving categories:", error);
    }
  }

  public async getFeaturedCategories() {
    try {
      const categories = await Category.find({
        featured: true,
      }).exec();

      return categories;
    } catch (error) {
      console.error("Error retrieving categories:", error);
    }
  }

  public async getActiveCategories() {
    try {
      const categories = await Category.find({
        status: "active",
      }).exec();

      return categories;
    } catch (error) {
      console.error("Error retrieving categories:", error);
    }
  }

  public async createCategory({
    name,
    description,
    status,
    featured,
  }: {
    name: string;
    description: string;
    status?: string;
    featured?: string;
  }) {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      session.flash("message", {
        title: "Category already exists",
        status: "error",
      });
      return redirect(`/categories`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    const category = await Category.create({
      name,
      status,
      description,
      featured: featured == "true" ? 1 : 0,
    });

    if (!category) {
      session.flash("message", {
        title: "Error Adding Category",
        status: "error",
      });
      return redirect(`/categories`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    return category;
    // session.flash("message", {
    //   title: "Category Added Successful",
    //   status: "success",
    // });
    // return redirect(`/categories`, {
    //   headers: {
    //     "Set-Cookie": await commitFlashSession(session),
    //   },
    // });
  }

  public async updateCategory({
    id,
    name,
    description,
    status,
    featured,
  }: {
    id: string;
    name: string;
    description?: string;
    status?: string;
    featured?: string;
  }) {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const updated = await Category.findByIdAndUpdate(
        id,
        {
          name,
          status,
          description,
          featured: featured == "true" ? true : false,
        },
        {
          new: true,
        }
      );

      return updated;
      // session.flash("message", {
      //   title: "Category Updated Successful",
      //   status: "success",
      // });
      // return redirect(`/categories`, {
      //   headers: {
      //     "Set-Cookie": await commitFlashSession(session),
      //   },
      // });
    } catch (error) {
      session.flash("message", {
        title: "Error Updating Category",
        status: "error",
      });
      return redirect(`/categories`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  }

  public deleteCategory = async (id: string) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Category.findByIdAndDelete(id);

      return true;
      session.flash("message", {
        title: "Category Deleted Successful",
        status: "success",
      });
      return redirect(`/categories`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (err) {
      console.log(err);
      session.flash("message", {
        title: "Error Deleting Category",
        status: "error",
      });
      return redirect(`/categories`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public addInventoryImage = async ({
    productId,
    images,
  }: {
    productId: string;
    images: any;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const imagePromises = images.map(async (image) => {
      try {
        // Assuming InventoryImage.create returns a promise
        const imageRes = await InventoryImage.create({
          url: image,
          product: productId,
        });
        return imageRes;
      } catch (error) {
        console.error(`Error creating product image: ${error}`);
        // Handle the error as needed
        return null;
      }
    });

    // Wait for all promises to resolve
    const results = await Promise.all(imagePromises);
    const successfulResults = results.filter((result) => result !== null);

    try {
      const product = await Inventory.findById(productId);

      const successfulIds = successfulResults.map((result) => result?._id);
      product.images.push(...successfulIds);
      await product.save();

      session.flash("message", {
        title: "Image Added Successful",
        status: "success",
      });
      return redirect(`/inventory/${productId}`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (err) {
      console.log(err);
      session.flash("message", {
        title: "Error Adding Image",
        status: "error",
      });
      return redirect(`/inventory/${productId}`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };
}
