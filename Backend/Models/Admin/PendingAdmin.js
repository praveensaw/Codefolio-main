import mongoose from 'mongoose'
const pendingAdminSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  company: String,
  token: String,
  tokenExpires: Date,
}, { timestamps: true });

export default mongoose.model('pendingAdmin', pendingAdminSchema);
