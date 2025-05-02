import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, } from "@mui/material";
const ConfirmDialog = ({ open, onClose, onConfirm, title, description, }) => {
    return (_jsxs(Dialog, { open: open, onClose: onClose, children: [_jsx(DialogTitle, { children: title }), _jsx(DialogContent, { children: _jsx(DialogContentText, { children: description }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, color: "inherit", children: "Cancel" }), _jsx(Button, { onClick: onConfirm, color: "error", variant: "contained", children: "Delete" })] })] }));
};
export default ConfirmDialog;
