import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';  // Make sure the path is correct based on your file structure
  // Import Link from react-router-dom

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Menu</Link>  {/* Link to the menu page */}
        </li>
        <li>
          <Link to="/cart">Cart</Link>  {/* Link to the cart page */}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
