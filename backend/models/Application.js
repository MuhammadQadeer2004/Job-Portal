import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coverLetter: { type: String, default: "", maxlength: 5000 },
  status: { type: String, enum: ["Submitted", "Reviewing", "Shortlisted", "Rejected"], default: "Submitted" }
}, { timestamps: true });

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
export default mongoose.model("Application", applicationSchema);
