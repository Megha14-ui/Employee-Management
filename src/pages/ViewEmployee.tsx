import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Employee, useEmployeeContext } from "../context/EmployeeContext";
import DeleteIcon from "@mui/icons-material/Delete";

const ViewEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteEmployee } = useEmployeeContext();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/employees/${id}`
        );
        setEmployee(response.data);
      } catch (err) {
        setError("Failed to load employee details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 5 }}>
        {error}
      </Alert>
    );
  }

  if (!employee) return null;

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (id) {
        await deleteEmployee(Number(id));
        setDeleteDialogOpen(false);
        navigate("/");
      }
    } catch (error) {
      setError("Failed to delete employee.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      mt={5}
      sx={{ backgroundColor: "#f0f0f0" }} // Grey background for the entire page
    >
      <Paper sx={{ p: 4, width: "100%", maxWidth: 700, borderRadius: 2 }}>
        {/* Employee Details Header Section */}
        <Box mb={4} sx={{ backgroundColor: "#f4f6f8", p: 2, borderRadius: 2 }}>
          <Typography variant="h5" color="primary" textAlign="center">
            Employee Details
          </Typography>
        </Box>

        {/* Basic Details Section with enhanced title */}
        <Box
          mb={4}
          p={3}
          sx={{
            backgroundColor: "#fff", // White background for Basic Details
            borderRadius: 2,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold", // Bold text
              fontSize: "1.2rem", // Slightly larger font size
              color: "#3f51b5", // Blue color for the title
              borderBottom: "2px solid #3f51b5", // Blue bottom border for emphasis
              paddingBottom: "8px", // Padding at the bottom of the title
              marginBottom: "16px", // Space between title and content
            }}
          >
            Basic Details
          </Typography>
          <Typography>
            <strong>ID:</strong> {employee.employeeId}
          </Typography>
          <Typography>
            <strong>Name:</strong> {employee.name}
          </Typography>
          <Typography>
            <strong>Organization:</strong> {employee.organization}
          </Typography>
          <Typography>
            <strong>Position:</strong> {employee.position}
          </Typography>
        </Box>

        {/* Address Details Section with enhanced title */}
        <Box
          p={3}
          sx={{
            backgroundColor: "#fff", // White background for Address Details
            borderRadius: 2,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Same box shadow as Basic Details
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold", // Bold text
              fontSize: "1.2rem", // Slightly larger font size
              color: "#3f51b5", // Blue color for the title
              borderBottom: "2px solid #3f51b5", // Blue bottom border for emphasis
              paddingBottom: "8px", // Padding at the bottom of the title
              marginBottom: "16px", // Space between title and content
            }}
          >
            Address Details
          </Typography>
          {employee.addresses && employee.addresses.length > 0 ? (
            employee.addresses.map((address, index) => (
              <Box
                key={index}
                mt={2}
                p={2}
                sx={{
                  backgroundColor: "#fff", // White background for each address block
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Same box shadow as address section
                  borderRadius: 2,
                }}
              >
                <Typography>
                  <strong>Street:</strong> {address.street}
                </Typography>
                <Typography>
                  <strong>City:</strong> {address.city}
                </Typography>
                <Typography>
                  <strong>State:</strong> {address.state}
                </Typography>
                <Typography>
                  <strong>Zip:</strong> {address.zip}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography mt={2}>No addresses available</Typography>
          )}
        </Box>

        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" onClick={() => navigate("/")}>
            Back
          </Button>
          <Button variant="contained" onClick={() => navigate(`/edit/${id}`)}>
            Edit
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {employee?.name}? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewEmployee;
