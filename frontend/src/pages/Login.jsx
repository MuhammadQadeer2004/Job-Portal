import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form,setForm] = useState({email:"",password:""});
  const [error,setError] = useState(""); const [busy,setBusy] = useState(false);
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try { const {data}=await api.post("/auth/login",form); login(data); navigate(location.state?.from || "/dashboard"); }
    catch(err) { setError(err.response?.data?.message || "Login failed. Please try again."); }
    finally { setBusy(false); }
  }
  return <div className="auth-wrap"><form className="auth-card" onSubmit={submit}><div className="auth-brand"><span className="brand-icon"><BriefcaseBusiness/></span><span className="eyebrow">WELCOME BACK</span></div><h1>Log in to your account</h1><p className="muted">Pick up where your next career move begins.</p>{error&&<div className="notice notice-error">{error}</div>}
    <label className="field">Email address<input type="email" required autoComplete="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label>
    <label className="field">Password<input type="password" required autoComplete="current-password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Enter your password"/></label>
    <button className="btn btn-primary btn-full" disabled={busy}>{busy?"Logging in…":"Log in"}</button><p className="auth-switch">New to CareerBridge? <Link to="/signup">Create an account</Link></p>
  </form></div>;
}
