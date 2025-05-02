import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeList from "./pages/EmployeeList";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";
import ViewEmployee from "./pages/ViewEmployee";
import { EmployeeProvider } from "./context/EmployeeContext";
import React from "react";

const App = () => {
  return (
    <EmployeeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/employee-list" element={<EmployeeList />} />
          <Route path="/add" element={<AddEmployee />} />
          <Route path="/edit/:id" element={<EditEmployee />} />
          <Route path="/view/:id" element={<ViewEmployee />} />
        </Routes>
      </Router>
    </EmployeeProvider>
  );
};

export default App;
