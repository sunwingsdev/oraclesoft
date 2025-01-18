import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Appprovider } from './context/Appcontext.jsx'

createRoot(document.getElementById('root')).render(
  <Appprovider>
    <App />
  </Appprovider>,
)
