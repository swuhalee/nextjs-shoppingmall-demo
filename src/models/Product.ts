import { InferSchemaType, Model, Schema, Types, model, models } from "mongoose";

const productSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0 },
    category: [{ type: String, required: true, trim: true }],
    status: { type: String, default: "active" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type Product = InferSchemaType<typeof productSchema> & {
  _id: Types.ObjectId;
};

const ProductModel = (models.Product as Model<Product>) || model<Product>("Product", productSchema);

export default ProductModel;
