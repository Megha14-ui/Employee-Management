import React from "react";
import { Box, TextField, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  searchTerm: string;
  onSearch: (term: string) => void;
  onFilterToggle: () => void;
  onAdd: () => void;
  onDeleteSelected: () => void;
};

const SearchBar: React.FC<Props> = ({
  searchTerm,
  onSearch,
  onFilterToggle,
  onAdd,
  onDeleteSelected,
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      boxShadow={2}
      p={2}
      borderRadius={2}
      mb={2}
    >
      <TextField
        label="Search by any field"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
      />
      <Box ml={2}>
        <IconButton color="primary" onClick={onFilterToggle}>
          <FilterListIcon />
        </IconButton>
        <IconButton color="primary" onClick={onAdd}>
          <AddIcon />
        </IconButton>
        <IconButton color="error" onClick={onDeleteSelected}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SearchBar;
