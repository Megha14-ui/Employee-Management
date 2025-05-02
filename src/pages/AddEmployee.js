import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Box, Button, Card, CardContent, Typography, Grid, Divider, Alert, Snackbar, CircularProgress, TextField, IconButton, Backdrop, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogActions, DialogContent, DialogTitle, } from "@mui/material";
import { Add, Clear } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useEmployeeContext } from "../context/EmployeeContext";
import { z } from "zod";
// Zod validation schema for address form
const addressValidationSchema = z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z
        .string()
        .min(1, "ZIP Code is required")
        .regex(/^\d+$/, "ZIP Code must be numeric"),
});
const validationSchema = yup.object({
    employeeId: yup.string().required("Employee ID is required"),
    name: yup.string().required("Name is required"),
    organization: yup.string().required("Organization is required"),
    position: yup.string().required("Position is required"),
});
const AddEmployee = () => {
    const navigate = useNavigate();
    const { addEmployee, loading: contextLoading } = useEmployeeContext();
    const [addresses, setAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [addressForm, setAddressForm] = useState({
        street: "",
        city: "",
        state: "",
        zip: "",
    });
    const [addressError, setAddressError] = useState("");
    const formik = useFormik({
        initialValues: {
            employeeId: "",
            name: "",
            organization: "",
            position: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsSubmitting(true);
                if (addresses.length === 0) {
                    setSnackbar({
                        open: true,
                        message: "Please add at least one address",
                        severity: "error",
                    });
                    setIsSubmitting(false);
                    return;
                }
                const employeeData = {
                    employeeId: values.employeeId,
                    name: values.name,
                    organization: values.organization,
                    position: values.position,
                    addresses,
                };
                await addEmployee(employeeData);
                setSnackbar({
                    open: true,
                    message: "Employee added successfully! Redirecting...",
                    severity: "success",
                });
                formik.resetForm();
                setAddresses([]);
                setTimeout(() => navigate("/employee-list"), 1500);
            }
            catch (error) {
                setSnackbar({
                    open: true,
                    message: error.message || "Failed to add employee.",
                    severity: "error",
                });
            }
            finally {
                setIsSubmitting(false);
            }
        },
    });
    const handleAddressInputChange = (e) => {
        const { name, value } = e.target;
        setAddressForm((prev) => ({ ...prev, [name]: value }));
    };
    const handleAddAddress = () => {
        try {
            addressValidationSchema.parse(addressForm);
            setAddresses((prev) => [...prev, addressForm]);
            setAddressForm({ street: "", city: "", state: "", zip: "" });
            setSnackbar({
                open: true,
                message: "Address added successfully",
                severity: "success",
            });
            setShowAddressForm(false);
            setAddressError("");
        }
        catch (error) {
            setAddressError(error.errors.map((e) => e.message).join(", "));
        }
    };
    const handleRemoveAddress = (index) => {
        setAddresses((prev) => prev.filter((_, i) => i !== index));
    };
    return (_jsxs(Box, { sx: { p: 4 }, children: [_jsxs("form", { onSubmit: formik.handleSubmit, children: [_jsx(Card, { sx: { mb: 3, boxShadow: 3 }, children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, sx: {
                                        backgroundColor: "grey",
                                        p: 1,
                                        borderRadius: 1,
                                        textAlign: "center",
                                    }, children: "Basic Details" }), _jsxs(Grid, { container: true, spacing: 2, sx: { mt: 2 }, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, name: "employeeId", label: "Employee ID", value: formik.values.employeeId, onChange: formik.handleChange, error: formik.touched.employeeId &&
                                                    Boolean(formik.errors.employeeId), helperText: formik.touched.employeeId && formik.errors.employeeId }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, name: "name", label: "Name", value: formik.values.name, onChange: formik.handleChange, error: formik.touched.name && Boolean(formik.errors.name), helperText: formik.touched.name && formik.errors.name }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, name: "organization", label: "Organization", value: formik.values.organization, onChange: formik.handleChange, error: formik.touched.organization &&
                                                    Boolean(formik.errors.organization), helperText: formik.touched.organization && formik.errors.organization }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, name: "position", label: "Position", value: formik.values.position, onChange: formik.handleChange, error: formik.touched.position && Boolean(formik.errors.position), helperText: formik.touched.position && formik.errors.position }) })] })] }) }), _jsx(Card, { sx: { mb: 3, boxShadow: 3 }, children: _jsxs(CardContent, { sx: { backgroundColor: "#f4f4f4" }, children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", sx: { backgroundColor: "grey", padding: "8px" }, children: [_jsx(Typography, { variant: "h6", sx: { p: 1, borderRadius: 1 }, children: "Addresses" }), _jsx(Button, { startIcon: _jsx(Add, { sx: { color: "white" } }), onClick: () => setShowAddressForm(true), disabled: showAddressForm, variant: "outlined", children: "Add Address" })] }), _jsx(Divider, { sx: { my: 2 } }), addresses.length > 0 ? (_jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "#" }), _jsx(TableCell, { children: "Street" }), _jsx(TableCell, { children: "City" }), _jsx(TableCell, { children: "State" }), _jsx(TableCell, { children: "ZIP" }), _jsx(TableCell, { children: "Action" })] }) }), _jsx(TableBody, { children: addresses.map((addr, index) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: index + 1 }), _jsx(TableCell, { children: addr.street }), _jsx(TableCell, { children: addr.city }), _jsx(TableCell, { children: addr.state }), _jsx(TableCell, { children: addr.zip }), _jsx(TableCell, { children: _jsx(IconButton, { color: "error", onClick: () => handleRemoveAddress(index), children: _jsx(Clear, {}) }) })] }, index))) })] })) : (_jsx(Typography, { variant: "body2", color: "textSecondary", children: "No addresses added yet." }))] }) }), _jsxs(Box, { display: "flex", justifyContent: "center", gap: 2, children: [_jsx(Button, { type: "submit", variant: "contained", color: "primary", disabled: isSubmitting, children: isSubmitting ? (_jsx(CircularProgress, { size: 24, sx: { color: "white" } })) : ("Submit") }), _jsx(Button, { type: "button", variant: "outlined", color: "secondary", onClick: () => navigate("/employee-list"), children: "Cancel" })] })] }), _jsx(Snackbar, { open: snackbar.open, autoHideDuration: 6000, onClose: () => setSnackbar({ ...snackbar, open: false }), children: _jsx(Alert, { onClose: () => setSnackbar({ ...snackbar, open: false }), severity: snackbar.severity, children: snackbar.message }) }), _jsx(Backdrop, { open: contextLoading, sx: { color: "#fff", zIndex: 9999 }, children: _jsx(CircularProgress, { color: "inherit" }) }), _jsxs(Dialog, { open: showAddressForm, onClose: () => setShowAddressForm(false), children: [_jsx(DialogTitle, { children: "Add Address" }), _jsx(DialogContent, { children: _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, name: "street", label: "Street", value: addressForm.street, onChange: handleAddressInputChange, error: !!addressError, helperText: addressError }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, name: "city", label: "City", value: addressForm.city, onChange: handleAddressInputChange, error: !!addressError, helperText: addressError }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, name: "state", label: "State", value: addressForm.state, onChange: handleAddressInputChange, error: !!addressError, helperText: addressError }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, name: "zip", label: "ZIP Code", value: addressForm.zip, onChange: handleAddressInputChange, error: !!addressError, helperText: addressError }) })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setShowAddressForm(false), color: "secondary", children: "Cancel" }), _jsx(Button, { onClick: handleAddAddress, color: "primary", children: "Add Address" })] })] })] }));
};
export default AddEmployee;
