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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Employee } from "../context/EmployeeContext";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(
    null
  );

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (employee) {
      setEmployee({ ...employee, [e.target.name]: e.target.value });
    }
  };

  const handleAddressChange = (
    index: number,
    field: keyof Address,
    value: string
  ) => {
    if (employee) {
      const updatedAddresses = [...employee.addresses];
      updatedAddresses[index] = {
        ...updatedAddresses[index],
        [field]: value,
      };
      setEmployee({ ...employee, addresses: updatedAddresses });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`http://localhost:5000/employees/${id}`, employee);
      navigate("/");
    } catch (err) {
      setError("Failed to update employee.");
    } finally {
      setSaving(false);
    }
  };

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
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="employeeId"
            label="Employee ID"
            value={employee.employeeId}
            onChange={handleChange}
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
            value={employee.name}
            onChange={handleChange}
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
            value={employee.organization}
            onChange={handleChange}
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
            value={employee.position}
            onChange={handleChange}
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

          <Typography variant="h6" mt={3} color="secondary" fontWeight="bold">
            Address Details
          </Typography>

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
                      {editingAddressIndex === index ? (
                        <>
                          <TableCell>
                            <TextField
                              fullWidth
                              value={address.street}
                              onChange={(e) =>
                                handleAddressChange(
                                  index,
                                  "street",
                                  e.target.value
                                )
                              }
                              margin="none"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              value={address.city}
                              onChange={(e) =>
                                handleAddressChange(
                                  index,
                                  "city",
                                  e.target.value
                                )
                              }
                              margin="none"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              value={address.state}
                              onChange={(e) =>
                                handleAddressChange(
                                  index,
                                  "state",
                                  e.target.value
                                )
                              }
                              margin="none"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              value={address.zip}
                              onChange={(e) =>
                                handleAddressChange(
                                  index,
                                  "zip",
                                  e.target.value
                                )
                              }
                              margin="none"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => setEditingAddressIndex(null)}
                              size="small"
                              aria-label="save"
                            >
                              <SaveIcon sx={{ color: "#4caf50" }} />
                            </IconButton>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{address.street}</TableCell>
                          <TableCell>{address.city}</TableCell>
                          <TableCell>{address.state}</TableCell>
                          <TableCell>{address.zip}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => setEditingAddressIndex(index)}
                              size="small"
                              aria-label="edit"
                            >
                              <EditIcon sx={{ color: "#1976d2" }} />
                            </IconButton>
                          </TableCell>
                        </>
                      )}
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
              disabled={saving}
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
    </Box>
  );
};

export default EditEmployee;
