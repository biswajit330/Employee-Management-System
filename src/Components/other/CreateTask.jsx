import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { PlusCircle, Check, AlertCircle, Calendar, User, FileText, Sparkles } from "lucide-react";

function CreateTask() {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDate, setTaskDate] = useState(() => {
    // Default to tomorrow's date
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [assignTo, setAssignTo] = useState("");
  const [category, setCategory] = useState("Development");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [notification, setNotification] = useState(null);

  const { employees, admin, setUserData } = useContext(AuthContext);

  const categoryOptions = ["Development", "Frontend", "Backend", "Design", "Database", "Testing", "DevOps"];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskTitle.trim() || !assignTo.trim()) {
      setNotification({
        type: "error",
        message: "Please fill in all required fields (Task Title and Assignee).",
      });
      return;
    }

    const newTask = {
      taskTitle: taskTitle.trim(),
      taskDate: taskDate || new Date().toISOString().split("T")[0],
      category: category.trim() || "General",
      priority: priority,
      taskDescription: description.trim() || "No specific instructions provided.",
      active: false,
      newTask: true,
      failed: false,
      completed: false,
    };

    const storedEmployees = JSON.parse(localStorage.getItem("employees")) || employees || [];
    let employeeFound = false;
    let targetName = "";

    const updatedEmployees = storedEmployees.map((elem) => {
      if (
        elem.firstName.toLowerCase() === assignTo.trim().toLowerCase() ||
        elem.email.toLowerCase() === assignTo.trim().toLowerCase() ||
        String(elem.id) === assignTo.trim()
      ) {
        employeeFound = true;
        targetName = elem.firstName;
        const currentTasks = elem.tasks || [];
        const taskCounts = elem.taskCounts || { active: 0, newTask: 0, completed: 0, failed: 0 };
        return {
          ...elem,
          taskCounts: {
            ...taskCounts,
            newTask: (taskCounts.newTask || 0) + 1,
          },
          tasks: [...currentTasks, newTask],
        };
      }
      return elem;
    });

    if (!employeeFound) {
      setNotification({
        type: "error",
        message: `Employee "${assignTo}" not found. Please choose an employee from the dropdown.`,
      });
      return;
    }

    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
    if (setUserData) {
      setUserData({
        employees: updatedEmployees,
        admin: admin || JSON.parse(localStorage.getItem("admin")) || [],
      });
    }

    setNotification({
      type: "success",
      message: `Task "${taskTitle.trim()}" successfully assigned to ${targetName}!`,
    });

    setTaskTitle("");
    setDescription("");
    // Keep date and category for fast batch entry

    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <span>Create & Assign Task</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Assign workflow items with categories, due dates, and priority levels
          </p>
        </div>
      </div>

      {notification && (
        <div
          className={`mb-6 rounded-xl border p-4 text-xs flex items-center gap-2.5 transition-all ${
            notification.type === "error"
              ? "bg-rose-500/10 border-rose-500/25 text-rose-300"
              : "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
          }`}
        >
          {notification.type === "error" ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <Check className="w-4 h-4 shrink-0" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Task Title <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Implement OAuth Flow / Refactor Database"
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Assign to Employee <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  required
                  value={assignTo}
                  onChange={(e) => setAssignTo(e.target.value)}
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-10 pr-8 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500 transition cursor-pointer appearance-none"
                >
                  <option value="">Select an employee...</option>
                  {employees?.map((emp) => (
                    <option key={emp.id} value={emp.firstName}>
                      {emp.firstName} ({emp.email}) · {emp.taskCounts?.active || 0} active tasks
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Due Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="date"
                    required
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-9 pr-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High Priority</option>
                  <option value="Urgent">Urgent 🔥</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`cursor-pointer px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                      category === cat
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/40"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Or type custom category..."
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Right Column: Description */}
          <div className="flex flex-col justify-between">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Detailed Scope / Description
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={7}
                placeholder="Provide clear acceptance criteria, repository branches, Figma URLs, or specific outcomes required..."
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 p-3.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500 resize-none transition leading-relaxed"
              />
            </div>

            <div className="pt-3 flex items-center justify-end">
              <button
                type="submit"
                className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publish & Assign Task</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateTask;
