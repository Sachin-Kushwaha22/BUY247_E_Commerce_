import './dashboard.css'
import TimeDayStatisticsChart from './Graph'

function Dashboard() {
    return (
        <div className="dashboard">
            <div className="header">
                <h1 className="page-title">Dashboard</h1>
                <div className="search-bar">
                    <i className="fas fa-search" />
                    <input placeholder="Search..." type="text" />
                </div>
            </div>
            <div className="dashboard-content">

                <div className='dashboard-left-column'>
                    <div className="metrics-container">
                        <div className="metric-card dark">
                            <div className="metric-info">
                                <h3>Total Revenue</h3>
                                <div className="value">$11,354.00</div>
                                <div className="percentage up">+6.32%</div>
                            </div>
                            <div className="metric-icon">
                                <i className="fas fa-dollar-sign" />
                            </div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-info">
                                <h3>Total Customer</h3>
                                <div className="value">45,439</div>
                                <div className="percentage up">+12.56%</div>
                            </div>
                            <div className="metric-icon">
                                <i className="fas fa-users" />
                            </div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-info">
                                <h3>Total Profit</h3>
                                <div className="value">$8,354.00</div>
                                <div className="percentage up">+3.12%</div>
                            </div>
                            <div className="metric-icon">
                                <i className="fas fa-chart-line" />
                            </div>
                        </div>
                    </div>
                    <div className="chart-section">
                        <TimeDayStatisticsChart />
                    </div>
                    <div className="dashboard-grid">
                        <div className="table-section">
                            <div className="section-header">
                                <h2 className="section-title">latest order</h2>
                                <a className="view-all" href="#">
                                    View All <i className="fas fa-chevron-right" />
                                </a>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>ID</th>
                                        <th>Date</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>01</td>
                                        <td>#12345</td>
                                        <td>Nov 20th, 22</td>
                                        <td>$50.00</td>
                                        <td>
                                            <span className="status-badge">New order</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>02</td>
                                        <td>#32456</td>
                                        <td>Nov 19th, 22</td>
                                        <td>$60.00</td>
                                        <td>
                                            <span className="status-badge">On Delivery</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>03</td>
                                        <td>#43567</td>
                                        <td>Nov 19th, 22</td>
                                        <td>$45.00</td>
                                        <td>
                                            <span className="status-badge">Available</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>


                <div className='dashboard-right-column'>
                    {/* <div className="map-section">
                        <div className="section-header">
                            <h2 className="section-title">Customer by Location</h2>
                            <i className="fas fa-ellipsis-h" />
                        </div>
                        <div className="world-map">
                            <div className="map-tooltip">
                                Sweden
                                <br />
                                Customer Loyalty
                            </div>
                        </div>
                        <div className="map-legend">
                            <input
                                className="range-slider"
                                defaultValue="120"
                                max="200"
                                min="0"
                                type="range"
                            />
                            <div className="range-values">
                                <span>0</span>
                                <span>50</span>
                                <span>100</span>
                                <span>150</span>
                                <span>200</span>
                            </div>
                        </div>
                    </div> */}
                    <div className="recent-sales">
                        <div className="section-header">
                            <h2 className="section-title">Recent Sales</h2>
                            <a className="view-all" onClick={() => {
                                
                            }}>
                                View All <i className="fas fa-chevron-right" />
                            </a>
                        </div>
                        <div className="sales-item">
                            <div className="sales-info">
                                <div className="customer-avatar">
                                    <img alt="Customer" src="/api/placeholder/40/40" />
                                </div>
                                <div className="customer-details">
                                    <h4>Allinata Homaku</h4>
                                    <p>02 Minutes Ago</p>
                                </div>
                            </div>
                            <div className="sales-amount">+$89.00</div>
                        </div>
                        <div className="sales-item">
                            <div className="sales-info">
                                <div className="customer-avatar">
                                    <img alt="Customer" src="/api/placeholder/40/40" />
                                </div>
                                <div className="customer-details">
                                    <h4>Makulam Tarsun</h4>
                                    <p>02 Minutes Ago</p>
                                </div>
                            </div>
                            <div className="sales-amount">+$123.00</div>
                        </div>
                        <div className="sales-item">
                            <div className="sales-info">
                                <div className="customer-avatar">
                                    <img alt="Customer" src="/api/placeholder/40/40" />
                                </div>
                                <div className="customer-details">
                                    <h4>Demanda Inhan</h4>
                                    <p>03 Minutes Ago</p>
                                </div>
                            </div>
                            <div className="sales-amount">+$34.00</div>
                        </div>
                        <div className="sales-item">
                            <div className="sales-info">
                                <div className="customer-avatar">
                                    <img alt="Customer" src="/api/placeholder/40/40" />
                                </div>
                                <div className="customer-details">
                                    <h4>Hasunta Nambes</h4>
                                    <p>04 Minutes Ago</p>
                                </div>
                            </div>
                            <div className="sales-amount">+$72.00</div>
                        </div>
                        <div className="sales-item">
                            <div className="sales-info">
                                <div className="customer-avatar">
                                    <img alt="Customer" src="/api/placeholder/40/40" />
                                </div>
                                <div className="customer-details">
                                    <h4>Geogia Kamuta</h4>
                                    <p>05 Minutes Ago</p>
                                </div>
                            </div>
                            <div className="sales-amount">+$31.00</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard