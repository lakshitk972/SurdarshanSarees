import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Render the application - providers moved to App.tsx
createRoot(document.getElementById("root")!).render(<App />);
