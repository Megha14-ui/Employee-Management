import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeList from "./pages/EmployeeList";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";
import ViewEmployee from "./pages/ViewEmployee";
import { EmployeeProvider } from "./context/EmployeeContext";
const App = () => {
    return (_jsx(EmployeeProvider, { children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(EmployeeList, {}) }), _jsx(Route, { path: "/employee-list", element: _jsx(EmployeeList, {}) }), _jsx(Route, { path: "/add", element: _jsx(AddEmployee, {}) }), _jsx(Route, { path: "/edit/:id", element: _jsx(EditEmployee, {}) }), _jsx(Route, { path: "/view/:id", element: _jsx(ViewEmployee, {}) })] }) }) }));
};
export default App;
