import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Applications() {
  const {user}=useAuth(); const [items,setItems]=useState([]); const [error,setError]=useState(""); const [loading,setLoading]=useState(true);
  async function load() {
    setLoading(true);setError("");
    try { const {data}=await api.get(user?.role==="employer"?"/applications/employer":"/applications/mine");setItems(data.applications||[]); }
    catch(err){setError(err.response?.data?.message||"Could not load applications.");}
    finally{setLoading(false);}
  }
  useEffect(()=>{if(user)load();},[user]);
  async function updateStatus(id,status) {
    try { await api.patch(`/applications/${id}/status`,{status}); await load(); }
    catch(err){setError(err.response?.data?.message||"Status update failed.");}
  }
  if(!user)return <main className="section"><h1>Applications</h1><p>Please <Link to="/login">log in</Link> to continue.</p></main>;
  return <main className="section dashboard-section"><div className="section-heading"><div><span className="eyebrow">YOUR WORKSPACE</span><h1>{user.role==="employer"?"Applications received":"My applications"}</h1><p>Track progress and keep everything in one place.</p></div></div>{error&&<div className="notice notice-error">{error}</div>}
    {loading?<div className="empty-state">Loading applications…</div>:items.length===0?<div className="empty-state"><h3>No applications yet</h3><p>When applications are submitted, they will appear here.</p><Link className="btn btn-primary" to="/">Browse jobs</Link></div>:<div className="table-wrap"><table><thead><tr><th>Role</th>{user.role==="employer"&&<th>Candidate</th>}<th>Applied</th><th>Status</th>{user.role==="employer"&&<th>Update</th>}</tr></thead><tbody>{items.map(item=><tr key={item._id}><td><strong>{item.job?.title||"Job removed"}</strong><small>{item.job?.company||""}</small></td>{user.role==="employer"&&<td>{item.candidate?.name}<small>{item.candidate?.email}</small></td>}<td>{new Date(item.createdAt).toLocaleDateString()}</td><td><span className={`status status-${item.status.toLowerCase()}`}>{item.status}</span></td>{user.role==="employer"&&<td><select value={item.status} onChange={e=>updateStatus(item._id,e.target.value)}>{["Submitted","Reviewing","Shortlisted","Rejected"].map(s=><option key={s}>{s}</option>)}</select></td>}</tr>)}</tbody></table></div>}
  </main>;
}
