import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployeeContext } from "../context/EmployeeContext";
import {
  Box,
  Alert,
  Container,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import EmployeeTable from "../components/EmployeeTable";

const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  const { serverStatus, fetchEmployees } = useEmployeeContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [showOrgFilter, setShowOrgFilter] = useState(false);
  const [orgFilterTerm, setOrgFilterTerm] = useState("");

  useEffect(() => {
    fetchEmployees();

    const intervalId = setInterval(() => {
      fetchEmployees();
    }, 60000);
    return () => clearInterval(intervalId);
  }, [fetchEmployees]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleOrgFilterChange = (value: string) => {
    setOrgFilterTerm(value);
  };

  const handleToggleOrgFilter = () => {
    setShowOrgFilter(!showOrgFilter);
    if (showOrgFilter) {
      setOrgFilterTerm("");
    }
  };

  const handleAddClick = () => {
    navigate("/add");
  };

  const handleViewClick = (id: number) => {
    navigate(`/view/${id}`);
  };

  const handleEditClick = (id: number) => {
    navigate(`/edit/${id}`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper
          sx={{
            p: 3,
            mb: 3,
            boxShadow: 2,
            backgroundColor: "#1976d2",
            color: "white",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            <center>Employee Management System</center>
          </Typography>
        </Paper>

        {serverStatus === "offline" && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Server is offline. Data may not be up to date.
          </Alert>
        )}

        <EmployeeTable
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          showOrgFilter={showOrgFilter}
          onToggleOrgFilter={handleToggleOrgFilter}
          orgFilterTerm={orgFilterTerm}
          onOrgFilterChange={handleOrgFilterChange}
          onAddClick={handleAddClick}
          onViewClick={handleViewClick}
          onEditClick={handleEditClick}
        />
      </Box>
    </Container>
  );
};

export default EmployeeList;
