import { Calendar, Play, Tag } from "lucide-react";

function NewTask({ data, onAccept }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-blue-500/20 bg-slate-900/80 p-5 shadow-lg shadow-black/40 hover:border-blue-500/40 transition-all duration-200">
      <div>
        {/* Unboxed clean metadata header */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span className="font-semibold text-blue-400 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            {data.category || "General"}
          </span>
          <span className="font-mono tabular-nums flex items-center gap-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            {data.taskDate}
          </span>
        </div>

        <h3 className="text-base font-semibold text-white tracking-tight" style={{ textWrap: "balance" }}>
          {data.taskTitle}
        </h3>

        <p className="mt-2.5 text-xs leading-relaxed text-slate-300 line-clamp-3">
          {data.taskDescription || "No additional description provided."}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800/80">
        <button
          onClick={onAccept}
          className="cursor-pointer w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 transition active:scale-95 whitespace-nowrap"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Accept & Start Task</span>
        </button>
      </div>
    </div>
  );
}

export default NewTask;
