import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  company: { type: String, required: true, trim: true, maxlength: 120 },
  location: { type: String, required: true, trim: true },
  type: { type: String, enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"], default: "Full-time" },
  category: { type: String, default: "Technology" },
  salary: { type: String, default: "Negotiable" },
  description: { type: String, required: true, maxlength: 10000 },
  skills: [{ type: String, trim: true }],
  employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
