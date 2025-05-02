import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Paper, CircularProgress, Alert, IconButton, } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
const EditEmployee = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [editingAddressIndex, setEditingAddressIndex] = useState(null);
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/employees/${id}`);
                setEmployee(response.data);
            }
            catch (err) {
                setError("Failed to fetch employee data.");
            }
            finally {
                setLoading(false);
            }
        };
        fetchEmployee();
    }, [id]);
    const handleChange = (e) => {
        if (employee) {
            setEmployee({ ...employee, [e.target.name]: e.target.value });
        }
    };
    const handleAddressChange = (index, field, value) => {
        if (employee) {
            const updatedAddresses = [...employee.addresses];
            updatedAddresses[index] = {
                ...updatedAddresses[index],
                [field]: value,
            };
            setEmployee({ ...employee, addresses: updatedAddresses });
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(`http://localhost:5000/employees/${id}`, employee);
            navigate("/");
        }
        catch (err) {
            setError("Failed to update employee.");
        }
        finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", mt: 5, children: _jsx(CircularProgress, {}) }));
    }
    if (error) {
        return (_jsx(Alert, { severity: "error", sx: { mt: 5 }, children: error }));
    }
    if (!employee)
        return null;
    return (_jsx(Box, { display: "flex", justifyContent: "center", mt: 5, children: _jsxs(Paper, { sx: {
                p: 4,
                width: "100%",
                maxWidth: 600,
                boxShadow: 3,
                borderRadius: 3,
                backgroundColor: "#f9f9f9",
            }, children: [_jsx(Typography, { variant: "h5", mb: 2, color: "primary", fontWeight: "bold", children: "Edit Employee" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(TextField, { fullWidth: true, name: "employeeId", label: "Employee ID", value: employee.employeeId, onChange: handleChange, margin: "normal", required: true, sx: {
                                backgroundColor: "#fff",
                                borderRadius: 2,
                                "& .MuiInputBase-root": {
                                    padding: "10px",
                                },
                            } }), _jsx(TextField, { fullWidth: true, name: "name", label: "Name", value: employee.name, onChange: handleChange, margin: "normal", required: true, sx: {
                                backgroundColor: "#fff",
                                borderRadius: 2,
                                "& .MuiInputBase-root": {
                                    padding: "10px",
                                },
                            } }), _jsx(TextField, { fullWidth: true, name: "organization", label: "Organization", value: employee.organization, onChange: handleChange, margin: "normal", required: true, sx: {
                                backgroundColor: "#fff",
                                borderRadius: 2,
                                "& .MuiInputBase-root": {
                                    padding: "10px",
                                },
                            } }), _jsx(TextField, { fullWidth: true, name: "position", label: "Position", value: employee.position, onChange: handleChange, margin: "normal", required: true, sx: {
                                backgroundColor: "#fff",
                                borderRadius: 2,
                                "& .MuiInputBase-root": {
                                    padding: "10px",
                                },
                            } }), _jsx(Typography, { variant: "h6", mt: 3, color: "secondary", fontWeight: "bold", children: "Address Details" }), employee.addresses?.map((address, index) => (_jsx(Box, { mt: 2, p: 2, border: "1px solid #ddd", borderRadius: 2, position: "relative", bgcolor: "#fafafa", boxShadow: 1, children: editingAddressIndex === index ? (_jsxs(_Fragment, { children: [_jsx(TextField, { fullWidth: true, label: "Street", value: address.street, onChange: (e) => handleAddressChange(index, "street", e.target.value), margin: "dense", sx: {
                                            marginBottom: 2,
                                            backgroundColor: "#fff",
                                            borderRadius: 2,
                                        } }), _jsx(TextField, { fullWidth: true, label: "City", value: address.city, onChange: (e) => handleAddressChange(index, "city", e.target.value), margin: "dense", sx: {
                                            marginBottom: 2,
                                            backgroundColor: "#fff",
                                            borderRadius: 2,
                                        } }), _jsx(TextField, { fullWidth: true, label: "State", value: address.state, onChange: (e) => handleAddressChange(index, "state", e.target.value), margin: "dense", sx: {
                                            marginBottom: 2,
                                            backgroundColor: "#fff",
                                            borderRadius: 2,
                                        } }), _jsx(TextField, { fullWidth: true, label: "Zip", value: address.zip, onChange: (e) => handleAddressChange(index, "zip", e.target.value), margin: "dense", sx: {
                                            marginBottom: 2,
                                            backgroundColor: "#fff",
                                            borderRadius: 2,
                                        } }), _jsx(Box, { mt: 1, children: _jsx(IconButton, { onClick: () => setEditingAddressIndex(null), children: _jsx(SaveIcon, { sx: { color: "#4caf50" } }) }) })] })) : (_jsxs(_Fragment, { children: [_jsxs(Typography, { children: [_jsx("strong", { children: "Street:" }), " ", address.street] }), _jsxs(Typography, { children: [_jsx("strong", { children: "City:" }), " ", address.city] }), _jsxs(Typography, { children: [_jsx("strong", { children: "State:" }), " ", address.state] }), _jsxs(Typography, { children: [_jsx("strong", { children: "Zip:" }), " ", address.zip] }), _jsx(Box, { position: "absolute", top: 5, right: 5, children: _jsx(IconButton, { onClick: () => setEditingAddressIndex(index), children: _jsx(EditIcon, { sx: { color: "#1976d2" } }) }) })] })) }, index))), _jsxs(Box, { mt: 3, display: "flex", justifyContent: "space-between", children: [_jsx(Button, { variant: "outlined", onClick: () => navigate("/"), disabled: saving, sx: {
                                        backgroundColor: "#f44336",
                                        color: "#fff",
                                        "&:hover": {
                                            backgroundColor: "#d32f2f",
                                        },
                                    }, children: "Cancel" }), _jsx(Button, { variant: "contained", type: "submit", color: "primary", disabled: saving, sx: {
                                        backgroundColor: "#4caf50",
                                        color: "#fff",
                                        "&:hover": {
                                            backgroundColor: "#388e3c",
                                        },
                                    }, children: saving ? _jsx(CircularProgress, { size: 24 }) : "Update" })] })] })] }) }));
};
export default EditEmployee;
