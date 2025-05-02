import { jsx as _jsx } from "react/jsx-runtime";
// main.tsx (standard React 18+ setup)
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
