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
import Detail from './Detail';


import './assets/css/App.css';

import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <App />
    ),
  },
  {
    path: "/:id",
    element: (
        <Detail />
    ),
  }
]);

root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);



// reportWebVitals(console.log);
