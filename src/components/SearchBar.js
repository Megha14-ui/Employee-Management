import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, TextField, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
const SearchBar = ({ searchTerm, onSearch, onFilterToggle, onAdd, onDeleteSelected, }) => {
    return (_jsxs(Box, { display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: 2, p: 2, borderRadius: 2, mb: 2, children: [_jsx(TextField, { label: "Search by any field", variant: "outlined", fullWidth: true, value: searchTerm, onChange: (e) => onSearch(e.target.value) }), _jsxs(Box, { ml: 2, children: [_jsx(IconButton, { color: "primary", onClick: onFilterToggle, children: _jsx(FilterListIcon, {}) }), _jsx(IconButton, { color: "primary", onClick: onAdd, children: _jsx(AddIcon, {}) }), _jsx(IconButton, { color: "error", onClick: onDeleteSelected, children: _jsx(DeleteIcon, {}) })] })] }));
};
export default SearchBar;
