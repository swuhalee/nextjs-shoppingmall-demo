import { InferSchemaType, Model, Schema, Types, model, models } from "mongoose";

const cartItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    size: { type: String, required: true, trim: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export type CartItem = InferSchemaType<typeof cartItemSchema>;
export type Cart = InferSchemaType<typeof cartSchema> & {
  _id: Types.ObjectId;
};

const CartModel = (models.Cart as Model<Cart>) || model<Cart>("Cart", cartSchema);

export default CartModel;
