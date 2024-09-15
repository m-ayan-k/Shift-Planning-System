import mongoose from 'mongoose';

const AvailabilitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  timezone: { type: String, required: true },
});

export default mongoose.models.Availability || mongoose.model('Availability', AvailabilitySchema);
