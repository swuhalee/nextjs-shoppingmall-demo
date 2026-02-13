import { InferSchemaType, Model, Schema, Types, model, models } from "mongoose";

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, default: 1, min: 1 },
    size: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    shipTo: { type: Schema.Types.Mixed, required: true },
    contact: { type: Schema.Types.Mixed, required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, default: "preparing" },
    items: { type: [orderItemSchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type OrderItem = InferSchemaType<typeof orderItemSchema>;
export type Order = InferSchemaType<typeof orderSchema> & {
  _id: Types.ObjectId;
};

const OrderModel = (models.Order as Model<Order>) || model<Order>("Order", orderSchema);

export default OrderModel;
