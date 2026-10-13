import { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ArrowRight, Briefcase } from "lucide-react";

function Login({ handelLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const success = handelLogin(email.trim(), password);
    if (!success) {
      setErrorMessage("Invalid credentials. Please verify your email and password.");
    } else {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0b0f17] px-4 py-12  relative overflow-hidden">
      {/* Subtle ambient background glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-sm">
            <Briefcase className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Equinox EMS
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Workforce Task & Workflow Orchestration
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-9 mb-40 shadow-2xl shadow-black/50">
          <h2 className="text-lg font-semibold text-slate-100 mb-1">
            Sign In
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Enter your workplace credentials to access your dashboard
          </p>

          {errorMessage && (
            <div className="mb-5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-300 flex items-start gap-2">
              <span className="font-semibold shrink-0">Error:</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="name@company.com"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-slate-950 transition active:scale-[0.99] cursor-pointer shadow-sm shadow-emerald-500/20"
            >
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
