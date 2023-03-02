import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

import './assets/css/index.css';
import App from './App';
import Projection from './Projection/Projection.jsx'

import './assets/css/App.css';

import reportWebVitals from './reportWebVitals';

import { ManagerProvider } from "./Manager/index.js"

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <App />
    ),
  },
  {
    path: "projection",
    element: <Projection />,
  },
]);

root.render(
  <React.StrictMode>
    <ManagerProvider>
      <RouterProvider router={router} />
    </ManagerProvider>

  </React.StrictMode>
);



// reportWebVitals(console.log);
