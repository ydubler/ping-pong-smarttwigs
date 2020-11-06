// React & ReactDOM
import React from "react";
import ReactDOM from "react-dom";

// The BrowserRouter is required to allow URL routing with the Route Object (imported next)
// The Route object allows us to load the appropriate React-Object based on the supplied URL.
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";

// Detect the device being used
import { isBrowser, isMobile } from "react-device-detect";

// React Components
import App from "./App/App";

//document.body.style.fontFamily = "Helvetica Neue";
//document.body.style.margin = 0;

// Hydrate the DOM, choosing what to render based on the provided Route Path (like "/portfolio")
ReactDOM.hydrate(
  <>
    <BrowserRouter>
      <Route exact path="/">
        <App />
      </Route>
    </BrowserRouter>
  </>,
  document.getElementById("mountnode")
);
