import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import JobDetails from "./pages/JobDetails";
import Applications from "./pages/Applications";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";

function Protected({children}) {
  const {user,loading}=useAuth(); const location=useLocation();
  if(loading)return <main className="section empty-state">Loading account…</main>;
  if(!user)return <Navigate to="/login" state={{from:location.pathname}} replace/>;
  return children;
}
export default function App() {
  return <div className="app-shell"><Navbar/><main className="main-content"><Routes>
    <Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route path="/signup" element={<Signup/>}/>
    <Route path="/jobs/:id" element={<JobDetails/>}/>
    <Route path="/applications" element={<Protected><Applications/></Protected>}/>
    <Route path="/dashboard" element={<Protected><Dashboard/></Protected>}/>
    <Route path="*" element={<main className="section empty-state"><h1>Page not found</h1><a className="btn btn-primary" href="/">Back home</a></main>}/>
  </Routes></main><Footer/></div>;
}
