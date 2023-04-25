import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import Amplify from "aws-amplify";

Amplify.configure({
  API: {
    endpoints: [
      {
        name: "api",
        endpoint: import.meta.env.VITE_APP_API_URL,
        region: import.meta.env.VITE_APP_REGION,
      },
    ],
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
