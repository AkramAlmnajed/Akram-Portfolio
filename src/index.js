import React from 'react';
import ReactDOM from 'react-dom/client';
import "slick-carousel/slick/slick.css"; 
import './index.css';
import App from './App';
import CurtainIntro from './components/curtain-intro/CurtainIntro';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CurtainIntro />
    <App />
  </React.StrictMode>
);

