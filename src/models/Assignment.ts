// app/models/Assignment.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  orderId: string;
  partnerId: string;
  timestamp: Date;
  status: 'success' | 'failed';
  reason?: string;
}

const AssignmentSchema: Schema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  partnerId: { type: Schema.Types.ObjectId, ref: 'DeliveryPartner', required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['success', 'failed'], required: true },
  reason: String
});

export default mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);