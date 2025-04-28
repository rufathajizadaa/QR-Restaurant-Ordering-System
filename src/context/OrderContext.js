import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState([]);

  // Add item to order
  const addToOrder = (item, quantity) => {
    setOrder((prevOrder) => {
      const itemIndex = prevOrder.findIndex((orderItem) => orderItem.id === item.id);
      if (itemIndex !== -1) {
        const newOrder = [...prevOrder];
        newOrder[itemIndex].quantity += quantity;
        return newOrder;
      }
      return [...prevOrder, { ...item, quantity }];
    });
  };

  // Remove item from order
  const removeFromOrder = (id) => {
    setOrder((prevOrder) => prevOrder.filter((item) => item.id !== id));
  };

  return (
    <OrderContext.Provider value={{ order, addToOrder, removeFromOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
