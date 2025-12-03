import React from "react";
import ReactDOM from "react-dom";
import TamilRingHub from "./js/TamilRingHub";
import "./css/main.scss";

// Existing Nav Logic
const mobileMenu = document.querySelector("[data-mobile-menu]");
const nav = document.querySelector("[data-nav]");

if (mobileMenu && nav) {
  function toggleMobileMenu() {
    nav.classList.toggle("menu-open");
  }
  mobileMenu.addEventListener("click", toggleMobileMenu);
}

// Mount React App
const rootElement = document.getElementById("tamilring-hub-root");
if (rootElement) {
  ReactDOM.render(<TamilRingHub />, rootElement);
}

// Say hello
// eslint-disable-next-line no-console
console.log("🦊 TamilRing Hub Loaded");
