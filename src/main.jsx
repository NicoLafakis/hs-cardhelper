/**
 * @fileoverview Application entry point
 * @module main
 * @description Initializes React app with root providers and mounts to DOM
 * @license MIT
 * @author CardHelper Team
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
