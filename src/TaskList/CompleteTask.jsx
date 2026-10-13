import { Calendar, CheckCircle2, Tag } from "lucide-react";

function CompleteTask({ data }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-5 shadow-md shadow-black/30 opacity-90 hover:opacity-100 transition-all duration-200">
      <div>
        {/* Unboxed clean metadata header */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span className="font-semibold text-emerald-400 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            {data.category || "General"}
          </span>
          <span className="font-mono tabular-nums flex items-center gap-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            {data.taskDate}
          </span>
        </div>

        <h3 className="text-base font-semibold text-white tracking-tight line-through decoration-emerald-500/50" style={{ textWrap: "balance" }}>
          {data.taskTitle}
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-3">
          {data.taskDescription || "No additional description provided."}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800/60">
        <div className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Completed Successfully</span>
        </div>
      </div>
    </div>
  );
}

export default CompleteTask;
