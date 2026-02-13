import { InferSchemaType, Model, Schema, Types, model, models } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    level: { type: String, default: "customer" },
    carts: [{ type: Schema.Types.ObjectId, ref: "Cart" }],
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type User = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
};

const UserModel = (models.User as Model<User>) || model<User>("User", userSchema);

export default UserModel;
