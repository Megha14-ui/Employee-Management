import React from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Pagination as MuiPagination,
  SelectChangeEvent,
  FormControl,
  InputLabel
} from '@mui/material';

interface PaginationProps {
  page: number;
  rowsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  disabled?: boolean;
}

const CustomPagination: React.FC<PaginationProps> = ({
  page,
  rowsPerPage,
  totalItems,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25],
  disabled = false
}) => {
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    onRowsPerPageChange(Number(event.target.value));
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startItem = totalItems === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const endItem = Math.min(page * rowsPerPage, totalItems);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
      <Box display="flex" alignItems="center">
        <FormControl variant="standard" size="small" sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
          <Select
            labelId="rows-per-page-label"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            disabled={disabled}
          >
            {rowsPerPageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary">
          {totalItems > 0 
            ? `${startItem}-${endItem} of ${totalItems}`
            : 'No items'}
        </Typography>
      </Box>
      
      <MuiPagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        disabled={disabled || totalItems === 0}
        showFirstButton
        showLastButton
      />
    </Box>
  );
};

export default CustomPagination;
