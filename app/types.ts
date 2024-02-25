// import { Document } from "mongoose";

export type AdminInterface = {
  _id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
};

export type User = {
  _id: string;
  name: string;
  email: string;
  age: number;
};

export type PaymentInterface = {
  _id: string;
  paymentMode: "cash" | "card" | "momo" | "cheque";
  phoneNumber: string;
  cardNumber: string;
  status: "pending" | "paid";
  createdAt: Date;
  updatedAt: Date;
};

export type ChurchInterface = {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AppointingAuthorityInterface = {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AppointingOfficerInterface = {
  _id: string;
  name: string;
  appointingAuthority: AppointingAuthorityInterface;
  createdAt: Date;
  updatedAt: Date;
};

export type BranchInterface = {
  _id: string;
  name: string;
  church: ChurchInterface;
  denomination: DenominationInterface;
  appointingOfficer: AppointingOfficerInterface;
  licence: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
};

export type DenominationInterface = {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MinisterInterface = {
  _id: string;
  name: string;
  branch: BranchInterface;
  church: ChurchInterface;
  denomination: DenominationInterface;
  appointingOfficer: AppointingOfficerInterface;
  region: string;
  source: string;
  location: string;
  licence: string;
  pageNumber: string;
  createdAt: Date;
  updatedAt: Date;
};
