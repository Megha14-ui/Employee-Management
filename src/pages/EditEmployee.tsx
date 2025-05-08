import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Employee, Address } from "../types/employee";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const addressValidationSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z
    .string()
    .min(4, "ZIP Code is required")
    .regex(/^\d+$/, "ZIP Code must be numeric"),
});

const validationSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  name: z.string().min(1, "Name is required"),
  organization: z.string().min(1, "Organization is required"),
  position: z.string().min(1, "Position is required"),
});

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editAddressDialogOpen, setEditAddressDialogOpen] = useState(false);
  const [editAddressIndex, setEditAddressIndex] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const addressFormik = useFormik({
    initialValues: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    validationSchema: toFormikValidationSchema(addressValidationSchema),
    onSubmit: (values) => {
      if (employee) {
        const addressToAdd: Address = {
          id: Date.now(),
          ...values,
        };

        const updatedAddresses = employee.addresses
          ? [...employee.addresses, addressToAdd]
          : [addressToAdd];
        setEmployee({ ...employee, addresses: updatedAddresses });
        setAddressDialogOpen(false);
        setSnackbar({
          open: true,
          message: "Address added successfully",
          severity: "success",
        });
        addressFormik.resetForm();
      }
    },
  });

  const editAddressFormik = useFormik({
    initialValues: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    validationSchema: toFormikValidationSchema(addressValidationSchema),
    onSubmit: (values) => {
      if (employee && editAddressIndex !== null) {
        const updatedAddresses = [...employee.addresses];
        updatedAddresses[editAddressIndex] = {
          id: employee.addresses[editAddressIndex].id,
          ...values,
        };
        setEmployee({ ...employee, addresses: updatedAddresses });
        setEditAddressDialogOpen(false);
        setEditAddressIndex(null);
        setSnackbar({
          open: true,
          message: "Address updated successfully",
          severity: "success",
        });
        editAddressFormik.resetForm();
      }
    },
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/employees/${id}`
        );
        setEmployee(response.data);
      } catch (err) {
        setError("Failed to fetch employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      employeeId: employee?.employeeId || "",
      name: employee?.name || "",
      organization: employee?.organization || "",
      position: employee?.position || "",
    },
    validationSchema: toFormikValidationSchema(validationSchema),
    enableReinitialize: true,
    onSubmit: async (values) => {
      setSaving(true);
      try {
        if (
          !employee ||
          !employee.addresses ||
          employee.addresses.length === 0
        ) {
          setSnackbar({
            open: true,
            message: "Please add at least one address",
            severity: "error",
          });
          setSaving(false);
          return;
        }

        const updatedEmployee = {
          ...employee,
          employeeId: values.employeeId,
          name: values.name,
          organization: values.organization,
          position: values.position,
        };

        await axios.put(
          `http://localhost:5000/employees/${id}`,
          updatedEmployee
        );
        setSnackbar({
          open: true,
          message: "Employee updated successfully! Redirecting...",
          severity: "success",
        });
        setTimeout(() => navigate("/"), 1500);
      } catch (err) {
        setError("Failed to update employee.");
        setSnackbar({
          open: true,
          message: "Failed to update employee. Please try again.",
          severity: "error",
        });
      } finally {
        setSaving(false);
      }
    },
  });

  const handleOpenAddressDialog = () => {
    addressFormik.resetForm();
    setAddressDialogOpen(true);
  };

  const handleCloseAddressDialog = () => {
    setAddressDialogOpen(false);
    addressFormik.resetForm();
  };

  const handleOpenEditAddressDialog = (index: number) => {
    if (employee && employee.addresses) {
      const address = employee.addresses[index];
      editAddressFormik.setValues({
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
      });
      setEditAddressIndex(index);
      setEditAddressDialogOpen(true);
    }
  };

  const handleCloseEditAddressDialog = () => {
    setEditAddressDialogOpen(false);
    setEditAddressIndex(null);
    editAddressFormik.resetForm();
  };

  const handleDeleteAddress = (index: number) => {
    if (employee && employee.addresses) {
      const updatedAddresses = [...employee.addresses];
      updatedAddresses.splice(index, 1);
      setEmployee({ ...employee, addresses: updatedAddresses });
      setSnackbar({
        open: true,
        message: "Address deleted successfully",
        severity: "success",
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !employee) {
    return (
      <Alert severity="error" sx={{ mt: 5 }}>
        {error}
      </Alert>
    );
  }

  if (!employee) return null;

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Paper
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 800,
          boxShadow: 3,
          borderRadius: 3,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="h5" mb={2} color="primary" fontWeight="bold">
          Edit Employee
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            name="employeeId"
            label="Employee ID"
            value={formik.values.employeeId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.employeeId && Boolean(formik.errors.employeeId)
            }
            helperText={formik.touched.employeeId && formik.errors.employeeId}
            margin="normal"
            required
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              "& .MuiInputBase-root": {
                padding: "10px",
              },
            }}
          />
          <TextField
            fullWidth
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            margin="normal"
            required
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              "& .MuiInputBase-root": {
                padding: "10px",
              },
            }}
          />
          <TextField
            fullWidth
            name="organization"
            label="Organization"
            value={formik.values.organization}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.organization && Boolean(formik.errors.organization)
            }
            helperText={
              formik.touched.organization && formik.errors.organization
            }
            margin="normal"
            required
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              "& .MuiInputBase-root": {
                padding: "10px",
              },
            }}
          />
          <TextField
            fullWidth
            name="position"
            label="Position"
            value={formik.values.position}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.position && Boolean(formik.errors.position)}
            helperText={formik.touched.position && formik.errors.position}
            margin="normal"
            required
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              "& .MuiInputBase-root": {
                padding: "10px",
              },
            }}
          />

          <Typography variant="h6" mt={3} color="#1976d2" fontWeight="bold">
            Address Details
          </Typography>

          <Box mt={2} mb={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddressDialog}
              color="primary"
              size="small"
            >
              Add New Address
            </Button>
          </Box>

          {employee.addresses?.length > 0 ? (
            <Box
              mt={2}
              sx={{
                overflowX: "auto",
                border: "1px solid #ddd",
                borderRadius: 2,
                backgroundColor: "#fafafa",
                boxShadow: 1,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>Street</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>City</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>State</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Zip</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employee.addresses.map((address, index) => (
                    <TableRow
                      key={index}
                      sx={{ borderBottom: "1px solid #eee" }}
                    >
                      <TableCell>{address.street}</TableCell>
                      <TableCell>{address.city}</TableCell>
                      <TableCell>{address.state}</TableCell>
                      <TableCell>{address.zip}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleOpenEditAddressDialog(index)}
                          size="small"
                          aria-label="edit"
                          title="Edit address"
                        >
                          <EditIcon sx={{ color: "#1976d2" }} />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteAddress(index)}
                          size="small"
                          aria-label="delete"
                          title="Delete address"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ) : (
            <Typography mt={2}>No addresses available</Typography>
          )}

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              disabled={saving}
              sx={{
                backgroundColor: "#f44336",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#d32f2f",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              disabled={saving || !formik.isValid}
              sx={{
                backgroundColor: "#4caf50",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#388e3c",
                },
              }}
            >
              {saving ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </Box>
        </form>
      </Paper>

      <Dialog
        open={addressDialogOpen}
        onClose={handleCloseAddressDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Address</DialogTitle>
        <form onSubmit={addressFormik.handleSubmit}>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                name="street"
                label="Street"
                value={addressFormik.values.street}
                onChange={addressFormik.handleChange}
                onBlur={addressFormik.handleBlur}
                error={
                  addressFormik.touched.street &&
                  Boolean(addressFormik.errors.street)
                }
                helperText={
                  addressFormik.touched.street && addressFormik.errors.street
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                name="city"
                label="City"
                value={addressFormik.values.city}
                onChange={addressFormik.handleChange}
                onBlur={addressFormik.handleBlur}
                error={
                  addressFormik.touched.city &&
                  Boolean(addressFormik.errors.city)
                }
                helperText={
                  addressFormik.touched.city && addressFormik.errors.city
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                name="state"
                label="State"
                value={addressFormik.values.state}
                onChange={addressFormik.handleChange}
                onBlur={addressFormik.handleBlur}
                error={
                  addressFormik.touched.state &&
                  Boolean(addressFormik.errors.state)
                }
                helperText={
                  addressFormik.touched.state && addressFormik.errors.state
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                name="zip"
                label="Zip Code"
                value={addressFormik.values.zip}
                onChange={addressFormik.handleChange}
                onBlur={addressFormik.handleBlur}
                error={
                  addressFormik.touched.zip && Boolean(addressFormik.errors.zip)
                }
                helperText={
                  addressFormik.touched.zip && addressFormik.errors.zip
                }
                margin="normal"
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddressDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!addressFormik.isValid || !addressFormik.dirty}
            >
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={editAddressDialogOpen}
        onClose={handleCloseEditAddressDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Address</DialogTitle>
        <form onSubmit={editAddressFormik.handleSubmit}>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                name="street"
                label="Street"
                value={editAddressFormik.values.street}
                onChange={editAddressFormik.handleChange}
                onBlur={editAddressFormik.handleBlur}
                error={
                  editAddressFormik.touched.street &&
                  Boolean(editAddressFormik.errors.street)
                }
                helperText={
                  editAddressFormik.touched.street &&
                  editAddressFormik.errors.street
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                name="city"
                label="City"
                value={editAddressFormik.values.city}
                onChange={editAddressFormik.handleChange}
                onBlur={editAddressFormik.handleBlur}
                error={
                  editAddressFormik.touched.city &&
                  Boolean(editAddressFormik.errors.city)
                }
                helperText={
                  editAddressFormik.touched.city &&
                  editAddressFormik.errors.city
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                name="state"
                label="State"
                value={editAddressFormik.values.state}
                onChange={editAddressFormik.handleChange}
                onBlur={editAddressFormik.handleBlur}
                error={
                  editAddressFormik.touched.state &&
                  Boolean(editAddressFormik.errors.state)
                }
                helperText={
                  editAddressFormik.touched.state &&
                  editAddressFormik.errors.state
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                name="zip"
                label="Zip Code"
                value={editAddressFormik.values.zip}
                onChange={editAddressFormik.handleChange}
                onBlur={editAddressFormik.handleBlur}
                error={
                  editAddressFormik.touched.zip &&
                  Boolean(editAddressFormik.errors.zip)
                }
                helperText={
                  editAddressFormik.touched.zip && editAddressFormik.errors.zip
                }
                margin="normal"
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditAddressDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!editAddressFormik.isValid || !editAddressFormik.dirty}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditEmployee;
