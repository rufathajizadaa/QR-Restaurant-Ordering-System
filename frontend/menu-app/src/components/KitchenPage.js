import React, { useState } from 'react';
import '../styles/kitchen.css'; 

const sampleOrders = [
  {
    id: '012',
    time: '25:24',
    table: 5,
    status: 'Pending',
    items: [
      { name: 'Fried chicken', quantity: 6 },
      { name: 'Vanilla cake', quantity: 7 },
      { name: 'Order', quantity: 3 },
      { name: 'Order', quantity: 3 },
      { name: 'Order', quantity: 3 },
    ],
  },
  {
    id: '002',
    time: '10:09',
    table: 2,
    status: 'In Preparation',
    items: [
      { name: 'Chicken pie', quantity: 6 },
      { name: 'Vanilla cake', quantity: 7 },
      { name: 'Matcha Latte', quantity: 3 },
    ],
  },
{
    id: '032',
    time: '13:45',
    table: 4,
    status: 'In Preparation',
    items: [
      { name: 'Chicken pie', quantity: 6 },
      { name: 'Vanilla cake', quantity: 7 },
      { name: 'Matcha Latte', quantity: 3 },
    ],
  },
];

const KitchenPage = () => {
  const [orders, setOrders] = useState(sampleOrders);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('Orders');

  const advanceStatus = (id) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status:
                o.status === 'Pending'
                  ? 'In Preparation'
                  : o.status === 'In Preparation'
                  ? 'Ready'
                  : o.status,
            }
          : o
      )
    );
  };

  const removeOrder = (id) => {
    const completed = orders.find((o) => o.id === id);
    if (completed) {
      setCompletedOrders((prev) => [...prev, { ...completed, completedAt: new Date().toLocaleTimeString() }]);
    }
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const getCardColor = (status) => {
    if (status === 'Pending') return 'pending';
    if (status === 'In Preparation') return 'inprep';
    if (status === 'Ready') return 'ready';
  };

  const renderOrderCard = (order, isHistory = false) => (
    <div key={order.id} className={`order-card ${getCardColor(order.status)}`}>
      <div className="order-header">
        <span className="order-id">{order.id}</span>
        <span className="table-number">Table {order.table}</span>
      </div>
      <ul className="order-items">
        {order.items.map((item, idx) => (
          <li key={idx}>
            {item.name} × {item.quantity}
          </li>
        ))}
      </ul>
      <div className="order-footer">
        {isHistory ? (
          <span className="history-time">Completed at {order.completedAt}</span>
        ) : order.status !== 'Ready' ? (
          <button onClick={() => advanceStatus(order.id)}>
            {order.status === 'Pending' ? 'Start Order' : 'Ready'}
          </button>
        ) : (
          <button className="remove-btn" onClick={() => removeOrder(order.id)}>
            Remove Order
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="kitchen-wrapper">
      <header className="kitchen-tabs">
        {['Orders', 'History',].map((tab) => (
          <span
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </span>
        ))}
      </header>

      {activeTab === 'Orders' && (
        <div className="kitchen-grid">
          {orders.length === 0 ? <p>No orders</p> : orders.map((order) => renderOrderCard(order))}
        </div>
      )}

      {activeTab === 'History' && (
        <div className="kitchen-grid">
          {completedOrders.length === 0 ? (
            <p>No completed orders</p>
          ) : (
            completedOrders.map((order) => renderOrderCard(order, true))
          )}
        </div>
      )}

      {activeTab === 'Settings' && (
        <div style={{ padding: '1rem' }}>
          <p>Settings will go here.</p>
        </div>
      )}
    </div>
  );
};

export default KitchenPage;
