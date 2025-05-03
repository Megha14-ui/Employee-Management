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
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useEmployeeContext } from "../context/EmployeeContext";

const addressValidationSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(3, "State is required"),
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

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

const AddEmployee = () => {
  const navigate = useNavigate();
  const { addEmployee, loading: contextLoading } = useEmployeeContext();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [addressForm, setAddressForm] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [addressError, setAddressError] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      employeeId: "",
      name: "",
      organization: "",
      position: "",
    },
    validate: (values) => {
      const result = validationSchema.safeParse(values);
      if (result.success) {
        return {};
      } else {
        return result.error.formErrors.fieldErrors;
      }
    },
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
          addresses: addresses,
        };

        // await addEmployee(employeeData);

        setSnackbar({
          open: true,
          message: "Employee added successfully! Redirecting...",
          severity: "success",
        });

        formik.resetForm();
        setAddresses([]);
        setTimeout(() => navigate("/employee-list"), 1500);
      } catch (error: any) {
        console.error("Submission error:", error);
        setSnackbar({
          open: true,
          message: error.message || "Failed to add employee. Please try again.",
          severity: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = () => {
    try {
      addressValidationSchema.parse(addressForm); // Zod validation
      setAddresses((prev) => [...prev, { ...addressForm }]);
      setAddressForm({ street: "", city: "", state: "", zip: "" });
      setSnackbar({
        open: true,
        message: "Address added successfully",
        severity: "success",
      });
      setShowAddressForm(false);
      setAddressError("");
    } catch (error: any) {
      setAddressError(error.errors.map((e: any) => e.message).join(", "));
    }
  };

  const handleRemoveAddress = (index: number) => {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ p: 4, width: "100%", maxWidth: 1500 }}>
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
            <Grid
              container
              spacing={2}
              sx={{
                mt: 2,
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card
                sx={{
                  mb: 3,
                  boxShadow: 3,
                  width: "100%",
                  maxWidth: 500,
                  mt: 5,
                  height: "auto",
                  padding: 2,
                }}
              >
                <CardContent>
                  <Grid container spacing={3} sx={{ mt: 2 }}>
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
                      sx={{ mb: 3 }}
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      fullWidth
                      name="name"
                      label="Name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                      sx={{ mb: 3 }}
                    />
                  </Grid>
                  <Grid>
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
                        formik.touched.organization &&
                        formik.errors.organization
                      }
                      sx={{ mb: 3 }}
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      fullWidth
                      name="position"
                      label="Position"
                      value={formik.values.position}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.position &&
                        Boolean(formik.errors.position)
                      }
                      helperText={
                        formik.touched.position && formik.errors.position
                      }
                    />
                  </Grid>
                </CardContent>
              </Card>
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
                    <TableCell
                      sx={{ backgroundColor: "#f0f8ff", fontWeight: "bold" }}
                    >
                      #
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: "#f0f8ff", fontWeight: "bold" }}
                    >
                      Street
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: "#f0f8ff", fontWeight: "bold" }}
                    >
                      City
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: "#f0f8ff", fontWeight: "bold" }}
                    >
                      State
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: "#f0f8ff", fontWeight: "bold" }}
                    >
                      ZIP
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: "#f0f8ff", fontWeight: "bold" }}
                    >
                      Action
                    </TableCell>
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

      <Backdrop
        open={contextLoading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog open={showAddressForm} onClose={() => setShowAddressForm(false)}>
        <DialogTitle>Add Address</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            name="street"
            label="Street"
            value={addressForm.street}
            onChange={handleAddressInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            name="city"
            label="City"
            value={addressForm.city}
            onChange={handleAddressInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            name="state"
            label="State"
            value={addressForm.state}
            onChange={handleAddressInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            name="zip"
            label="ZIP"
            value={addressForm.zip}
            onChange={handleAddressInputChange}
            sx={{ mb: 2 }}
          />
          {addressError && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {addressError}
            </Typography>
          )}
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
