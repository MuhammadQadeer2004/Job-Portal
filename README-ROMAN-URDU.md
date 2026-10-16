# CareerBridge — Job Portal & Career Platform

Ye MERN-style starter project hai: React + Vite frontend, Express + MongoDB backend.

## 1) Pehle kya install karna hai
- Node.js (LTS)
- VS Code
- MongoDB Atlas account (live deployment ke liye)
- Git/GitHub account
- Vercel account (frontend + backend alag projects)

## 2) Project local run karna
VS Code mein `careerbridge-job-portal` folder open karein.

### Backend
PowerShell terminal:
```powershell
cd backend
npm install
Copy-Item .env.example .env
```
Ab `backend/.env` file open karke values set karein:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/careerbridge
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```
Agar local MongoDB installed nahi, to MongoDB Atlas ka connection URI `MONGODB_URI` mein paste karein.
Phir:
```powershell
npm run dev
```
Health check: `http://localhost:5000/api/health`

### Frontend (doosra terminal)
```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```
Browser: `http://localhost:5173`

## 3) Live deploy karne se pehle kya change karna hai
1. **MongoDB Atlas:** database user banayein, network access configure karein, aur Atlas connection string backend environment variable `MONGODB_URI` mein set karein. URI mein `<password>` ko actual password se replace karein aur database name `careerbridge` rakhein.
2. **JWT_SECRET:** live backend mein lamba, random secret set karein. Apna real secret GitHub par upload na karein.
3. **Backend hosting (recommended: Render):** Render par New Web Service banayein, GitHub repo connect karein aur Root Directory `backend` set karein. Build command `npm install`, Start command `npm start`. Environment variables set karein: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (frontend ki live URL).
4. **Frontend Vercel:** `frontend` folder ko Vercel project ka Root Directory set karein. Build command `npm run build`, output directory `dist`.
5. **VITE_API_URL:** Vercel frontend project mein environment variable add karein:
   `VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api`
   `YOUR-BACKEND-DOMAIN` ko apne deployed backend domain se replace karein. Iske baad frontend redeploy karein.
6. **CORS:** backend ke `CLIENT_URL` mein exact frontend URL, `https://` ke sath, set karein. Agar custom domain ho to usi domain ko set karein.
7. **Redeploy:** environment variable change karne ke baad dono projects redeploy karein.
8. **GitHub:** `.env` files push na karein. `.gitignore` mein `.env` excluded hai.

## 4) Features
- Candidate / Employer account roles
- Signup, login, JWT authentication
- Jobs create, browse, search, details
- Candidate job applications
- Employer job management and application status updates
- Candidate applications page and employer dashboard
- Responsive basic styling

## 5) Important notes
- Ye portfolio-ready starter hai, magar live karne se pehle end-to-end testing zaroor karein.
- Demo data ke liye pehle employer account banayein, dashboard se job post karein; phir candidate account bana kar apply karein.
- Real users ke liye production hardening (email verification, password reset, rate limiting, validation, monitoring, privacy policy) add karna behtar hoga.
- Kisi bhi `.env` file mein secrets hon to unhein GitHub par commit na karein.
