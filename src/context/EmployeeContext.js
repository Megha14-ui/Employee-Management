import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useCallback, } from "react";
import axios from "axios";
const EmployeeContext = createContext(undefined);
export const EmployeeProvider = ({ children, }) => {
    const [state, setState] = useState({
        employees: [],
        loading: false,
        error: null,
        serverStatus: "checking",
    });
    const API_BASE = "http://localhost:5000";
    const API_URL = `${API_BASE}/employees`;
    const fetchEmployees = useCallback(async () => {
        try {
            setState((prev) => ({ ...prev, loading: true, error: null }));
            const response = await axios.get(API_URL, { timeout: 5000 });
            setState((prev) => ({
                ...prev,
                employees: response.data,
                serverStatus: "online",
                loading: false,
            }));
        }
        catch (err) {
            if (axios.isCancel(err))
                return;
            setState((prev) => ({
                ...prev,
                serverStatus: "offline",
                error: "Failed to connect to server",
                loading: false,
            }));
        }
    }, [API_URL]);
    const addEmployee = useCallback(async (employee) => {
        try {
            setState((prev) => ({ ...prev, loading: true, error: null }));
            await axios.post(API_URL, employee, { timeout: 5000 });
            await fetchEmployees();
        }
        catch (err) {
            if (axios.isCancel(err))
                return;
            setState((prev) => ({
                ...prev,
                error: "Failed to add employee",
                loading: false,
            }));
            throw err;
        }
    }, [API_URL, fetchEmployees]);
    const deleteEmployee = async (id) => {
        try {
            setState((prev) => ({ ...prev, loading: true, error: null }));
            await axios.delete(`${API_URL}/${id}`);
            setState((prev) => ({
                ...prev,
                employees: prev.employees.filter((emp) => emp.id !== id),
                loading: false,
            }));
        }
        catch (err) {
            setState((prev) => ({
                ...prev,
                error: "Failed to delete employee.",
                loading: false,
            }));
        }
    };
    const deleteMultipleEmployees = async (ids) => {
        try {
            setState((prev) => ({ ...prev, loading: true, error: null }));
            await Promise.all(ids.map((id) => axios.delete(`${API_URL}/${id}`)));
            setState((prev) => ({
                ...prev,
                employees: prev.employees.filter((emp) => !ids.includes(emp.id)),
                loading: false,
            }));
        }
        catch (err) {
            setState((prev) => ({
                ...prev,
                error: "Failed to delete selected employees.",
                loading: false,
            }));
        }
    };
    const clearError = useCallback(() => {
        setState((prev) => ({ ...prev, error: null }));
    }, []);
    useEffect(() => {
        const controller = new AbortController();
        const checkServer = async () => {
            try {
                await axios.get(`${API_BASE}/status`, {
                    timeout: 3000,
                    signal: controller.signal,
                });
                await fetchEmployees();
            }
            catch {
                setState((prev) => ({ ...prev, serverStatus: "offline" }));
            }
        };
        checkServer();
        return () => controller.abort();
    }, [fetchEmployees]);
    return (_jsx(EmployeeContext.Provider, { value: {
            employees: state.employees,
            loading: state.loading,
            error: state.error,
            serverStatus: state.serverStatus,
            fetchEmployees,
            addEmployee,
            deleteEmployee,
            deleteMultipleEmployees,
            clearError,
        }, children: children }));
};
export const useEmployeeContext = () => {
    const context = useContext(EmployeeContext);
    if (!context) {
        throw new Error("useEmployeeContext must be used within an EmployeeProvider");
    }
    return context;
};
