import { LogOut, Briefcase, Shield, User } from "lucide-react";

function Headers({ data, changeUser, currentRole }) {
  const logout = () => {
    localStorage.removeItem("loggedInUser");
    changeUser(null);
  };

  const isAdmin = currentRole === "admin" || data?.firstName === "Admin";
  const firstName = data?.firstName || (isAdmin ? "Admin" : "Employee");
  const email = data?.email || "";
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 mb-8 rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Zone 1: Brand & Role */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">
                Equinox EMS
              </span>
              <span className="text-[11px] font-medium text-slate-400">·</span>
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                isAdmin 
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              }`}>
                {isAdmin ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                {isAdmin ? "Administrator" : "Employee Portal"}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Welcome back, <span className="font-semibold text-slate-200">{firstName}</span>
            </p>
          </div>
        </div>

        {/* Zone 3: Account info & Logout */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/50 border border-slate-700/40">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center">
              {initial}
            </div>
            <div className="text-left text-xs">
              <p className="font-medium text-slate-200 leading-tight">{firstName}</p>
              <p className="text-[11px] text-slate-400 leading-tight">{email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:text-rose-200 transition active:scale-95"
            title="Log out of session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Headers;
