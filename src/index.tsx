import React from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider } from 'react-router-dom';
import { inputGlobalStyles } from './theme';
import { router } from './router';

ReactDOM.render(
  <React.StrictMode>
    {inputGlobalStyles}
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById('root'),
);
