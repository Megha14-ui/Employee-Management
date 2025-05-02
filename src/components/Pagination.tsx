import React from "react";
import {
  Pagination as MuiPagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

interface PaginationProps {
  count: number;
  rowsPerPage: number;
  page: number;
  onRowsPerPageChange: (event: SelectChangeEvent<number>) => void;
  onPageChange: (event: React.ChangeEvent<unknown>, newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  count,
  rowsPerPage,
  page,
  onRowsPerPageChange,
  onPageChange,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
      }}
    >
      <FormControl>
        <InputLabel>Rows per page</InputLabel>
        <Select
          value={rowsPerPage}
          onChange={onRowsPerPageChange}
          label="Rows per page"
        >
          {[10, 20, 30, 50, 100].map((rows) => (
            <MenuItem key={rows} value={rows}>
              {rows}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <MuiPagination
        count={Math.ceil(count / rowsPerPage)}
        page={page + 1}
        onChange={onPageChange}
        showFirstButton
        showLastButton
      />
    </div>
  );
};

export default Pagination;
