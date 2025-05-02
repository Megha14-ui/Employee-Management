import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Box, Paper, Typography, CircularProgress, Alert, Button, } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const ViewEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/employees/${id}`);
                setEmployee(response.data);
            }
            catch (err) {
                setError("Failed to load employee details.");
            }
            finally {
                setLoading(false);
            }
        };
        fetchEmployee();
    }, [id]);
    if (loading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", mt: 5, children: _jsx(CircularProgress, {}) }));
    }
    if (error) {
        return (_jsx(Alert, { severity: "error", sx: { mt: 5 }, children: error }));
    }
    if (!employee)
        return null;
    return (_jsx(Box, { display: "flex", justifyContent: "center", mt: 5, sx: { backgroundColor: "#f0f0f0" }, children: _jsxs(Paper, { sx: { p: 4, width: "100%", maxWidth: 700, borderRadius: 2 }, children: [_jsx(Box, { mb: 4, sx: { backgroundColor: "#f4f6f8", p: 2, borderRadius: 2 }, children: _jsx(Typography, { variant: "h5", color: "primary", textAlign: "center", children: "Employee Details" }) }), _jsxs(Box, { mb: 4, p: 3, sx: {
                        backgroundColor: "#fff", // White background for Basic Details
                        borderRadius: 2,
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }, children: [_jsx(Typography, { variant: "h6", sx: {
                                fontWeight: "bold", // Bold text
                                fontSize: "1.2rem", // Slightly larger font size
                                color: "#3f51b5", // Blue color for the title
                                borderBottom: "2px solid #3f51b5", // Blue bottom border for emphasis
                                paddingBottom: "8px", // Padding at the bottom of the title
                                marginBottom: "16px", // Space between title and content
                            }, children: "Basic Details" }), _jsxs(Typography, { children: [_jsx("strong", { children: "ID:" }), " ", employee.employeeId] }), _jsxs(Typography, { children: [_jsx("strong", { children: "Name:" }), " ", employee.name] }), _jsxs(Typography, { children: [_jsx("strong", { children: "Organization:" }), " ", employee.organization] }), _jsxs(Typography, { children: [_jsx("strong", { children: "Position:" }), " ", employee.position] })] }), _jsxs(Box, { p: 3, sx: {
                        backgroundColor: "#fff", // White background for Address Details
                        borderRadius: 2,
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Same box shadow as Basic Details
                    }, children: [_jsx(Typography, { variant: "h6", sx: {
                                fontWeight: "bold", // Bold text
                                fontSize: "1.2rem", // Slightly larger font size
                                color: "#3f51b5", // Blue color for the title
                                borderBottom: "2px solid #3f51b5", // Blue bottom border for emphasis
                                paddingBottom: "8px", // Padding at the bottom of the title
                                marginBottom: "16px", // Space between title and content
                            }, children: "Address Details" }), employee.addresses && employee.addresses.length > 0 ? (employee.addresses.map((address, index) => (_jsxs(Box, { mt: 2, p: 2, sx: {
                                backgroundColor: "#fff", // White background for each address block
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Same box shadow as address section
                                borderRadius: 2,
                            }, children: [_jsxs(Typography, { children: [_jsx("strong", { children: "Street:" }), " ", address.street] }), _jsxs(Typography, { children: [_jsx("strong", { children: "City:" }), " ", address.city] }), _jsxs(Typography, { children: [_jsx("strong", { children: "State:" }), " ", address.state] }), _jsxs(Typography, { children: [_jsx("strong", { children: "Zip:" }), " ", address.zip] })] }, index)))) : (_jsx(Typography, { mt: 2, children: "No addresses available" }))] }), _jsx(Box, { mt: 4, display: "flex", justifyContent: "center", gap: 2, children: _jsx(Button, { variant: "contained", onClick: () => navigate("/"), children: "Back" }) })] }) }));
};
export default ViewEmployee;
