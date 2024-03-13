import {
  SessionStorage,
  createCookieSessionStorage,
  json,
  redirect,
} from "@remix-run/node";
import type { CustomerInterface } from "../types";
import { commitFlashSession, getFlashSession } from "~/flash-session";
import Customer from "~/models/Customer";
import bcrypt from "bcryptjs";

export default class CustomerController {
  private request: Request;
  private storage: SessionStorage;

  constructor(request: Request) {
    this.request = request;

    const secret = process.env.SESSION_SECRET;
    if (!secret) {
      throw new Error("No session secret provided");
    }
    this.storage = createCookieSessionStorage({
      cookie: {
        name: "__session",
        secrets: [secret],
        sameSite: "lax",
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      },
    });
  }

  private async getCustomerSession() {
    return this.storage.getSession(this.request.headers.get("Cookie"));
  }

  private async createCustomerSession(userId: string, redirectTo: string) {
    const session = await this.storage.getSession();
    session.set("userId", userId);

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await this.storage.commitSession(session),
      },
    });
  }

  public async requireCustomerId(
    redirectTo: string = new URL(this.request.url).pathname
  ) {
    const session = await this.getCustomerSession();

    const customerId = session.get("customerId");
    if (!customerId || typeof customerId !== "string") {
      const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
      throw redirect(`/customer/login?${searchParams}`);
    }

    return customerId;
  }

  /**
   * Get the current logged in user's Id
   * @returns customer_id :string
   */
  public async getCustomerId() {
    const session = await this.getCustomerSession();
    const customerId = session.get("customerId");
    if (!customerId || typeof customerId !== "string") {
      return null;
    }
    return customerId;
  }

  public async getCustomer() {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const customerId = await this.requireCustomerId();

    try {
      const customer = await Customer.findById(customerId).select("-password");

      if (!customer) {
        session.flash("message", {
          title: "No Account!",
          status: "error",
        });
        return redirect(`/customer/login`, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
      }

      return customer;
    } catch {
      throw this.logout();
    }
  }

  public async loginCustomer({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const customer = await Customer.findOne({
      email,
    });

    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);
    // console.log(customer);

    if (!customer) {
      console.log("No Account with email!");
      session.flash("message", {
        title: "No Account with email!",
        status: "error",
      });
      return redirect(`/customer/login`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    const valid = await bcrypt.compare(password, customer.password);

    if (!valid) {
      console.log("Invalid Credentials");
      session.flash("message", {
        title: "Invalid Credentials",
        status: "error",
      });
      return redirect(`/customer/login`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    return this.createCustomerSession(customer.id, "/customer");
  }

  /**
   * Register a new Customer account
   * @param username Customer's username
   * @param email Customer's email
   * @param password Customer's password
   * @returns null if user already exists, else returns a session
   */
  public registerCustomer = async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const existingCustomer = await Customer.findOne({ email });

    if (existingCustomer) {
      console.log("Invalid Credentials");
      session.flash("message", {
        title: "Email already taken",
        status: "error",
      });
      return redirect(`/login`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Customer.create({
      username,
      email,
      password: hashedPassword,
    });

    if (!user) {
      session.flash("message", {
        title: "Error occured while creating user!",
        status: "error",
      });
      return redirect(`/login`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    return this.createCustomerSession(user._id, "/");
  };

  public updateProfile = async ({
    firstName,
    lastName,
    email,
  }: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    const userId = await this.getCustomerId();
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const user = await Customer.findByIdAndUpdate(
        userId,
        {
          firstName,
          lastName,
          email,
        },
        {
          new: true,
        }
      );
      session.flash("message", {
        title: "Profile Updated",
        status: "success",
      });
      return redirect(`/profile`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      session.flash("message", {
        title: "Error Updating Profile!",
        status: "error",
      });
      return redirect(`/profile`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public changePassword = async ({
    currentPassword,
    password,
  }: {
    currentPassword: string;
    password: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const userId = await this.getCustomerId();
    const customer = await Customer.findById(userId);

    if (customer) {
      const valid = await bcrypt.compare(currentPassword, customer.password);

      if (!valid) {
        session.flash("message", {
          title: "Incorrect Password!",
          status: "error",
        });
        return redirect(`/profile`, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await Customer.findByIdAndUpdate(customer._id, {
        password: hashedPassword,
      });
      session.flash("message", {
        title: "Password Changed",
        status: "success",
      });
      return redirect(`/profile`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } else {
      session.flash("message", {
        title: "Customer does not exist!",
        status: "error",
      });
      return redirect(`/profile`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public async logout() {
    const session = await this.getCustomerSession();

    return redirect("/login", {
      headers: {
        "Set-Cookie": await this.storage.destroySession(session),
      },
    });
  }

  /**
   * Retrieve all Customer
   * @param param0 pag
   * @returns {customers: CustomerInterface[], page: number}
   */
  public async getCustomers({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<{ customers: CustomerInterface[]; totalPages: number }> {
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
      const customers = await Customer.find(searchFilter)
        // .skip(skipCount)
        // .limit(limit)
        // .populate("images")
        // .populate("category")
        // .populate("stockHistory")
        .sort({ name: "asc" })
        .exec();

      const totalCustomersCount = await Customer.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalCustomersCount / limit);

      return { customers, totalPages };
    } catch (error) {
      console.log(error);

      throw new Error("Error retrieving customers");
    }
  }

  public async getCustomerDetails({ id }: { id: string }) {
    try {
      const product = await Customer.findById(id).populate("images");
      // const reviews = await this.Reviews.find({ product: id }).populate("user");

      // product.reviews = reviews;
      return product;
    } catch (error) {
      console.error("Error retrieving product:", error);
    }
  }

  public createCustomer = async ({
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
    const inventory = await Customer.create({
      quantity,
      stockDate,
      description,
      location,
      availability,
      code,
    });

    if (!inventory) {
      session.flash("message", {
        title: "Error Adding Customer",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    session.flash("message", {
      title: "Customer Added Successful",
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

    const inventory = await Customer.create(data);
    if (!inventory) {
      session.flash("message", {
        title: "Error Importing Customers",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    session.flash("message", {
      title: "Customers Imported Successful",
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
  public updateCustomer = async ({
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
      const updated = await Customer.findByIdAndUpdate(
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
        title: "Customer Updated Successful",
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
        title: "Error Updating Customer",
        status: "error",
      });
      return redirect("/inventory", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public stockCustomer = async ({
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
    const product = await Customer.findById(_id);
    const generalSettings = await new SettingsController(
      this.request
    ).getGeneralSettings();

    // const customerController = await new CustomerController(this.request);
    // const customerId = await customerController.getCustomerId();

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
      user: customerId,
      product: _id,
      quantity,
      price: parseFloat(price),
      costPrice: parseFloat(costPrice),
      note,
    });

    session.flash("message", {
      title: "Customer Stocked Successful",
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

  public deleteCustomer = async ({
    _id,
    path,
  }: {
    _id: string;
    path: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Customer.findByIdAndDelete(_id);

      // return true;
      session.flash("message", {
        title: "Customer Deleted Successful",
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
        title: "Error Deleting Customer",
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

      const totalCustomersCount = await Category.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalCustomersCount / limit);

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

  public addCustomerImage = async ({
    productId,
    images,
  }: {
    productId: string;
    images: any;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const imagePromises = images.map(async (image) => {
      try {
        // Assuming CustomerImage.create returns a promise
        const imageRes = await CustomerImage.create({
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
      const product = await Customer.findById(productId);

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
