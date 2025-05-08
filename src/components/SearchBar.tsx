import React from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  fullWidth = true
}) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <Box>
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        fullWidth={fullWidth}
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClear}
                edge="end"
                size="small"
                aria-label="clear search"
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ) : null
        }}
      />
    </Box>
  );
};

export default SearchBar;
