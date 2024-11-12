// app/models/Order.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  area: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: 'pending' | 'assigned' | 'picked' | 'delivered';
  scheduledFor: string;
  assignedTo?: string;
  totalAmount: number;
}

const OrderSchema: Schema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  area: { type: String, required: true },
  items: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  status: { type: String, enum: ['pending', 'assigned', 'picked', 'delivered'], default: 'pending' },
  scheduledFor: { type: String, required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'DeliveryPartner' },
  totalAmount: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);