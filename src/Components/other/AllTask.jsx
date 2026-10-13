import { useContext, useState, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Users, CheckCircle2, Clock, Inbox, Search, ChevronRight, X, Trash2 } from "lucide-react";
import TaskProgressOverview from "./TaskProgressOverview";

function AllTask() {
  const authData = useContext(AuthContext);
  const { employees = [], admin = [], setUserData } = authData || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployeeForModal, setSelectedEmployeeForModal] = useState(null);
  const [activeTab, setActiveTab] = useState("employees"); // "employees" or "ledger"

  // Aggregate stats across company
  const aggregateStats = useMemo(() => {
    let totalTasks = 0;
    let totalActive = 0;
    let totalCompleted = 0;
    let totalNew = 0;
    let totalFailed = 0;

    employees.forEach((emp) => {
      const counts = emp.taskCounts || {};
      totalActive += counts.active || 0;
      totalCompleted += counts.completed || 0;
      totalNew += counts.newTask || 0;
      totalFailed += counts.failed || 0;
      totalTasks += (emp.tasks || []).length;
    });

    const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

    return {
      totalEmployees: employees.length,
      totalTasks,
      totalActive,
      totalCompleted,
      totalNew,
      totalFailed,
      completionRate,
    };
  }, [employees]);

  // Master task list for the ledger tab
  const allMasterTasks = useMemo(() => {
    const list = [];
    employees.forEach((emp) => {
      (emp.tasks || []).forEach((task, idx) => {
        list.push({
          ...task,
          assigneeName: emp.firstName,
          assigneeEmail: emp.email,
          employeeId: emp.id,
          taskIndex: idx,
        });
      });
    });
    return list;
  }, [employees]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employees;
    const q = searchQuery.toLowerCase();
    return employees.filter(
      (emp) => emp.firstName.toLowerCase().includes(q) || emp.email.toLowerCase().includes(q)
    );
  }, [employees, searchQuery]);

  // Filtered ledger tasks
  const filteredMasterTasks = useMemo(() => {
    if (!searchQuery.trim()) return allMasterTasks;
    const q = searchQuery.toLowerCase();
    return allMasterTasks.filter(
      (t) =>
        t.taskTitle?.toLowerCase().includes(q) ||
        t.assigneeName?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
    );
  }, [allMasterTasks, searchQuery]);

  // Delete a task as admin
  const handleDeleteTask = (empId, taskIndex) => {
    const storedEmployees = JSON.parse(localStorage.getItem("employees")) || employees;
    const updatedEmployees = storedEmployees.map((emp) => {
      if (emp.id === empId) {
        const tasks = [...emp.tasks];
        const removed = tasks.splice(taskIndex, 1)[0];
        const counts = { ...emp.taskCounts };

        if (removed.newTask) counts.newTask = Math.max(0, (counts.newTask || 0) - 1);
        if (removed.active) counts.active = Math.max(0, (counts.active || 0) - 1);
        if (removed.completed) counts.completed = Math.max(0, (counts.completed || 0) - 1);
        if (removed.failed) counts.failed = Math.max(0, (counts.failed || 0) - 1);

        return { ...emp, tasks, taskCounts: counts };
      }
      return emp;
    });

    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
    if (setUserData) {
      setUserData({
        employees: updatedEmployees,
        admin: admin || JSON.parse(localStorage.getItem("admin")) || [],
      });
    }

    if (selectedEmployeeForModal && selectedEmployeeForModal.id === empId) {
      const updatedTarget = updatedEmployees.find((e) => e.id === empId);
      setSelectedEmployeeForModal(updatedTarget);
    }
  };

  return (
    <div className="space-y-6">
      {/* Organization Visual Progress Indicator */}
      <TaskProgressOverview
        title="Company-Wide Task Completion & Velocity"
        subtitle="Aggregated progress across all departments and assigned staff"
        counts={{
          completed: aggregateStats.totalCompleted,
          active: aggregateStats.totalActive,
          newTask: aggregateStats.totalNew,
          failed: aggregateStats.totalFailed,
        }}
      />

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Staff</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {aggregateStats.totalEmployees}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Active team members</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">In Flight</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {aggregateStats.totalActive}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Active tasks in progress</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {aggregateStats.totalCompleted}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {aggregateStats.completionRate}% completion rate
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Pending Acceptance</span>
            <Inbox className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {aggregateStats.totalNew}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Newly dispatched tasks</p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-6 shadow-xl">
        {/* Navigation & Search header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("employees")}
              className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "employees"
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
              }`}
            >
              Employees Directory ({employees.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ledger")}
              className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "ledger"
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
              }`}
            >
              Master Task Ledger ({allMasterTasks.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === "employees" ? "Search by name or email..." : "Search all tasks..."}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-9 pr-8 py-2 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Employees Directory */}
        {activeTab === "employees" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3 pl-3">Employee</th>
                  <th className="pb-3 text-center">New</th>
                  <th className="pb-3 text-center">In Progress</th>
                  <th className="pb-3 text-center">Completed</th>
                  <th className="pb-3 text-center">Failed</th>
                  <th className="pb-3 text-center">Progress</th>
                  <th className="pb-3 pr-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredEmployees.map((emp) => {
                  const counts = emp.taskCounts || {};
                  const total = (emp.tasks || []).length;
                  const completed = counts.completed || 0;
                  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                  const initial = emp.firstName ? emp.firstName.charAt(0).toUpperCase() : "E";

                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-850/50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedEmployeeForModal(emp)}
                    >
                      <td className="py-3.5 pl-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                            {initial}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">
                              {emp.firstName}
                            </p>
                            <p className="text-[11px] text-slate-400">{emp.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 text-center font-mono font-semibold text-blue-400 tabular-nums">
                        {counts.newTask || 0}
                      </td>

                      <td className="py-3.5 text-center font-mono font-semibold text-amber-400 tabular-nums">
                        {counts.active || 0}
                      </td>

                      <td className="py-3.5 text-center font-mono font-semibold text-emerald-400 tabular-nums">
                        {counts.completed || 0}
                      </td>

                      <td className="py-3.5 text-center font-mono font-semibold text-rose-400 tabular-nums">
                        {counts.failed || 0}
                      </td>

                      <td className="py-3.5 text-center">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] text-slate-400 tabular-nums">{pct}%</span>
                        </div>
                      </td>

                      <td className="py-3.5 pr-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEmployeeForModal(emp);
                          }}
                          className="cursor-pointer inline-flex items-center gap-1 text-slate-400 hover:text-emerald-400 text-xs font-semibold px-2 py-1 rounded-lg hover:bg-slate-800 transition"
                        >
                          <span>Inspect Tasks ({total})</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Master Task Ledger */}
        {activeTab === "ledger" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3 pl-3">Task Title</th>
                  <th className="pb-3">Assignee</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Due Date</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 pr-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMasterTasks.map((task, idx) => {
                  const renderStatusBadge = () => {
                    if (task.completed) {
                      return (
                        <span className="text-[11px] font-semibold text-emerald-400">
                          ✓ Completed
                        </span>
                      );
                    }
                    if (task.failed) {
                      return (
                        <span className="text-[11px] font-semibold text-rose-400">
                          ✕ Failed
                        </span>
                      );
                    }
                    if (task.active) {
                      return (
                        <span className="text-[11px] font-semibold text-amber-400">
                          ● In Progress
                        </span>
                      );
                    }
                    return (
                      <span className="text-[11px] font-semibold text-blue-400">
                        ● New
                      </span>
                    );
                  };

                  return (
                    <tr key={idx} className="hover:bg-slate-850/50 transition">
                      <td className="py-3 pl-3 font-medium text-slate-100 max-w-xs truncate">
                        {task.taskTitle}
                      </td>
                      <td className="py-3 text-slate-300">
                        <span className="font-semibold text-slate-200">{task.assigneeName}</span>
                      </td>
                      <td className="py-3 text-slate-400 font-mono text-[11px]">
                        {task.category || "General"}
                      </td>
                      <td className="py-3 text-slate-400 font-mono tabular-nums">
                        {task.taskDate}
                      </td>
                      <td className="py-3 text-center">
                        {renderStatusBadge()}
                      </td>
                      <td className="py-3 pr-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.employeeId, task.taskIndex)}
                          className="cursor-pointer text-slate-500 hover:text-rose-400 p-1 rounded transition"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Employee Tasks Inspection Modal */}
      {selectedEmployeeForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
                  {selectedEmployeeForModal.firstName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedEmployeeForModal.firstName}&apos;s Tasks
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedEmployeeForModal.email} · {(selectedEmployeeForModal.tasks || []).length} assigned tasks
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEmployeeForModal(null)}
                className="cursor-pointer text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-3 flex-1 pr-1">
              {(selectedEmployeeForModal.tasks || []).length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No tasks currently assigned to this employee.
                </div>
              ) : (
                selectedEmployeeForModal.tasks.map((task, idx) => {
                  let statusText = "New";
                  let statusColor = "text-blue-400 border-blue-500/30 bg-blue-500/10";
                  if (task.completed) {
                    statusText = "Completed";
                    statusColor = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
                  } else if (task.failed) {
                    statusText = "Failed";
                    statusColor = "text-rose-400 border-rose-500/30 bg-rose-500/10";
                  } else if (task.active) {
                    statusText = "In Progress";
                    statusColor = "text-amber-400 border-amber-500/30 bg-amber-500/10";
                  }

                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                            <span className="font-semibold text-slate-300">{task.category || "General"}</span>
                            <span>·</span>
                            <span className="font-mono tabular-nums">{task.taskDate}</span>
                          </div>
                          <h4 className="text-sm font-semibold text-white">{task.taskTitle}</h4>
                          <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                            {task.taskDescription}
                          </p>
                        </div>

                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${statusColor} shrink-0`}>
                          {statusText}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-850 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(selectedEmployeeForModal.id, idx)}
                          className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 hover:text-rose-300 hover:underline"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete Task</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEmployeeForModal(null)}
                className="cursor-pointer rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllTask;
