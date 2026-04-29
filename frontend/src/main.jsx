import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import App1 from './App1.jsx'
import App from './App'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
