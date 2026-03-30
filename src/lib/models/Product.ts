import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0,
  },
  image: {
    type: String,
    required: [true, 'Product image is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
    min: 0,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
