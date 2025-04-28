import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import CartPage from './components/CartPage'; // Correct path to Navbar.js
import './styles/App.css'; 
import { OrderProvider } from './context/OrderContext';

const App = () => {
  return (
    <OrderProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Router>
    </OrderProvider>
  );
};

export default App;
