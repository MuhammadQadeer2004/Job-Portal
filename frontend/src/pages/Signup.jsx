import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [form,setForm] = useState({name:"",email:"",password:"",role:"candidate"});
  const [error,setError] = useState(""); const [busy,setBusy] = useState(false);
  const { login }=useAuth(); const navigate=useNavigate();
  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try { const {data}=await api.post("/auth/signup",form); login(data); navigate("/dashboard"); }
    catch(err) { setError(err.response?.data?.message || "Could not create account."); }
    finally { setBusy(false); }
  }
  return <div className="auth-wrap"><form className="auth-card" onSubmit={submit}><div className="auth-brand"><span className="brand-icon"><BriefcaseBusiness/></span><span className="eyebrow">GET STARTED</span></div><h1>Create your account</h1><p className="muted">One account. A world of possibilities.</p>{error&&<div className="notice notice-error">{error}</div>}
    <label className="field">Full name<input required minLength="2" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your full name"/></label>
    <label className="field">Email address<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label>
    <label className="field">Password<input type="password" required minLength="8" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="At least 8 characters"/></label>
    <label className="field">I want to<select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="candidate">Find a job (Candidate)</option><option value="employer">Hire talent (Employer)</option></select></label>
    <button className="btn btn-primary btn-full" disabled={busy}>{busy?"Creating account…":"Create account"}</button><p className="auth-switch">Already registered? <Link to="/login">Log in</Link></p>
  </form></div>;
}
