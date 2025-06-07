import mongoose from 'mongoose'
import { type } from 'os';
const adminSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  company: String,
  password: String,
  role: { type: String, default:"admin"},
  isVerified: {type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Admin', adminSchema);
