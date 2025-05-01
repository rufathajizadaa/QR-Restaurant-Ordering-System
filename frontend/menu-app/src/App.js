import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import KitchenPage from './components/KitchenPage';
import CartPage from './components/CartPage'; // Correct path to Navbar.js
import { OrderProvider } from './context/OrderContext';

import './styles/global.css';
import './styles/menu.css';
import './styles/navbar.css';
import './styles/mobile.css';
import './styles/cart.css';


const App = () => {
  return (
    <OrderProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/kitchen" element={<KitchenPage />} />
        </Routes>
      </Router>
    </OrderProvider>
  );
};

export default App;
