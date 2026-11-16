
import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import "./styles/global.css";

registerSW({
  immediate: true,
  onOfflineReady() {
    console.log("Website siap digunakan offline");
  },
  onNeedRefresh() {
    console.log("Versi baru tersedia");
  }
});

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
