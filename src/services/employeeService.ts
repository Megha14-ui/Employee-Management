// src/services/employeeService.ts
import axios from "axios";
import { Employee } from "../types/employee";

const BASE_URL = "http://localhost:5000/employees";

export const getEmployees = async (): Promise<Employee[]> => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const getEmployeeById = async (id: number): Promise<Employee> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const createEmployee = async (data: Employee): Promise<Employee> => {
  const res = await axios.post(BASE_URL, data);
  return res.data;
};

export const updateEmployee = async (id: number, data: Employee): Promise<Employee> => {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};
