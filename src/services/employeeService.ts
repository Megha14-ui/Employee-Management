import axios, { AxiosError } from "axios";
import { Employee, EmployeeInput } from "../types/employee";

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error(`API Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error("API Error: No response received", error.request);
    } else {
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Check server status
export const checkServerStatus = async (): Promise<boolean> => {
  try {
    await api.get('/employees', { timeout: 3000 });
    return true;
  } catch (error) {
    return false;
  }
};

// Get all employees
export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await api.get('/employees');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    throw new Error("Failed to fetch employees. Please try again later.");
  }
};

// Get employee by ID
export const getEmployeeById = async (id: number): Promise<Employee> => {
  if (!id || isNaN(Number(id))) {
    throw new Error("Invalid employee ID");
  }
  
  try {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch employee with ID ${id}:`, error);
    throw new Error("Failed to fetch employee details. Please try again later.");
  }
};

// Create new employee
export const createEmployee = async (data: EmployeeInput): Promise<Employee> => {
  try {
    const response = await api.post('/employees', data);
    return response.data;
  } catch (error) {
    console.error("Failed to create employee:", error);
    throw new Error("Failed to create employee. Please try again later.");
  }
};

// Update employee
export const updateEmployee = async (id: number, data: Employee): Promise<Employee> => {
  if (!id || isNaN(Number(id))) {
    throw new Error("Invalid employee ID");
  }
  
  try {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Failed to update employee with ID ${id}:`, error);
    throw new Error("Failed to update employee. Please try again later.");
  }
};

// Delete employee
export const deleteEmployee = async (id: number): Promise<void> => {
  if (!id || isNaN(Number(id))) {
    throw new Error("Invalid employee ID for deletion");
  }
  
  try {
    console.log(`Deleting employee with ID: ${id}`);
    const deleteUrl = `/employees/${id}`;
    await api.delete(deleteUrl);
    console.log(`Employee with ID ${id} successfully deleted`);
  } catch (error) {
    console.error(`Failed to delete employee with ID ${id}:`, error);
    throw new Error("Failed to delete employee. Please try again later.");
  }
};
