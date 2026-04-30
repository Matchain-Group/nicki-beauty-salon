import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
}

const LeadSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Lead name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Lead email is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Lead phone is required'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Lead message is required'],
    trim: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
