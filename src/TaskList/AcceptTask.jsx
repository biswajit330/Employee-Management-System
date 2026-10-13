import { Calendar, Check, X, Tag, Clock } from "lucide-react";

function AcceptTask({ data, onComplete, onFail }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-amber-500/25 bg-slate-900/80 p-5 shadow-lg shadow-black/40 hover:border-amber-500/40 transition-all duration-200">
      <div>
        {/* Unboxed clean metadata header */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span className="font-semibold text-amber-400 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            {data.category || "General"}
          </span>
          <span className="font-mono tabular-nums flex items-center gap-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            {data.taskDate}
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-300 mb-2">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>In Progress</span>
        </div>

        <h3 className="text-base font-semibold text-white tracking-tight" style={{ textWrap: "balance" }}>
          {data.taskTitle}
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-slate-300 line-clamp-3">
          {data.taskDescription || "No additional description provided."}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2">
        <button
          onClick={onComplete}
          className="cursor-pointer flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-3 py-2 text-xs font-semibold text-slate-950 transition active:scale-95 whitespace-nowrap shadow-sm shadow-emerald-500/20"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Complete</span>
        </button>

        <button
          onClick={onFail}
          className="cursor-pointer flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-3 py-2 text-xs font-semibold text-rose-300 transition active:scale-95 whitespace-nowrap"
        >
          <X className="w-3.5 h-3.5" />
          <span>Mark Failed</span>
        </button>
      </div>
    </div>
  );
}

export default AcceptTask;
