import mongoose from 'mongoose';

const GeeksForGeeksUser = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  stars: { type: Number, default: 0 },
  education: { type: String, default: 'Not Available' },
  rank: { type: String, default: 'Not Available' },
  skills: { type: String, default: 'Not Available' },
  contestRating: [{ type: String }], 
  streak: { type: String, default: '0' },
  contestAttended: { type: String, default: '0' },
  globalRank: { type: String, default: 'Not Available' },
  percentageInfo: { type: String, default: 'Not Available' },
  problemNames: [{ type: String }], 
  difficultyLevels: [{ difficulty: String, solved: Number }],
}, { timestamps: true });

export default mongoose.model('GeeksForGeeksUser', GeeksForGeeksUser);
