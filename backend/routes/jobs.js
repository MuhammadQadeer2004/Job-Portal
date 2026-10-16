import { Router } from "express";
import mongoose from "mongoose";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { protect, allowRoles } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { search = "", category = "", location = "", type = "" } = req.query;
    const filter = {};
    if (search) filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
      { skills: { $regex: search, $options: "i" } }
    ];
    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (type) filter.type = type;
    const jobs = await Job.find(filter).populate("employer", "name").sort({ createdAt: -1 }).limit(100);
    res.json({ jobs });
  } catch (error) { next(error); }
});

router.get("/employer/mine", protect, allowRoles("employer"), async (req, res, next) => {
  try { res.json({ jobs: await Job.find({ employer: req.user._id }).sort({ createdAt: -1 }) }); }
  catch (error) { next(error); }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid job ID." });
    const job = await Job.findById(req.params.id).populate("employer", "name");
    if (!job) return res.status(404).json({ message: "Job not found." });
    res.json({ job });
  } catch (error) { next(error); }
});

router.post("/", protect, allowRoles("employer"), async (req, res, next) => {
  try {
    const { title, company, location, type, category, salary, description, skills } = req.body;
    if (!title?.trim() || !company?.trim() || !location?.trim() || !description?.trim()) return res.status(400).json({ message: "Title, company, location and description are required." });
    const job = await Job.create({ title, company, location, type, category, salary, description, skills: Array.isArray(skills) ? skills : String(skills || "").split(",").map(s => s.trim()).filter(Boolean), employer: req.user._id });
    res.status(201).json({ job, message: "Job posted successfully." });
  } catch (error) { next(error); }
});

router.patch("/:id", protect, allowRoles("employer"), async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, employer: req.user._id });
    if (!job) return res.status(404).json({ message: "Job not found or you do not own it." });
    const allowed = ["title", "company", "location", "type", "category", "salary", "description", "skills"];
    allowed.forEach(key => { if (req.body[key] !== undefined) job[key] = req.body[key]; });
    await job.save();
    res.json({ job, message: "Job updated." });
  } catch (error) { next(error); }
});

router.delete("/:id", protect, allowRoles("employer"), async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user._id });
    if (!job) return res.status(404).json({ message: "Job not found or you do not own it." });
    await Application.deleteMany({ job: job._id });
    res.json({ message: "Job deleted." });
  } catch (error) { next(error); }
});

export default router;
