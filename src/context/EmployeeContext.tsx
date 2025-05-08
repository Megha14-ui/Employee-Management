import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode
} from "react";
import { 
  Employee, 
  EmployeeInput, 
  ServerStatus 
} from "../types/employee";
import * as employeeService from "../services/employeeService";

interface EmployeeContextType {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  serverStatus: ServerStatus;
  fetchEmployees: () => Promise<void>;
  addEmployee: (employee: EmployeeInput) => Promise<void>;
  updateEmployee: (id: number, employee: Employee) => Promise<void>;
  deleteEmployee: (id: number) => Promise<void>;
  clearError: () => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

interface EmployeeProviderProps {
  children: ReactNode;
}

export const EmployeeProvider: React.FC<EmployeeProviderProps> = ({ children }) => {
  const [state, setState] = useState<{
    employees: Employee[];
    loading: boolean;
    error: string | null;
    serverStatus: ServerStatus;
  }>({
    employees: [],
    loading: false,
    error: null,
    serverStatus: "checking",
  });

  const checkServerStatus = useCallback(async () => {
    try {
      const isOnline = await employeeService.checkServerStatus();
      setState(prev => ({ 
        ...prev, 
        serverStatus: isOnline ? "online" : "offline" 
      }));
      return isOnline;
    } catch (error) {
      setState(prev => ({ ...prev, serverStatus: "offline" }));
      return false;
    }
  }, []);

  const fetchEmployees = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const isOnline = await checkServerStatus();
      
      if (!isOnline) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: "Server is offline. Unable to fetch data."
        }));
        return;
      }
      
      const data = await employeeService.getEmployees();
      setState(prev => ({
        ...prev,
        employees: data,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to fetch employees",
        loading: false
      }));
    }
  }, [checkServerStatus]);

  const addEmployee = useCallback(async (employee: EmployeeInput) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await employeeService.createEmployee(employee);
      await fetchEmployees();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to add employee",
        loading: false
      }));
      throw error;
    }
  }, [fetchEmployees]);

  const updateEmployee = useCallback(async (id: number, employee: Employee) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await employeeService.updateEmployee(id, employee);
      await fetchEmployees();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to update employee",
        loading: false
      }));
      throw error;
    }
  }, [fetchEmployees]);

  const deleteEmployee = useCallback(async (id: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await employeeService.deleteEmployee(id);
      await fetchEmployees();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to delete employee",
        loading: false
      }));
      throw error;
    }
  }, [fetchEmployees]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    fetchEmployees();
    const intervalId = setInterval(() => {
      checkServerStatus();
    }, 30000); 
    
    return () => clearInterval(intervalId);
  }, [fetchEmployees, checkServerStatus]);

  const contextValue = useMemo(() => ({
    employees: state.employees,
    loading: state.loading,
    error: state.error,
    serverStatus: state.serverStatus,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    clearError,
  }), [
    state.employees,
    state.loading,
    state.error,
    state.serverStatus,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    clearError,
  ]);

  return (
    <EmployeeContext.Provider value={contextValue}>
      {children}
    </EmployeeContext.Provider>
  );
};


export const useEmployeeContext = (): EmployeeContextType => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployeeContext must be used within an EmployeeProvider");
  }
  return context;
};
