import './orders.css'

function Orders() {
    return (
        <div>
            <div className="container">
                <div className="header">
                    <h1>Orders</h1>
                    <div className="search-container">
                        <i className="fa fa-search" />
                        <input placeholder="Search orders..." type="text" />
                    </div>
                </div>
                <div className="stats-container">
                    <div className="stat-card dark">
                        <div className="stat-title">Total Orders</div>
                        <div className="stat-value">
                            12,543
                            <i className="fa fa-shopping-cart" />
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-title">This Month</div>
                        <div className="stat-value">
                            1,248
                            <i className="fa fa-calendar-alt" />
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-title">Today</div>
                        <div className="stat-value">
                            87
                            <i className="fa fa-clock" />
                        </div>
                    </div>
                </div>
                <div className="status-cards">
                    <div className="status-card">
                        <div className="status-card-header">
                            <div className="status-icon">
                                <i className="fa fa-clock text-primary" />
                            </div>
                            <div className="status-title">Pending</div>
                        </div>
                        <div className="status-count">156</div>
                    </div>
                    <div className="status-card">
                        <div className="status-card-header">
                            <div className="status-icon">
                                <i className="fa fa-box text-primary" />
                            </div>
                            <div className="status-title">Shipped</div>
                        </div>
                        <div className="status-count">243</div>
                    </div>
                    <div className="status-card">
                        <div className="status-card-header">
                            <div className="status-icon">
                                <i className="fa fa-truck text-primary" />
                            </div>
                            <div className="status-title">Out for Delivery</div>
                        </div>
                        <div className="status-count">87</div>
                    </div>
                    <div className="status-card">
                        <div className="status-card-header">
                            <div className="status-icon">
                                <i className="fa fa-check-circle text-primary" />
                            </div>
                            <div className="status-title">Delivered</div>
                        </div>
                        <div className="status-count">762</div>
                    </div>
                    <div className="status-card">
                        <div className="status-card-header">
                            <div className="status-icon">
                                <i className="fa fa-exchange-alt text-primary" />
                            </div>
                            <div className="status-title">Refund Requests</div>
                        </div>
                        <div className="status-count">23</div>
                    </div>
                </div>
                <div className="section-header">
                    <h2>Recent Orders</h2>
                    <a className="view-all" href="#">
                        View All <i className="fa fa-chevron-right" />
                    </a>
                </div>
                <div className="filters">
                    <div className="filter active">
                        <i className="fa fa-list" />
                        All Orders
                    </div>
                    <div className="filter">
                        <i className="fa fa-clock" />
                        Pending
                    </div>
                    <div className="filter">
                        <i className="fa fa-box" />
                        Shipped
                    </div>
                    <div className="filter">
                        <i className="fa fa-truck" />
                        Out for Delivery
                    </div>
                    <div className="filter">
                        <i className="fa fa-check-circle" />
                        Delivered
                    </div>
                    <div className="filter">
                        <i className="fa fa-exchange-alt" />
                        Refund Requests
                    </div>
                </div>
                <div className="orders-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="order-id">#ORD-12345</td>
                                <td>
                                    <div className="customer-info">
                                        <div className="customer-avatar">AH</div>
                                        <div>Allinata Homaku</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="date-info">
                                        <div className="text-primary">Apr 6, 2025</div>
                                        <div className="text-secondary">04:23 PM</div>
                                    </div>
                                </td>
                                <td>3 items</td>
                                <td className="price">$89.00</td>
                                <td>Credit Card</td>
                                <td>
                                    <span className="status pending">Pending</span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn">
                                            <i className="fa fa-eye" />
                                        </button>
                                        <button className="action-btn">
                                            <i className="fa fa-edit" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="order-id">#ORD-12344</td>
                                <td>
                                    <div className="customer-info">
                                        <div className="customer-avatar">MT</div>
                                        <div>Makulam Tarsun</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="date-info">
                                        <div className="text-primary">Apr 6, 2025</div>
                                        <div className="text-secondary">02:17 PM</div>
                                    </div>
                                </td>
                                <td>2 items</td>
                                <td className="price">$123.00</td>
                                <td>PayPal</td>
                                <td>
                                    <span className="status shipped">Shipped</span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn">
                                            <i className="fa fa-eye" />
                                        </button>
                                        <button className="action-btn">
                                            <i className="fa fa-edit" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="order-id">#ORD-12343</td>
                                <td>
                                    <div className="customer-info">
                                        <div className="customer-avatar">DI</div>
                                        <div>Demanda Inhan</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="date-info">
                                        <div className="text-primary">Apr 6, 2025</div>
                                        <div className="text-secondary">01:45 PM</div>
                                    </div>
                                </td>
                                <td>1 item</td>
                                <td className="price">$34.00</td>
                                <td>Credit Card</td>
                                <td>
                                    <span className="status out-for-delivery">Out for Delivery</span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn">
                                            <i className="fa fa-eye" />
                                        </button>
                                        <button className="action-btn">
                                            <i className="fa fa-edit" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="order-id">#ORD-12342</td>
                                <td>
                                    <div className="customer-info">
                                        <div className="customer-avatar">HN</div>
                                        <div>Hasunta Nambes</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="date-info">
                                        <div className="text-primary">Apr 6, 2025</div>
                                        <div className="text-secondary">12:34 PM</div>
                                    </div>
                                </td>
                                <td>4 items</td>
                                <td className="price">$72.00</td>
                                <td>PayPal</td>
                                <td>
                                    <span className="status delivered">Delivered</span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn">
                                            <i className="fa fa-eye" />
                                        </button>
                                        <button className="action-btn">
                                            <i className="fa fa-edit" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="order-id">#ORD-12341</td>
                                <td>
                                    <div className="customer-info">
                                        <div className="customer-avatar">GK</div>
                                        <div>Geogia Kamuta</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="date-info">
                                        <div className="text-primary">Apr 6, 2025</div>
                                        <div className="text-secondary">11:21 AM</div>
                                    </div>
                                </td>
                                <td>1 item</td>
                                <td className="price">$31.00</td>
                                <td>Credit Card</td>
                                <td>
                                    <span className="status refund">Refund Requested</span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn">
                                            <i className="fa fa-eye" />
                                        </button>
                                        <button className="action-btn">
                                            <i className="fa fa-edit" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="order-id">#ORD-12340</td>
                                <td>
                                    <div className="customer-info">
                                        <div className="customer-avatar">JD</div>
                                        <div>John Doe</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="date-info">
                                        <div className="text-primary">Apr 5, 2025</div>
                                        <div className="text-secondary">09:15 PM</div>
                                    </div>
                                </td>
                                <td>2 items</td>
                                <td className="price">$47.50</td>
                                <td>PayPal</td>
                                <td>
                                    <span className="status delivered">Delivered</span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn">
                                            <i className="fa fa-eye" />
                                        </button>
                                        <button className="action-btn">
                                            <i className="fa fa-edit" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="pagination">
                    <button className="page-btn">
                        <i className="fa fa-chevron-left" />
                    </button>
                    <button className="page-btn active">1</button>
                    <button className="page-btn">2</button>
                    <button className="page-btn">3</button>
                    <button className="page-btn">4</button>
                    <button className="page-btn">5</button>
                    <button className="page-btn">
                        <i className="fa fa-chevron-right" />
                    </button>
                </div>
            </div>
        </div>

    )
}

export default Orders