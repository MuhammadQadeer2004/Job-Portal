import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Building2, Clock3, Send } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function JobDetails() {
  const { id }=useParams(); const { user }=useAuth();
  const [job,setJob]=useState(null); const [coverLetter,setCoverLetter]=useState(""); const [message,setMessage]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  useEffect(()=>{ api.get(`/jobs/${id}`).then(({data})=>setJob(data.job)).catch(err=>setError(err.response?.data?.message || "Unable to load job.")); },[id]);
  async function apply(e) {
    e.preventDefault(); setBusy(true); setError(""); setMessage("");
    try { const {data}=await api.post("/applications",{jobId:id,coverLetter}); setMessage(data.message || "Application submitted."); }
    catch(err) { setError(err.response?.data?.message || "Could not submit application."); }
    finally { setBusy(false); }
  }
  if (error && !job) return <main className="section"><div className="notice notice-error">{error}</div><Link to="/" className="text-link">Back to jobs</Link></main>;
  if (!job) return <main className="section empty-state">Loading job details…</main>;
  return <main className="section detail-layout"><div><Link to="/" className="back-link"><ArrowLeft size={16}/> Back to jobs</Link><div className="detail-card"><span className="tag">{job.type}</span><h1>{job.title}</h1><p className="company"><Building2 size={17}/>{job.company}</p><div className="detail-meta"><span><MapPin/>{job.location}</span><span><Clock3/>{new Date(job.createdAt).toLocaleDateString()}</span><span className="salary">{job.salary}</span></div><hr/><h2>About the role</h2><p className="description-text">{job.description}</p>{job.skills?.length>0&&<><h2>Skills</h2><div className="skill-list">{job.skills.map(skill=><span key={skill} className="tag">{skill}</span>)}</div></>}</div></div>
    <aside className="apply-card"><h2>Interested in this role?</h2><p className="muted">Send your application directly to the hiring team.</p>{message&&<div className="notice notice-success">{message}</div>}{error&&<div className="notice notice-error">{error}</div>}
      {!user?<><p>Log in as a candidate to apply.</p><Link className="btn btn-primary btn-full" to="/login" state={{from:`/jobs/${id}`}}>Log in to apply</Link></>:user.role!=="candidate"?<p>Only candidate accounts can apply to jobs.</p>:<form onSubmit={apply}><label className="field">Cover letter (optional)<textarea rows="6" value={coverLetter} onChange={e=>setCoverLetter(e.target.value)} placeholder="Tell the employer why you're a good fit…"/></label><button className="btn btn-primary btn-full" disabled={busy}><Send size={16}/>{busy?"Submitting…":"Submit application"}</button></form>}</aside>
  </main>;
}
