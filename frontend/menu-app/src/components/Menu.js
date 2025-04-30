import React, { useState, useEffect } from 'react';
import { useOrder } from '../context/OrderContext';
import { Link } from 'react-router-dom';
// import '../styles/App.css';

const Menu = () => {
  const { addToOrder, order } = useOrder(); // Assuming the order context has 'order' as a state that holds cart items
  const [itemQuantities, setItemQuantities] = useState({});
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Fetch the menu items from the JSON file
    fetch('/menuItems.json')
      .then((response) => response.json())
      .then((data) => setMenuItems(data))
      .catch((error) => console.error('Error fetching menu items:', error));
  }, []);

  const categories = [...new Set(menuItems.map(item => item.category))];

  const handleQuantityChange = (e, itemId) => {
    const newQuantity = Math.max(1, parseInt(e.target.value));
    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: newQuantity,
    }));
  };

  // Check if there are items in the cart
  const isCartNotEmpty = order.length > 0;

  // Calculate total cart value
  const cartTotal = order.reduce((total, item) => total + item.price * (itemQuantities[item.id] || 1), 0).toFixed(2);

  return (
    <div className="menu-page">
      {/* Navbar for categories */}
      <h1>Restaurant</h1>
      <nav className="category-navbar">
        {categories.map((category) => (
          <a key={category} href={`#${category}`} className="nav-link">
            {category}
          </a>
        ))}
      </nav>

      {/* Menu items */}
      <h2>Menu</h2>
      {categories.map((category) => (
        <div key={category} id={category} className="category-section">
          <h3>{category}</h3>
          {menuItems
            .filter((item) => item.category === category)
            .map((item) => (
              <div key={item.id} className="menu-item">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <p>${item.price}</p>
                <div className="quantity_add">
                  <label>
                    <input
                      type="number"
                      className="quantity"
                      // placeholder='1'  
                      value={itemQuantities[item.id]}
                      onChange={(e) => handleQuantityChange(e, item.id)}
                      min="0"
                    />
                  </label>
                  <button className="button_add_to_cart" onClick={() => addToOrder(item, itemQuantities[item.id] || 1)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
        </div>
      ))}

      {/* fixed "Go to Cart" button */}
      {isCartNotEmpty && (
        <Link to="/cart" className="cart-button">
          <span>Go to Cart</span>
          <span className="cart-total">${cartTotal}</span>
        </Link>
      )}
    </div>
  );
};

export default Menu;
