import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  TextField,
  IconButton,
  Backdrop,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
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
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || "Failed to add employee.",
          severity: "error",
        });
      } finally {
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
    } catch (error) {
      setAddressError(error.errors.map((e) => e.message).join(", "));
    }
  };

  const handleRemoveAddress = (index) => {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ p: 4 }}>
      <form onSubmit={formik.handleSubmit}>
        <Card sx={{ mb: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                backgroundColor: "grey",
                p: 1,
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              Basic Details
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="employeeId"
                  label="Employee ID"
                  value={formik.values.employeeId}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.employeeId &&
                    Boolean(formik.errors.employeeId)
                  }
                  helperText={
                    formik.touched.employeeId && formik.errors.employeeId
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="name"
                  label="Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="organization"
                  label="Organization"
                  value={formik.values.organization}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.organization &&
                    Boolean(formik.errors.organization)
                  }
                  helperText={
                    formik.touched.organization && formik.errors.organization
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="position"
                  label="Position"
                  value={formik.values.position}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.position && Boolean(formik.errors.position)
                  }
                  helperText={formik.touched.position && formik.errors.position}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, boxShadow: 3 }}>
          <CardContent sx={{ backgroundColor: "#f4f4f4" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ backgroundColor: "grey", padding: "8px" }}
            >
              <Typography variant="h6" sx={{ p: 1, borderRadius: 1 }}>
                Addresses
              </Typography>
              <Button
                startIcon={<Add sx={{ color: "white" }} />}
                onClick={() => setShowAddressForm(true)}
                disabled={showAddressForm}
                variant="outlined"
              >
                Add Address
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            {addresses.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Street</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>State</TableCell>
                    <TableCell>ZIP</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {addresses.map((addr, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{addr.street}</TableCell>
                      <TableCell>{addr.city}</TableCell>
                      <TableCell>{addr.state}</TableCell>
                      <TableCell>{addr.zip}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveAddress(index)}
                        >
                          <Clear />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No addresses added yet.
              </Typography>
            )}
          </CardContent>
        </Card>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Submit"
            )}
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/employee-list")}
          >
            Cancel
          </Button>
        </Box>
      </form>

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

      <Backdrop open={contextLoading} sx={{ color: "#fff", zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Address Modal */}
      <Dialog open={showAddressForm} onClose={() => setShowAddressForm(false)}>
        <DialogTitle>Add Address</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="street"
                label="Street"
                value={addressForm.street}
                onChange={handleAddressInputChange}
                error={!!addressError}
                helperText={addressError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="city"
                label="City"
                value={addressForm.city}
                onChange={handleAddressInputChange}
                error={!!addressError}
                helperText={addressError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="state"
                label="State"
                value={addressForm.state}
                onChange={handleAddressInputChange}
                error={!!addressError}
                helperText={addressError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="zip"
                label="ZIP Code"
                value={addressForm.zip}
                onChange={handleAddressInputChange}
                error={!!addressError}
                helperText={addressError}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddressForm(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddAddress} color="primary">
            Add Address
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddEmployee;
