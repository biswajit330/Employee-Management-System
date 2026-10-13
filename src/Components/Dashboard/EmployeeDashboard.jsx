import { useState } from "react";
import Headers from "../other/Headers";
import TaskList from "../other/TaskList";
import TaskListC from "../../TaskList/TaskListC";
import TaskProgressOverview from "../other/TaskProgressOverview";

function EmployeeDashboard({ data, changeUser }) {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Headers
          changeUser={changeUser}
          data={data}
          currentRole="employee"
        />

        {data && (
          <>
            {/* Visual Progress Indicator */}
            <TaskProgressOverview
              title="Personal Task Progress & Velocity"
              subtitle="Real-time ratio of completed milestones versus active/pending tasks"
              counts={data.taskCounts}
            />

            <TaskList
              data={data}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            <div className="mt-8">
              <TaskListC
                data={data}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
