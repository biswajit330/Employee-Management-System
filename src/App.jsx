import { useContext, useState } from "react";
import Login from "./Components/Auth/Login";
import EmployeeDashboard from "./Components/Dashboard/EmployeeDashboard";
import AdminDashboard from "./Components/Dashboard/AdminDashboard";
import { AuthContext } from "./context/AuthContext";

function App() {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("loggedInUser");
      return storedUser ? JSON.parse(storedUser).role : null;
    } catch {
      return null;
    }
  });

  const [loggedInUser, setloggedInUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("loggedInUser");
      return storedUser ? JSON.parse(storedUser).data : null;
    } catch {
      return null;
    }
  });

  const authdata = useContext(AuthContext);

  const handelLogin = (email, password) => {
    if (!authdata) {
      return false;
    }

    // Check Admin
    const admin = authdata.admin?.find(
      (a) => a.email === email && a.password === password
    );

    if (admin) {
      setUser("admin");
      setloggedInUser(admin);

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          role: "admin",
          data: admin,
        })
      );

      return true;
    }

    // Check Employee
    const employee = authdata.employees?.find(
      (e) => e.email === email && e.password === password
    );

    if (employee) {
      setUser("employee");
      setloggedInUser(employee);

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          role: "employee",
          data: employee,
        })
      );

      return true;
    }

    return false;
  };

  const currentEmployeeData =
    user === "employee" && loggedInUser
      ? authdata.employees?.find((e) => e.id === loggedInUser.id || e.email === loggedInUser.email) || loggedInUser
      : loggedInUser;

  return (
    <>
      {!user && <Login handelLogin={handelLogin} />}

      {user === "admin" && <AdminDashboard changeUser={setUser} data={loggedInUser} />}

      {user === "employee" && (
        <EmployeeDashboard changeUser={setUser} data={currentEmployeeData} />
      )}
    </>
  );
}

export default App;
