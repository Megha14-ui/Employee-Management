import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployeeContext } from "../context/EmployeeContext";
import { Box, TextField, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, MenuItem, Select, Typography, Alert, InputAdornment, Pagination, } from "@mui/material";
import { Search, FilterList, Add, Delete, Visibility, Edit, Clear, } from "@mui/icons-material";
const EmployeeList = () => {
    const navigate = useNavigate();
    const { employees, loading, error, serverStatus, deleteEmployee, deleteMultipleEmployees, clearError, fetchEmployees, } = useEmployeeContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [showOrgFilter, setShowOrgFilter] = useState(false);
    const [orgFilterTerm, setOrgFilterTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [employeeNameToDelete, setEmployeeNameToDelete] = useState(null);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showLoading, setShowLoading] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShowLoading(true), 300);
        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);
    const filteredEmployees = employees.filter((emp) => {
        const matchesSearch = Object.values(emp).some((val) => val?.toString().toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesOrg = orgFilterTerm
            ? emp.organization.toLowerCase().includes(orgFilterTerm.toLowerCase())
            : true;
        return matchesSearch && matchesOrg;
    });
    const paginatedEmployees = filteredEmployees.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setPage(1);
    };
    const handleSelect = (id) => {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
    };
    const handleDeleteConfirm = async () => {
        try {
            if (employeeToDelete) {
                await deleteEmployee(employeeToDelete);
            }
            else if (selectedIds.length > 0) {
                await deleteMultipleEmployees(selectedIds);
                setSelectedIds([]);
            }
        }
        finally {
            setDeleteDialogOpen(false);
            setEmployeeToDelete(null);
            setEmployeeNameToDelete(null);
        }
    };
    const handleSelectAll = () => {
        const currentPageIds = paginatedEmployees.map((emp) => emp.id);
        const areAllSelected = currentPageIds.every((id) => selectedIds.includes(id));
        if (areAllSelected) {
            setSelectedIds(selectedIds.filter((id) => !currentPageIds.includes(id)));
        }
        else {
            setSelectedIds([...new Set([...selectedIds, ...currentPageIds])]);
        }
    };
    const isAllSelected = paginatedEmployees.length > 0 &&
        paginatedEmployees.every((emp) => selectedIds.includes(emp.id));
    return (_jsxs(Box, { sx: { p: 3 }, children: [serverStatus === "offline" && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: "Server is offline. Data may not be up to date." })), error && (_jsx(Alert, { severity: "error", onClose: clearError, sx: { mb: 2 }, children: error })), _jsxs(Paper, { sx: { p: 2, mb: 2, boxShadow: 3 }, children: [_jsxs(Box, { display: "flex", gap: 2, alignItems: "center", children: [_jsx(TextField, { fullWidth: true, placeholder: "Search employees...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), InputProps: {
                                    startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(Search, {}) })),
                                } }), _jsx(IconButton, { onClick: () => setShowOrgFilter(!showOrgFilter), children: _jsx(FilterList, {}) }), _jsx(IconButton, { color: "primary", onClick: () => navigate("/add"), children: _jsx(Add, {}) }), _jsx(IconButton, { color: "error", disabled: selectedIds.length === 0 || loading, onClick: () => setDeleteDialogOpen(true), children: loading ? _jsx(CircularProgress, { size: 24 }) : _jsx(Delete, {}) })] }), showOrgFilter && (_jsx(Box, { mt: 2, children: _jsx(TextField, { fullWidth: true, placeholder: "Filter by organization...", value: orgFilterTerm, onChange: (e) => setOrgFilterTerm(e.target.value), InputProps: {
                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(Search, {}) })),
                                endAdornment: orgFilterTerm && (_jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { onClick: () => setOrgFilterTerm(""), children: _jsx(Clear, {}) }) })),
                            } }) }))] }), _jsx(TableContainer, { component: Paper, sx: { boxShadow: 3, mb: 2 }, children: _jsxs(Table, { children: [_jsx(TableHead, { sx: { bgcolor: "grey.800" }, children: _jsxs(TableRow, { children: [_jsx(TableCell, { padding: "checkbox", children: _jsx(Checkbox, { indeterminate: selectedIds.length > 0 &&
                                                selectedIds.length < paginatedEmployees.length, checked: isAllSelected, onChange: handleSelectAll, disabled: loading || employees.length === 0 }) }), _jsx(TableCell, { sx: { color: "white" }, children: "Employee ID" }), _jsx(TableCell, { sx: { color: "white" }, children: "Name" }), _jsx(TableCell, { sx: { color: "white" }, children: "Organization" }), _jsx(TableCell, { sx: { color: "white" }, children: "Position" }), _jsx(TableCell, { sx: { color: "white" }, children: "Actions" })] }) }), _jsx(TableBody, { children: loading && showLoading ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, align: "center", children: _jsx(CircularProgress, {}) }) })) : paginatedEmployees.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, align: "center", children: _jsx(Typography, { color: "textSecondary", children: employees.length === 0
                                            ? "No employees added yet"
                                            : "No matching records found" }) }) })) : (paginatedEmployees.map((emp) => (_jsxs(TableRow, { children: [_jsx(TableCell, { padding: "checkbox", children: _jsx(Checkbox, { checked: selectedIds.includes(emp.id), onChange: () => handleSelect(emp.id) }) }), _jsx(TableCell, { children: emp.employeeId }), _jsx(TableCell, { children: emp.name }), _jsx(TableCell, { children: emp.organization }), _jsx(TableCell, { children: emp.position }), _jsxs(TableCell, { children: [_jsx(IconButton, { onClick: () => navigate(`/view/${emp.id}`), children: _jsx(Visibility, { fontSize: "small" }) }), _jsx(IconButton, { onClick: () => navigate(`/edit/${emp.id}`), children: _jsx(Edit, { fontSize: "small" }) }), _jsx(IconButton, { onClick: () => {
                                                    setEmployeeToDelete(emp.id);
                                                    setEmployeeNameToDelete(emp.name);
                                                    setDeleteDialogOpen(true);
                                                }, disabled: loading, children: _jsx(Delete, { fontSize: "small", color: "error" }) })] })] }, emp.id)))) })] }) }), _jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", children: [_jsxs(Box, { display: "flex", alignItems: "center", children: [_jsx(Typography, { variant: "body2", sx: { mr: 2 }, children: "Rows per page:" }), _jsx(Select, { value: rowsPerPage, onChange: handleRowsPerPageChange, size: "small", disabled: loading, children: [5, 10, 25].map((num) => (_jsx(MenuItem, { value: num, children: num }, num))) }), _jsx(Typography, { variant: "body2", sx: { ml: 2 }, children: `${(page - 1) * rowsPerPage + 1}-${Math.min(page * rowsPerPage, filteredEmployees.length)} of ${filteredEmployees.length}` })] }), _jsx(Pagination, { count: Math.ceil(filteredEmployees.length / rowsPerPage), page: page, onChange: (_, newPage) => setPage(newPage), color: "primary", disabled: loading })] }), _jsxs(Dialog, { open: deleteDialogOpen, onClose: () => {
                    setDeleteDialogOpen(false);
                    setEmployeeToDelete(null);
                    setEmployeeNameToDelete(null);
                }, children: [_jsx(DialogTitle, { children: "Confirm Delete" }), _jsx(DialogContent, { children: employeeToDelete
                            ? `Are you sure you want to delete ${employeeNameToDelete}?`
                            : `Are you sure you want to delete ${selectedIds.length} employee(s)?` }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => {
                                    setDeleteDialogOpen(false);
                                    setEmployeeToDelete(null);
                                    setEmployeeNameToDelete(null);
                                }, color: "primary", children: "Cancel" }), _jsx(Button, { onClick: handleDeleteConfirm, color: "secondary", variant: "contained", disabled: loading, children: loading ? _jsx(CircularProgress, { size: 24 }) : "Confirm" })] })] })] }));
};
export default EmployeeList;
