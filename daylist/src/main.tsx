import React from "react";
import { createRoot } from "react-dom/client";
import { TodoApp } from "./components/todo/TodoApp";
const root = document.getElementById("root");
if (root) createRoot(root).render(<TodoApp />);
