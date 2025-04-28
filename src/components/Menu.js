import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { Link } from 'react-router-dom';
import '../styles/App.css';

const Menu = () => {
  const { addToOrder } = useOrder();
  const [itemQuantities, setItemQuantities] = useState({});

  const menuItems = [
    { id: 1, category: 'Appetizers', name: 'Cheese Nachos', description: 'Crispy nachos with cheese', price: 7.99 },
    { id: 2, category: 'Appetizers', name: 'Spring Rolls', description: 'Vegetable spring rolls', price: 5.99 },
    
    { id: 3, category: 'Main Courses', name: 'Grilled Chicken', description: 'Tender grilled chicken with sides', price: 14.99 },
    { id: 4, category: 'Main Courses', name: 'Beef Steak', description: 'Juicy beef steak with mashed potatoes', price: 19.99 },
    
    { id: 5, category: 'Drinks', name: 'Coke', description: 'Refreshing Coca-Cola', price: 1.99 },
    { id: 6, category: 'Drinks', name: 'Lemonade', description: 'Freshly squeezed lemonade', price: 2.49 },
  
    { id: 7, category: 'Desserts', name: 'Chocolate Cake', description: 'Rich chocolate layered cake', price: 6.49 },
    { id: 8, category: 'Desserts', name: 'Ice Cream Sundae', description: 'Vanilla ice cream with toppings', price: 4.99 },
  
    { id: 9, category: 'Salads', name: 'Caesar Salad', description: 'Classic Caesar with croutons', price: 8.99 },
    { id: 10, category: 'Salads', name: 'Greek Salad', description: 'Fresh salad with feta cheese', price: 7.49 },
  
    { id: 11, category: 'Soups', name: 'Tomato Soup', description: 'Creamy tomato basil soup', price: 5.49 },
    { id: 12, category: 'Soups', name: 'Chicken Noodle Soup', description: 'Classic comfort soup', price: 6.49 },
  
    { id: 13, category: 'Seafood', name: 'Grilled Salmon', description: 'Salmon filet with lemon butter', price: 18.99 },
    { id: 14, category: 'Seafood', name: 'Shrimp Tacos', description: 'Spicy shrimp with avocado', price: 12.99 },
  
    { id: 15, category: 'Pasta', name: 'Spaghetti Bolognese', description: 'Spaghetti with rich meat sauce', price: 13.49 },
    { id: 16, category: 'Pasta', name: 'Penne Alfredo', description: 'Creamy Alfredo sauce pasta', price: 12.49 },
  
    { id: 17, category: 'Breakfast', name: 'Pancakes', description: 'Fluffy pancakes with syrup', price: 9.49 },
    { id: 18, category: 'Breakfast', name: 'Omelette', description: 'Three-egg omelette with cheese', price: 8.99 },
  
    { id: 19, category: 'Sandwiches', name: 'Club Sandwich', description: 'Turkey, bacon, lettuce, and tomato', price: 10.99 },
    { id: 20, category: 'Sandwiches', name: 'Grilled Cheese', description: 'Melted cheese sandwich', price: 6.99 },
  ];
  

  const categories = [...new Set(menuItems.map(item => item.category))];

  const handleQuantityChange = (e, itemId) => {
    const newQuantity = Math.max(1, parseInt(e.target.value));
    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: newQuantity,
    }));
  };

  return (
    <div className="menu-page">
      {/* Navbar for categories */}
      <nav className="category-navbar">
        {categories.map((category) => (
          <a key={category} href={`#${category}`} className="nav-link">
            {category}
          </a>
        ))}
        <Link to="/cart" className="cart-button">
          Go to Cart
        </Link>
      </nav>

      {/* Menu items */}
      <h1>Menu</h1>
      {categories.map((category) => (
        <div key={category} id={category} className="category-section">
          <h2>{category}</h2>
          {menuItems
            .filter((item) => item.category === category)
            .map((item) => (
              <div key={item.id} className="menu-item">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>${item.price}</p>
                <label>
                  Quantity:
                  <input
                    type="number"
                    value={itemQuantities[item.id] || 1}
                    onChange={(e) => handleQuantityChange(e, item.id)}
                    min="1"
                  />
                </label>
                <button onClick={() => addToOrder(item, itemQuantities[item.id] || 1)}>
                  Add to Cart
                </button>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
