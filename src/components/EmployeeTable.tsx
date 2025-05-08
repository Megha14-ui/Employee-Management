import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Tooltip,
  Chip,
  Checkbox,
  Button,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { Visibility, Edit, Delete, Add, FilterList } from "@mui/icons-material";
import { useEmployeeContext } from "../context/EmployeeContext";
import SearchBar from "./SearchBar";
import CustomPagination from "./Pagination";
import ConfirmDialog from "./ConfirmDialog";

interface EmployeeTableProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showOrgFilter: boolean;
  onToggleOrgFilter: () => void;
  orgFilterTerm: string;
  onOrgFilterChange: (value: string) => void;
  onAddClick: () => void;
  onViewClick: (id: number) => void;
  onEditClick: (id: number) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  searchTerm,
  onSearchChange,
  showOrgFilter,
  onToggleOrgFilter,
  orgFilterTerm,
  onOrgFilterChange,
  onAddClick,
  onViewClick,
  onEditClick,
}) => {
  const { employees, loading, error, clearError, deleteEmployee } =
    useEmployeeContext();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [multipleDeleteDialogOpen, setMultipleDeleteDialogOpen] =
    useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [orgSearchTerm, setOrgSearchTerm] = useState("");

  const uniqueOrganizations = useMemo(() => {
    return Array.from(
      new Set(employees.map((emp) => emp.organization).filter(Boolean))
    );
  }, [employees]);

  const filteredOrganizations = useMemo(() => {
    return uniqueOrganizations.filter((org) =>
      org.toLowerCase().includes(orgSearchTerm.toLowerCase())
    );
  }, [uniqueOrganizations, orgSearchTerm]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesOrg = orgFilterTerm
        ? emp.organization.toLowerCase().includes(orgFilterTerm.toLowerCase())
        : true;

      return matchesSearch && matchesOrg;
    });
  }, [employees, searchTerm, orgFilterTerm]);

  const paginatedEmployees = useMemo(() => {
    return filteredEmployees.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
    );
  }, [filteredEmployees, page, rowsPerPage]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  const handleDeleteClick = (id: number) => {
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (employeeToDelete !== null) {
      try {
        await deleteEmployee(employeeToDelete);
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleSelectEmployee = (id: number) => {
    setSelectedEmployees((prev) => {
      if (prev.includes(id)) {
        return prev.filter((empId) => empId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAllOnPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      const currentPageIds = paginatedEmployees.map((emp) => emp.id);
      setSelectedEmployees((prev) => {
        const newSelection = [...prev];
        currentPageIds.forEach((id) => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    } else {
      const currentPageIds = paginatedEmployees.map((emp) => emp.id);
      setSelectedEmployees((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    }
  };

  const areAllCurrentPageSelected = useMemo(() => {
    return (
      paginatedEmployees.length > 0 &&
      paginatedEmployees.every((emp) => selectedEmployees.includes(emp.id))
    );
  }, [paginatedEmployees, selectedEmployees]);

  const handleMultipleDeleteClick = () => {
    if (selectedEmployees.length > 0) {
      setMultipleDeleteDialogOpen(true);
    }
  };

  const handleConfirmMultipleDelete = async () => {
    try {
      for (const id of selectedEmployees) {
        await deleteEmployee(id);
      }
      setMultipleDeleteDialogOpen(false);
      setSelectedEmployees([]);
    } catch (error) {
      console.error("Error deleting employees:", error);
    }
  };

  const handleCancelMultipleDelete = () => {
    setMultipleDeleteDialogOpen(false);
  };

  const handleSelectAllFiltered = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      const filteredIds = filteredEmployees.map((emp) => emp.id);
      setSelectedEmployees(filteredIds);
    } else {
      setSelectedEmployees([]);
    }
  };

  const areAllFilteredSelected = useMemo(() => {
    return (
      filteredEmployees.length > 0 &&
      filteredEmployees.every((emp) => selectedEmployees.includes(emp.id))
    );
  }, [filteredEmployees, selectedEmployees]);

  const areSomeFilteredSelected = useMemo(() => {
    return (
      selectedEmployees.length > 0 &&
      selectedEmployees.length < filteredEmployees.length &&
      selectedEmployees.some((id) =>
        filteredEmployees.some((emp) => emp.id === id)
      )
    );
  }, [filteredEmployees, selectedEmployees]);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    onToggleOrgFilter();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOrgSearchTerm("");
  };

  const handleOrgSelect = (org: string) => {
    onOrgFilterChange(org);
    handleMenuClose();
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2, boxShadow: 3 }}>
        <Box display="flex" alignItems="center" gap={2} width="100%">
          <Box sx={{ flexGrow: 1 }}>
            <SearchBar
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Search employees..."
              sx={{ width: "100%" }}
            />
          </Box>

          <Tooltip title="Toggle organization filter">
            <IconButton onClick={handleFilterClick}>
              <FilterList />
            </IconButton>
          </Tooltip>

          <Tooltip title="Add new employee">
            <IconButton color="primary" onClick={onAddClick}>
              <Add />
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={showOrgFilter && Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            style: { maxHeight: 400, width: 300 },
          }}
        >
          <Box sx={{ p: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search organizations..."
              value={orgSearchTerm}
              onChange={(e) => setOrgSearchTerm(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.stopPropagation()} // Prevent menu closing on Enter
            />
          </Box>
          {filteredOrganizations.length > 0 ? (
            filteredOrganizations.map((org) => (
              <MenuItem
                key={org}
                onClick={() => handleOrgSelect(org)}
                selected={org === orgFilterTerm}
              >
                {org}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No matching organizations</MenuItem>
          )}
        </Menu>
      </Paper>

      {/* Multiple Delete Button */}
      {selectedEmployees.length > 0 && (
        <Box mb={2} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleMultipleDeleteClick}
          >
            Delete Selected ({selectedEmployees.length})
          </Button>
        </Box>
      )}

      {/* Employee Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, mb: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "primary.main" }}>
            <TableRow>
              <TableCell padding="checkbox" sx={{ color: "white" }}>
                <Checkbox
                  indeterminate={areSomeFilteredSelected}
                  checked={areAllFilteredSelected}
                  onChange={handleSelectAllFiltered}
                  sx={{
                    color: "white",
                    "&.Mui-checked": {
                      color: "white",
                    },
                    "&.MuiCheckbox-indeterminate": {
                      color: "white",
                    },
                  }}
                />
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Employee ID
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Organization
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Position
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : paginatedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">
                    {employees.length === 0
                      ? "No employees added yet"
                      : "No matching records found"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedEmployees.map((emp) => (
                <TableRow
                  key={emp.id}
                  hover
                  selected={selectedEmployees.includes(emp.id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={() => handleSelectEmployee(emp.id)}
                    />
                  </TableCell>
                  <TableCell>{emp.employeeId}</TableCell>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={emp.organization}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>
                    <Tooltip title="View details">
                      <IconButton
                        onClick={() => onViewClick(emp.id)}
                        color="primary"
                        size="small"
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit employee">
                      <IconButton
                        onClick={() => onEditClick(emp.id)}
                        color="primary"
                        size="small"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete employee">
                      <IconButton
                        onClick={() => handleDeleteClick(emp.id)}
                        color="error"
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <CustomPagination
        page={page}
        rowsPerPage={rowsPerPage}
        totalItems={filteredEmployees.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        disabled={loading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        confirmText="Delete"
        confirmColor="error"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Multiple Delete Confirmation Dialog */}
      <ConfirmDialog
        open={multipleDeleteDialogOpen}
        title="Confirm Multiple Delete"
        message={`Are you sure you want to delete ${selectedEmployees.length} selected employees? This action cannot be undone.`}
        confirmText="Delete All"
        confirmColor="error"
        onConfirm={handleConfirmMultipleDelete}
        onCancel={handleCancelMultipleDelete}
      />
    </Box>
  );
};

export default EmployeeTable;
