import mongoose, { Document, Schema } from 'mongoose';

export interface IPortfolioItem extends Document {
  title: string;
  image: string;
  category: string;
  isPublished: boolean;
  createdAt: Date;
}

const PortfolioItemSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Portfolio title is required'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Portfolio image is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Portfolio category is required'],
    trim: true,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.PortfolioItem || mongoose.model<IPortfolioItem>('PortfolioItem', PortfolioItemSchema);
