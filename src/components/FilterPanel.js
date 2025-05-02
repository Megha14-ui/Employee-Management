import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Box, Button, Autocomplete, TextField } from "@mui/material";
import axios from "axios";
const FilterPanel = ({ onFilter, onClear }) => {
    const [org, setOrg] = useState("");
    const [options, setOptions] = useState([]);
    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await axios.get("http://localhost:3000/employees");
                const organizations = [
                    ...new Set(response.data.map((emp) => emp.organization)),
                ];
                setOptions(organizations);
            }
            catch (error) {
                console.error("Failed to fetch organizations", error);
            }
        };
        fetchOrganizations();
    }, []);
    return (_jsxs(Box, { display: "flex", gap: 2, mb: 2, boxShadow: 2, p: 2, borderRadius: 2, children: [_jsx(Autocomplete, { freeSolo: true, disableClearable: true, options: options, inputValue: org, onInputChange: (event, newValue) => setOrg(newValue), renderInput: (params) => (_jsx(TextField, { ...params, label: "Filter by Organization", fullWidth: true, InputProps: {
                        ...params.InputProps,
                        type: "search",
                    } })) }), _jsx(Button, { variant: "contained", onClick: () => onFilter(org), children: "Search" }), _jsx(Button, { variant: "outlined", color: "secondary", onClick: onClear, children: "Clear" })] }));
};
export default FilterPanel;
