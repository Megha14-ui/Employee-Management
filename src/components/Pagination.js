import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Pagination as MuiPagination, FormControl, InputLabel, Select, MenuItem, } from "@mui/material";
const Pagination = ({ count, rowsPerPage, page, onRowsPerPageChange, onPageChange, }) => {
    return (_jsxs("div", { style: {
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
        }, children: [_jsxs(FormControl, { children: [_jsx(InputLabel, { children: "Rows per page" }), _jsx(Select, { value: rowsPerPage, onChange: onRowsPerPageChange, label: "Rows per page", children: [10, 20, 30, 50, 100].map((rows) => (_jsx(MenuItem, { value: rows, children: rows }, rows))) })] }), _jsx(MuiPagination, { count: Math.ceil(count / rowsPerPage), page: page + 1, onChange: onPageChange, showFirstButton: true, showLastButton: true })] }));
};
export default Pagination;
