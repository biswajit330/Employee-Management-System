import { Inbox, Clock, CheckCircle2, AlertCircle } from "lucide-react";

function TaskList({ data, activeFilter, onFilterChange }) {
  const counts = data?.taskCounts || {
    newTask: 0,
    completed: 0,
    active: 0,
    failed: 0,
  };

  const total = (counts.newTask || 0) + (counts.active || 0) + (counts.completed || 0) + (counts.failed || 0);

  const stats = [
    {
      id: "newTask",
      label: "New Tasks",
      count: counts.newTask || 0,
      description: "Awaiting your acceptance",
      icon: Inbox,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      activeRing: "ring-2 ring-blue-500/50 bg-blue-500/15",
    },
    {
      id: "active",
      label: "In Progress",
      count: counts.active || 0,
      description: "Currently working on",
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      activeRing: "ring-2 ring-amber-500/50 bg-amber-500/15",
    },
    {
      id: "completed",
      label: "Completed",
      count: counts.completed || 0,
      description: "Successfully finished",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      activeRing: "ring-2 ring-emerald-500/50 bg-emerald-500/15",
    },
    {
      id: "failed",
      label: "Failed",
      count: counts.failed || 0,
      description: "Missed or rejected",
      icon: AlertCircle,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      activeRing: "ring-2 ring-rose-500/50 bg-rose-500/15",
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Task Performance Matrix
        </h2>
        <span className="text-xs text-slate-400">
          Total Assigned: <strong className="font-mono text-slate-200 tabular-nums">{total}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isSelected = activeFilter === stat.id;

          return (
            <button
              key={stat.id}
              type="button"
              onClick={() => onFilterChange && onFilterChange(isSelected ? "all" : stat.id)}
              className={`cursor-pointer rounded-2xl border ${stat.border} ${
                isSelected ? stat.activeRing : "bg-slate-900/60 hover:bg-slate-900/90"
              } p-5 text-left transition-all duration-200 shadow-sm hover:-translate-y-0.5`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  {isSelected ? "Filtering" : "Click to view"}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-white tabular-nums">
                  {stat.count}
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-200 mt-1">
                {stat.label}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {stat.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TaskList;
