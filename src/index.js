import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";

// Function to adjust the viewport height
function adjustVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Call the function once to set the initial value
adjustVH();

// Add event listener to reset the value on resize or orientation change
window.addEventListener('resize', adjustVH);
window.addEventListener('orientationchange', adjustVH);

const root = createRoot(document.getElementById("root"));
root.render(<App />);
