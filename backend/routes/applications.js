import { Router } from "express";
import mongoose from "mongoose";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { protect, allowRoles } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, allowRoles("candidate"), async (req, res, next) => {
  try {
    const { jobId, coverLetter = "" } = req.body;
    if (!mongoose.isValidObjectId(jobId)) return res.status(400).json({ message: "Valid jobId is required." });
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found." });
    const application = await Application.create({ job: job._id, candidate: req.user._id, coverLetter });
    res.status(201).json({ application, message: "Application submitted successfully." });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "You have already applied to this job." });
    next(error);
  }
});

router.get("/mine", protect, allowRoles("candidate"), async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user._id }).populate("job").sort({ createdAt: -1 });
    res.json({ applications });
  } catch (error) { next(error); }
});

router.get("/employer", protect, allowRoles("employer"), async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).select("_id");
    const applications = await Application.find({ job: { $in: jobs.map(job => job._id) } })
      .populate("job").populate("candidate", "name email").sort({ createdAt: -1 });
    res.json({ applications });
  } catch (error) { next(error); }
});

router.patch("/:id/status", protect, allowRoles("employer"), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["Submitted", "Reviewing", "Shortlisted", "Rejected"].includes(status)) return res.status(400).json({ message: "Invalid status." });
    const application = await Application.findById(req.params.id).populate("job");
    if (!application || String(application.job.employer) !== String(req.user._id)) return res.status(404).json({ message: "Application not found." });
    application.status = status;
    await application.save();
    res.json({ application, message: "Application status updated." });
  } catch (error) { next(error); }
});

export default router;
