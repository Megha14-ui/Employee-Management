import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Divider,
  Paper
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

interface FilterPanelProps {
  orgFilterTerm: string;
  onOrgFilterChange: (value: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  orgFilterTerm,
  onOrgFilterChange
}) => {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Filters
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Box>
        <Typography variant="body2" gutterBottom>
          Organization
        </Typography>
        <TextField
          fullWidth
          placeholder="Filter by organization..."
          value={orgFilterTerm}
          onChange={(e) => onOrgFilterChange(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: orgFilterTerm && (
              <InputAdornment position="end">
                <IconButton 
                  onClick={() => onOrgFilterChange("")}
                  edge="end"
                  size="small"
                >
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Paper>
  );
};

export default FilterPanel;
