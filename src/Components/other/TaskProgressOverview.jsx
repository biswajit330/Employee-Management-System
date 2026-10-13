import { CheckCircle2, Clock, Inbox, AlertCircle, Target, TrendingUp } from "lucide-react";

function TaskProgressOverview({ title = "Task Progress & Velocity", subtitle = "Completed vs. Pending workflow distribution", counts }) {
  const completed = counts?.completed || 0;
  const active = counts?.active || 0;
  const newTask = counts?.newTask || 0;
  const failed = counts?.failed || 0;

  const pending = active + newTask;
  const total = completed + pending + failed;

  const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const pendingPct = total > 0 ? Math.round((pending / total) * 100) : 0;
  const failedPct = total > 0 ? Math.max(0, 100 - completedPct - pendingPct) : 0;

  // Breakdown percentages for the segmented bar
  const activeBarPct = total > 0 ? (active / total) * 100 : 0;
  const newBarPct = total > 0 ? (newTask / total) * 100 : 0;
  const completedBarPct = total > 0 ? (completed / total) * 100 : 0;
  const failedBarPct = total > 0 ? (failed / total) * 100 : 0;

  // SVG Circular progress math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completedPct / 100) * circumference;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-5 sm:p-6 shadow-xl mb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 mb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>Total: <strong className="text-white tabular-nums">{total}</strong> tasks</span>
          <span>·</span>
          <span className="text-emerald-400 font-semibold">{completedPct}% completed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Circular Progress Ring */}
        <div className="lg:col-span-4 flex items-center justify-center sm:justify-start gap-4">
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 96 96">
              {/* Background circle */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="text-slate-800 stroke-current"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Completed stroke */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="text-emerald-500 stroke-current transition-all duration-700 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold font-mono text-white tabular-nums leading-none">
                {completedPct}%
              </span>
              <span className="text-[10px] text-emerald-400 font-medium mt-0.5">Done</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-200">Completion Ratio</p>
            <p className="text-xs text-slate-400 mt-0.5 font-mono tabular-nums">
              <span className="text-emerald-400 font-bold">{completed}</span> of <span className="text-slate-200 font-bold">{total}</span> completed
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>
                {completedPct >= 70
                  ? "High productivity velocity"
                  : completedPct >= 40
                  ? "Steady execution pace"
                  : "Pending backlog attention"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Comparative Breakdown & Segmented Bar */}
        <div className="lg:col-span-8 space-y-4">
          {/* Segmented Proportional Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <div className="flex items-center gap-2">
                <span className="text-slate-300">Progress Breakdown</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono tabular-nums">
                <span className="text-emerald-400">{completedPct}% Completed</span>
                <span className="text-slate-600">|</span>
                <span className="text-amber-400">{pendingPct}% Pending</span>
              </div>
            </div>

            {/* Visual multi-segmented bar track */}
            <div className="w-full h-3 rounded-full bg-slate-800/90 overflow-hidden flex p-0.5 gap-0.5">
              {completedBarPct > 0 && (
                <div
                  className="h-full bg-emerald-500 rounded-l-full transition-all duration-500 hover:brightness-110"
                  style={{ width: `${completedBarPct}%` }}
                  title={`Completed: ${completed} tasks (${completedPct}%)`}
                />
              )}
              {activeBarPct > 0 && (
                <div
                  className="h-full bg-amber-500 transition-all duration-500 hover:brightness-110"
                  style={{ width: `${activeBarPct}%` }}
                  title={`In Progress: ${active} tasks`}
                />
              )}
              {newBarPct > 0 && (
                <div
                  className="h-full bg-blue-500 transition-all duration-500 hover:brightness-110"
                  style={{ width: `${newBarPct}%` }}
                  title={`New / Awaiting Acceptance: ${newTask} tasks`}
                />
              )}
              {failedBarPct > 0 && (
                <div
                  className="h-full bg-rose-500 rounded-r-full transition-all duration-500 hover:brightness-110"
                  style={{ width: `${failedBarPct}%` }}
                  title={`Failed: ${failed} tasks (${failedPct}%)`}
                />
              )}
            </div>
          </div>

          {/* Metric Comparative Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5">
              <div className="flex items-center justify-between text-emerald-400 text-xs mb-1">
                <span className="font-semibold">Completed</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p className="text-lg font-bold font-mono text-white tabular-nums">
                {completed}
              </p>
              <p className="text-[10px] text-emerald-400 font-mono mt-0.5 tabular-nums">
                {completedPct}% of total
              </p>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5">
              <div className="flex items-center justify-between text-amber-400 text-xs mb-1">
                <span className="font-semibold">In Progress</span>
                <Clock className="w-3.5 h-3.5" />
              </div>
              <p className="text-lg font-bold font-mono text-white tabular-nums">
                {active}
              </p>
              <p className="text-[10px] text-amber-400/80 font-mono mt-0.5 tabular-nums">
                {total > 0 ? Math.round((active / total) * 100) : 0}% active
              </p>
            </div>

            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-2.5">
              <div className="flex items-center justify-between text-blue-400 text-xs mb-1">
                <span className="font-semibold">New / Unaccepted</span>
                <Inbox className="w-3.5 h-3.5" />
              </div>
              <p className="text-lg font-bold font-mono text-white tabular-nums">
                {newTask}
              </p>
              <p className="text-[10px] text-blue-400/80 font-mono mt-0.5 tabular-nums">
                {total > 0 ? Math.round((newTask / total) * 100) : 0}% queued
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-2.5">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span className="font-semibold">Total Pending</span>
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-lg font-bold font-mono text-white tabular-nums">
                {pending}
              </p>
              <p className="text-[10px] text-amber-400 font-mono mt-0.5 tabular-nums">
                {pendingPct}% pending
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskProgressOverview;
