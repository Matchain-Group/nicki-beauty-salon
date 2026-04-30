import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  customerName: string;
  email: string;
  phone: string;
  products: Array<{
    productId: mongoose.Types.ObjectId;
    title: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  paystackRef: string;
  status: 'pending' | 'paid';
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  products: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  }],
  total: {
    type: Number,
    required: [true, 'Order total is required'],
    min: 0,
  },
  paystackRef: {
    type: String,
    required: [true, 'Paystack reference is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
