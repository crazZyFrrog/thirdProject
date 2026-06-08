import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initYandexMetrika } from './lib/yandexMetrika'
import './index.css'

initYandexMetrika()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
