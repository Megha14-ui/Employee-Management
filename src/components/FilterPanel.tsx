import React, { useEffect, useState } from "react";
import { Box, Button, Autocomplete, TextField } from "@mui/material";
import axios from "axios";

type Props = {
  onFilter: (org: string) => void;
  onClear: () => void;
};

const FilterPanel: React.FC<Props> = ({ onFilter, onClear }) => {
  const [org, setOrg] = useState("");
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get<any[]>(
          "http://localhost:3000/employees"
        );
        const organizations: string[] = [
          ...new Set(response.data.map((emp) => emp.organization)),
        ];
        setOptions(organizations);
      } catch (error) {
        console.error("Failed to fetch organizations", error);
      }
    };
    fetchOrganizations();
  }, []);

  return (
    <Box display="flex" gap={2} mb={2} boxShadow={2} p={2} borderRadius={2}>
      <Autocomplete
        freeSolo
        disableClearable
        options={options}
        inputValue={org}
        onInputChange={(event, newValue) => setOrg(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Filter by Organization"
            fullWidth
            InputProps={{
              ...params.InputProps,
              type: "search",
            }}
          />
        )}
      />
      <Button variant="contained" onClick={() => onFilter(org)}>
        Search
      </Button>
      <Button variant="outlined" color="secondary" onClick={onClear}>
        Clear
      </Button>
    </Box>
  );
};

export default FilterPanel;
