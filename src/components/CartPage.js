import React from 'react';
import { useOrder } from '../context/OrderContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { order, removeFromOrder } = useOrder();

  // Calculate the total cost
  const totalCost = order.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {order.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <ul>
            {order.map((item) => (
              <li key={item.id}>
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price}</p>
                <button onClick={() => removeFromOrder(item.id)}>Remove from Cart</button>
              </li>
            ))}
          </ul>
          <h3>Total: ${totalCost.toFixed(2)}</h3>
        </div>
      )}
      <Link to="/">
        <button>Back to Menu</button>
      </Link>
    </div>
  );
};

export default CartPage;
