// src/services/employeeService.ts
import axios from "axios";
const BASE_URL = "http://localhost:5000/employees";
export const getEmployees = async () => {
    const res = await axios.get(BASE_URL);
    return res.data;
};
export const getEmployeeById = async (id) => {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data;
};
export const createEmployee = async (data) => {
    const res = await axios.post(BASE_URL, data);
    return res.data;
};
export const updateEmployee = async (id, data) => {
    const res = await axios.put(`${BASE_URL}/${id}`, data);
    return res.data;
};
export const deleteEmployee = async (id) => {
    await axios.delete(`${BASE_URL}/${id}`);
};
