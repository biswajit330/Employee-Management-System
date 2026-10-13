import { useState } from "react";
import Headers from "../other/Headers";
import CreateTask from "../other/CreateTask";
import AllTask from "../other/AllTask";
import { PlusCircle, LayoutDashboard } from "lucide-react";

function AdminDashboard({ data, changeUser }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Headers changeUser={changeUser} data={data} currentRole="admin" />

        {/* View Switcher Bar */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "overview"
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Staff Overview & Ledger</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("create")}
              className={`cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "create"
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        {activeTab === "create" ? (
          <div>
            <CreateTask />
          </div>
        ) : (
          <div className="space-y-6">
            <AllTask />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
