import './customer.css'

function Customers() {
    return (
        <div className="container">
            <div className="header">
                <h1>Customers</h1>
                <div className="search-container">
                    <i className="fa fa-search" />
                    <input placeholder="Search customers..." type="text" />
                </div>
            </div>
            <div className="stats-container">
                <div className="stat-card dark">
                    <div className="stat-title">Total Customers</div>
                    <div className="stat-value">
                        45,439
                        <i className="fa fa-users" />
                    </div>
                    <div className="stat-change positive">+12.56% from last month</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">New Customers</div>
                    <div className="stat-value">
                        1,243
                        <i className="fa fa-user-plus" />
                    </div>
                    <div className="stat-change positive">+5.28% from last month</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Highest Spending Customer</div>
                    <div className="stat-value">
                        31,872
                        <i className="fa fa-user-check" />
                    </div>
                    {/* <div className="stat-change positive">+2.11% from last month</div> */}
                </div>
                <div className="stat-card">
                    <div className="metric-header">
                        <div>
                            <div className="metric-title">Average Order Value</div>
                            <div className="metric-value">$84.32</div>
                            <div className="metric-change positive">+3.2% from last month</div>
                        </div>
                        <div className="metric-icon">
                            <i className="fa fa-shopping-cart" />
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="metric-header">
                        <div>
                            <div className="metric-title">Customer Lifetime Value</div>
                            <div className="metric-value">$562.48</div>
                            <div className="metric-change positive">+2.7% from last month</div>
                        </div>
                        <div className="metric-icon">
                            <i className="fa fa-chart-line" />
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="metric-header">
                        <div>
                            <div className="metric-title"></div>
                            <div className="metric-value">2.8</div>
                            <div className="metric-change positive">+0.2 from last month</div>
                        </div>
                        <div className="metric-icon">
                            <i className="fa fa-calendar-check" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="section-header">
                <h2>Customer List</h2>
                <a className="view-all" href="#">
                    View All <i className="fa fa-chevron-right" />
                </a>
            </div>
            <div className="filters">
                <div className="filter active">
                    <i className="fa fa-users" />
                    All Customers
                </div>
                <div className="filter">
                    <i className="fa fa-user-check" />
                    Active
                </div>
                <div className="filter">
                    <i className="fa fa-user-clock" />
                    Pending
                </div>
                <div className="filter">
                    <i className="fa fa-user-slash" />
                    Inactive
                </div>
                <div className="filter">
                    <i className="fa fa-filter" />
                    More Filters
                </div>
            </div>
            <div className="customers-table">
                <table>
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Location</th>
                            <th>Joined</th>
                            <th>Orders</th>
                            <th>Spent</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="customer-info">
                                    <div className="customer-avatar">AH</div>
                                    <div className="customer-details">
                                        <div className="customer-name">Allinata Homaku</div>
                                        <div className="customer-email">allinata@example.com</div>
                                    </div>
                                </div>
                            </td>
                            <td>New York, USA</td>
                            <td>Jan 15, 2023</td>
                            <td>24</td>
                            <td>$1,245.00</td>
                            <td>
                                <span className="status active">Active</span>
                            </td>
                            <td>
                                <div className="action-buttons">
                                    <button className="action-btn edit">
                                        <i className="fa fa-edit" />
                                    </button>
                                    <button className="action-btn delete">
                                        <i className="fa fa-trash" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="customer-info">
                                    <div className="customer-avatar">MT</div>
                                    <div className="customer-details">
                                        <div className="customer-name">Makulam Tarsun</div>
                                        <div className="customer-email">makulam@example.com</div>
                                    </div>
                                </div>
                            </td>
                            <td>London, UK</td>
                            <td>Feb 3, 2023</td>
                            <td>17</td>
                            <td>$876.50</td>
                            <td>
                                <span className="status active">Active</span>
                            </td>
                            <td>
                                <div className="action-buttons">
                                    <button className="action-btn edit">
                                        <i className="fa fa-edit" />
                                    </button>
                                    <button className="action-btn delete">
                                        <i className="fa fa-trash" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="customer-info">
                                    <div className="customer-avatar">DI</div>
                                    <div className="customer-details">
                                        <div className="customer-name">Demanda Inhan</div>
                                        <div className="customer-email">demanda@example.com</div>
                                    </div>
                                </div>
                            </td>
                            <td>Sydney, AUS</td>
                            <td>Mar 22, 2023</td>
                            <td>9</td>
                            <td>$432.80</td>
                            <td>
                                <span className="status active">Active</span>
                            </td>
                            <td>
                                <div className="action-buttons">
                                    <button className="action-btn edit">
                                        <i className="fa fa-edit" />
                                    </button>
                                    <button className="action-btn delete">
                                        <i className="fa fa-trash" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="customer-info">
                                    <div className="customer-avatar">HN</div>
                                    <div className="customer-details">
                                        <div className="customer-name">Hasunta Nambes</div>
                                        <div className="customer-email">hasunta@example.com</div>
                                    </div>
                                </div>
                            </td>
                            <td>Toronto, CA</td>
                            <td>Apr 5, 2023</td>
                            <td>12</td>
                            <td>$789.30</td>
                            <td>
                                <span className="status pending">Pending</span>
                            </td>
                            <td>
                                <div className="action-buttons">
                                    <button className="action-btn edit">
                                        <i className="fa fa-edit" />
                                    </button>
                                    <button className="action-btn delete">
                                        <i className="fa fa-trash" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="customer-info">
                                    <div className="customer-avatar">GK</div>
                                    <div className="customer-details">
                                        <div className="customer-name">Geogia Kamuta</div>
                                        <div className="customer-email">geogia@example.com</div>
                                    </div>
                                </div>
                            </td>
                            <td>Berlin, DE</td>
                            <td>May 17, 2023</td>
                            <td>6</td>
                            <td>$321.45</td>
                            <td>
                                <span className="status inactive">Inactive</span>
                            </td>
                            <td>
                                <div className="action-buttons">
                                    <button className="action-btn edit">
                                        <i className="fa fa-edit" />
                                    </button>
                                    <button className="action-btn delete">
                                        <i className="fa fa-trash" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="customer-info">
                                    <div className="customer-avatar">JD</div>
                                    <div className="customer-details">
                                        <div className="customer-name">John Doe</div>
                                        <div className="customer-email">john@example.com</div>
                                    </div>
                                </div>
                            </td>
                            <td>Paris, FR</td>
                            <td>Jun 8, 2023</td>
                            <td>3</td>
                            <td>$152.75</td>
                            <td>
                                <span className="status active">Active</span>
                            </td>
                            <td>
                                <div className="action-buttons">
                                    <button className="action-btn edit">
                                        <i className="fa fa-edit" />
                                    </button>
                                    <button className="action-btn delete">
                                        <i className="fa fa-trash" />
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

    )
}

export default Customers