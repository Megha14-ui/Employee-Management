import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployeeContext } from "../context/EmployeeContext";
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Pagination,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
  Alert,
  InputAdornment,
} from "@mui/material";
import {
  Search,
  FilterList,
  Add,
  Delete,
  Visibility,
  Edit,
  Clear,
} from "@mui/icons-material";

const EmployeeList = () => {
  const navigate = useNavigate();
  const {
    employees,
    loading,
    error,
    deleteEmployee,
    deleteMultipleEmployees,
    clearError,
  } = useEmployeeContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [showOrgFilter, setShowOrgFilter] = useState(false);
  const [orgFilterTerm, setOrgFilterTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filter employees based on search and org filters
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = Object.values(emp).some((val) =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesOrg = orgFilterTerm
      ? emp.organization?.toLowerCase().includes(orgFilterTerm.toLowerCase())
      : true;
    return matchesSearch && matchesOrg;
  });

  // Paginate filtered results
  const paginatedEmployees = filteredEmployees.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteConfirm = async () => {
    try {
      if (employeeToDelete) {
        await deleteEmployee(employeeToDelete);
      } else {
        await deleteMultipleEmployees(selectedIds);
        setSelectedIds([]);
      }
    } finally {
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedEmployees.map((emp) => emp.id);
    const areAllSelected = currentPageIds.every((id) =>
      selectedIds.includes(id)
    );
    if (areAllSelected) {
      setSelectedIds(selectedIds.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedIds([...new Set([...selectedIds, ...currentPageIds])]);
    }
  };

  const isAllSelected =
    paginatedEmployees.length > 0 &&
    paginatedEmployees.every((emp) => selectedIds.includes(emp.id));

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2, boxShadow: 3 }}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            fullWidth
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <IconButton onClick={() => setShowOrgFilter(!showOrgFilter)}>
            <FilterList />
          </IconButton>
          <IconButton color="primary" onClick={() => navigate("/add")}>
            <Add />
          </IconButton>
          <IconButton
            color="error"
            disabled={selectedIds.length === 0 || loading}
            onClick={() => setDeleteDialogOpen(true)}
          >
            {loading ? <CircularProgress size={24} /> : <Delete />}
          </IconButton>
        </Box>

        {showOrgFilter && (
          <Box mt={2}>
            <TextField
              fullWidth
              placeholder="Filter by organization..."
              value={orgFilterTerm}
              onChange={(e) => setOrgFilterTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: orgFilterTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setOrgFilterTerm("")}>
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}
      </Paper>

      <TableContainer component={Paper} sx={{ boxShadow: 3, mb: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "grey.800" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedIds.length > 0 &&
                    selectedIds.length < paginatedEmployees.length
                  }
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  disabled={loading || employees.length === 0}
                />
              </TableCell>
              <TableCell sx={{ color: "white" }}>Employee ID</TableCell>
              <TableCell sx={{ color: "white" }}>Name</TableCell>
              <TableCell sx={{ color: "white" }}>Organization</TableCell>
              <TableCell sx={{ color: "white" }}>Position</TableCell>
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : paginatedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary">
                    {employees.length === 0
                      ? "No employees added yet"
                      : "No matching records found"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedEmployees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(emp.id)}
                      onChange={() => handleSelect(emp.id)}
                    />
                  </TableCell>
                  <TableCell>{emp.employeeId}</TableCell>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.organization}</TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => navigate(`/view/${emp.id}`)}>
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => navigate(`/edit/${emp.id}`)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setEmployeeToDelete(emp.id);
                        setDeleteDialogOpen(true);
                      }}
                      disabled={loading}
                    >
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <Typography variant="body2" sx={{ mr: 2 }}>
            Rows per page:
          </Typography>
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            size="small"
            disabled={loading}
          >
            {[5, 10, 25].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="body2" sx={{ ml: 2 }}>
            {`${(page - 1) * rowsPerPage + 1}-${Math.min(
              page * rowsPerPage,
              filteredEmployees.length
            )} of ${filteredEmployees.length}`}
          </Typography>
        </Box>
        <Pagination
          count={Math.ceil(filteredEmployees.length / rowsPerPage)}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
          color="primary"
          disabled={loading}
        />
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setEmployeeToDelete(null);
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          {employeeToDelete
            ? "Are you sure you want to delete this employee?"
            : "Are you sure you want to delete the selected employees?"}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setEmployeeToDelete(null);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="secondary"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeList;
