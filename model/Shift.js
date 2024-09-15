import mongoose from 'mongoose';

const ShiftSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  timezone: { type: String, required: true }, // Admin-selected timezone
});

export default mongoose.models.Shift || mongoose.model('Shift', ShiftSchema);
