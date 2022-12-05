import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { CryptoLottery } from './app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CryptoLottery />
  </React.StrictMode>
);

