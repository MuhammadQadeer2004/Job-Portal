import { useEffect, useState } from "react";
import { Search, Sparkles, ArrowRight, ShieldCheck, Zap, Users } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import JobCard from "../components/JobCard";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function loadJobs(event) {
    event?.preventDefault();
    setLoading(true); setError("");
    try { const { data } = await api.get("/jobs", { params: { search, location } }); setJobs(data.jobs || []); }
    catch (err) { setError(err.response?.data?.message || "Could not load jobs. Check that the backend is running."); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadJobs(); }, []);
  return <><section className="hero"><div className="hero-glow"></div><div className="hero-content"><div className="eyebrow"><Sparkles size={15}/> YOUR NEXT CHAPTER STARTS HERE</div><h1>Find work that<br/><span>moves you forward.</span></h1><p className="hero-copy">Discover meaningful opportunities from teams building the future. Your next role is closer than you think.</p>
    <form className="search-box" onSubmit={loadJobs}><label><Search size={19}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Job title, skill, or company"/></label><label><span className="search-divider"></span><input value={location} onChange={e=>setLocation(e.target.value)} placeholder="City or remote"/></label><button className="btn btn-primary" type="submit">Search jobs <ArrowRight size={17}/></button></form>
    <p className="hero-hint">Popular: <button onClick={()=>{setSearch("React");setTimeout(()=>document.querySelector(".search-box")?.requestSubmit(),0)}}>React Developer</button><button onClick={()=>{setSearch("Designer");setTimeout(()=>document.querySelector(".search-box")?.requestSubmit(),0)}}>Designer</button><button onClick={()=>{setSearch("Intern");setTimeout(()=>document.querySelector(".search-box")?.requestSubmit(),0)}}>Internships</button></p>
  </div><div className="hero-side-note"><span className="note-line"></span><span>Make your next move<br/>your best one.</span></div></section>
  <section className="stats"><div><strong><Users/> Candidate-first</strong><span>Opportunities built around people</span></div><div><strong><ShieldCheck/> Trusted connections</strong><span>Direct links to hiring teams</span></div><div><strong><Zap/> Move faster</strong><span>Less searching, more doing</span></div></section>
  <section className="section jobs-section"><div className="section-heading"><div><span className="eyebrow">OPPORTUNITIES</span><h2>Find your next role</h2><p>Explore the latest roles from growing teams.</p></div><Link className="text-link" to="/signup">Join CareerBridge <ArrowRight size={16}/></Link></div>
    {error && <div className="notice notice-error">{error}</div>}{loading ? <div className="empty-state">Loading opportunities…</div> : jobs.length ? <div className="jobs-grid">{jobs.map(job=><JobCard key={job._id} job={job}/>)}</div> : <div className="empty-state"><div className="empty-icon"><Search/></div><h3>No jobs found yet</h3><p>Try a different search, or create an employer account and post the first job.</p><Link className="btn btn-outline" to="/signup">Create an account</Link></div>}
  </section><section className="cta-band"><div><span className="eyebrow">HIRING RIGHT NOW?</span><h2>Meet your next great hire.</h2><p>Post a role and connect with candidates ready to make a difference.</p></div><Link to="/signup" className="btn btn-light">Start hiring <ArrowRight size={17}/></Link></section></>;
}
