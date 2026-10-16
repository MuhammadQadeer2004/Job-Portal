import { ArrowUpRight, MapPin, Clock3, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return <article className="job-card"><div className="job-card-top"><div className="company-mark">{(job.company || "C").slice(0,1).toUpperCase()}</div><span className="tag">{job.type}</span></div>
    <h3><Link to={`/jobs/${job._id}`}>{job.title}</Link></h3><p className="company"><Building2 size={15}/>{job.company}</p>
    <p className="job-description">{(job.description || "").slice(0, 125)}{job.description?.length > 125 ? "…" : ""}</p>
    <div className="job-meta"><span><MapPin size={14}/>{job.location}</span><span><Clock3 size={14}/>{new Date(job.createdAt).toLocaleDateString()}</span></div>
    <div className="job-card-bottom"><span className="salary">{job.salary || "Negotiable"}</span><Link className="arrow-link" to={`/jobs/${job._id}`}>View job <ArrowUpRight size={16}/></Link></div>
  </article>;
}
