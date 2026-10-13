import { useContext, useState, useMemo } from "react";
import AcceptTask from "./AcceptTask";
import NewTask from "./NewTask";
import CompleteTask from "./CompleteTask";
import FailedTask from "./FailedTask";
import { AuthContext } from "../context/AuthContext";
import { Search, Filter, LayoutGrid, Columns, X, CheckSquare } from "lucide-react";

function TaskListC({ data, activeFilter, onFilterChange }) {
  const { employees, admin, setUserData } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'scroll'

  const tasks = useMemo(() => data?.tasks || [], [data?.tasks]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    tasks.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [tasks]);

  const updateTaskStatus = (taskIndex, newStatus) => {
    if (!data?.id) return;

    const storedEmployees = JSON.parse(localStorage.getItem("employees")) || employees || [];
    const updatedEmployees = storedEmployees.map((emp) => {
      if (emp.id === data.id) {
        const currentTasks = [...emp.tasks];
        const task = { ...currentTasks[taskIndex] };
        const counts = { ...emp.taskCounts };

        if (newStatus === "accept") {
          task.newTask = false;
          task.active = true;
          counts.newTask = Math.max(0, (counts.newTask || 0) - 1);
          counts.active = (counts.active || 0) + 1;
        } else if (newStatus === "completed") {
          task.active = false;
          task.completed = true;
          counts.active = Math.max(0, (counts.active || 0) - 1);
          counts.completed = (counts.completed || 0) + 1;
        } else if (newStatus === "failed") {
          task.active = false;
          task.failed = true;
          counts.active = Math.max(0, (counts.active || 0) - 1);
          counts.failed = (counts.failed || 0) + 1;
        }

        currentTasks[taskIndex] = task;

        const updatedEmp = {
          ...emp,
          taskCounts: counts,
          tasks: currentTasks,
        };

        const storedLoggedIn = localStorage.getItem("loggedInUser");
        if (storedLoggedIn) {
          try {
            const parsed = JSON.parse(storedLoggedIn);
            if (parsed.role === "employee" && parsed.data?.id === emp.id) {
              localStorage.setItem(
                "loggedInUser",
                JSON.stringify({ ...parsed, data: updatedEmp })
              );
            }
          } catch {
            // ignore
          }
        }

        return updatedEmp;
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
  };

  // Filter tasks based on search, status tab, and category
  const filteredTasks = useMemo(() => {
    return tasks.map((task, originalIndex) => ({ task, originalIndex })).filter(({ task }) => {
      // Status filter
      if (activeFilter === "newTask" && !task.newTask) return false;
      if (activeFilter === "active" && !task.active) return false;
      if (activeFilter === "completed" && !task.completed) return false;
      if (activeFilter === "failed" && !task.failed) return false;

      // Category filter
      if (selectedCategory !== "all" && task.category !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = task.taskTitle?.toLowerCase().includes(query);
        const descMatch = task.taskDescription?.toLowerCase().includes(query);
        const catMatch = task.category?.toLowerCase().includes(query);
        if (!titleMatch && !descMatch && !catMatch) return false;
      }

      return true;
    });
  }, [tasks, activeFilter, selectedCategory, searchQuery]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    if (onFilterChange) onFilterChange("all");
  };

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "all" || (activeFilter && activeFilter !== "all");

  return (
    <div className="w-full">
      {/* Controls & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        {/* Status segmented tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
          {[
            { id: "all", label: "All Tasks" },
            { id: "newTask", label: "New" },
            { id: "active", label: "In Progress" },
            { id: "completed", label: "Completed" },
            { id: "failed", label: "Failed" },
          ].map((tab) => {
            const isTabActive = (activeFilter || "all") === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange && onFilterChange(tab.id)}
                className={`cursor-pointer px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  isTabActive
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search, category & view toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-emerald-500"
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

          {categories.length > 0 && (
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 pr-8 text-xs text-slate-200 outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`cursor-pointer p-1.5 rounded-lg text-xs transition ${
                viewMode === "grid" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("scroll")}
              className={`cursor-pointer p-1.5 rounded-lg text-xs transition ${
                viewMode === "scroll" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
              title="Horizontal Kanban View"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Clear banner if filtered */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-2 mb-6 text-xs text-slate-400">
          <span>
            Showing <strong className="font-mono text-slate-200 tabular-nums">{filteredTasks.length}</strong> of{" "}
            <strong className="font-mono text-slate-200 tabular-nums">{tasks.length}</strong> tasks
          </span>
          <button
            type="button"
            onClick={clearAllFilters}
            className="cursor-pointer text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium"
          >
            <X className="w-3 h-3" />
            Clear filters
          </button>
        </div>
      )}

      {/* Task list or empty state */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/60 text-slate-400 flex items-center justify-center mb-3">
            <CheckSquare className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200">No tasks found</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm">
            {hasActiveFilters
              ? "No tasks match the active filters or search term. Try adjusting your query."
              : "You have no tasks assigned in this status yet."}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="cursor-pointer mt-4 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map(({ task, originalIndex }) => {
            if (task.completed) {
              return <CompleteTask key={originalIndex} data={task} />;
            }
            if (task.failed) {
              return <FailedTask key={originalIndex} data={task} />;
            }
            if (task.newTask) {
              return (
                <NewTask
                  key={originalIndex}
                  data={task}
                  onAccept={() => updateTaskStatus(originalIndex, "accept")}
                />
              );
            }
            if (task.active) {
              return (
                <AcceptTask
                  key={originalIndex}
                  data={task}
                  onComplete={() => updateTaskStatus(originalIndex, "completed")}
                  onFail={() => updateTaskStatus(originalIndex, "failed")}
                />
              );
            }
            return null;
          })}
        </div>
      ) : (
        <div
          id="TaskListC"
          className="flex items-stretch justify-start gap-5 overflow-x-auto flex-nowrap py-2 pb-6 min-h-[300px]"
        >
          {filteredTasks.map(({ task, originalIndex }) => {
            const cardWrapperClass = "w-80 shrink-0";
            if (task.completed) {
              return (
                <div key={originalIndex} className={cardWrapperClass}>
                  <CompleteTask data={task} />
                </div>
              );
            }
            if (task.failed) {
              return (
                <div key={originalIndex} className={cardWrapperClass}>
                  <FailedTask data={task} />
                </div>
              );
            }
            if (task.newTask) {
              return (
                <div key={originalIndex} className={cardWrapperClass}>
                  <NewTask
                    data={task}
                    onAccept={() => updateTaskStatus(originalIndex, "accept")}
                  />
                </div>
              );
            }
            if (task.active) {
              return (
                <div key={originalIndex} className={cardWrapperClass}>
                  <AcceptTask
                    data={task}
                    onComplete={() => updateTaskStatus(originalIndex, "completed")}
                    onFail={() => updateTaskStatus(originalIndex, "failed")}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}

export default TaskListC;
