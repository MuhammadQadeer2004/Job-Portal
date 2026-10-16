import { Link, NavLink, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, LogOut, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = () => { logout(); navigate("/"); };
  return <header className="navbar"><Link className="brand" to="/"><span className="brand-icon"><BriefcaseBusiness size={20}/></span>CareerBridge</Link>
    <nav><NavLink to="/">Find Jobs</NavLink>{user && <NavLink to="/dashboard">Dashboard</NavLink>}{user?.role === "candidate" && <NavLink to="/applications">My Applications</NavLink>}</nav>
    <div className="nav-actions">{user ? <><span className="welcome"><UserRound size={16}/> {user.name}</span><button className="btn btn-outline btn-small" onClick={signOut}><LogOut size={15}/> Logout</button></> : <><Link className="nav-login" to="/login">Log in</Link><Link className="btn btn-primary btn-small" to="/signup">Get started</Link></>}</div>
  </header>;
}
