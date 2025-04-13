import { useState } from 'react'
import './profile.css'

function UserDashboard({user}) {
    const [ userPic, setUserPic ] = useState()
    return (
        <div className="user-dashboard">
            <div className="u-container">
                <div className="u-sidebar">
                    <div className="u-user-greeting">
                        <div className="u-avatar">
                            <img alt="User avatar" src={'/assets/default-profile.png'} />
                        </div>
                        <div className='user-name'>
                            <div>Hello,</div>
                            <div
                                style={{
                                    fontWeight: "500",
                                }}>
                                Alex
                            </div>
                        </div>
                    </div>
                    <div className="u-menu-item">
                        <i>📦</i>
                        <span>MY ORDERS</span>
                        <span
                            style={{
                                marginLeft: "auto",
                            }}>
                            ›
                        </span>
                    </div>
                    <div className="u-menu-item">
                        <i>👤</i>
                        <span>ACCOUNT SETTINGS</span>
                        <span
                            style={{
                                marginLeft: "auto",
                            }}>
                            ›
                        </span>
                    </div>
                    <div className="u-menu-item active">
                        <i>📝</i>
                        <span>Profile Information</span>
                    </div>
                    <div className="u-menu-item">
                        <i>📍</i>
                        <span>Manage Addresses</span>
                    </div>
                    <div className="u-menu-item">
                        <i>🆔</i>
                        <span>ID Verification</span>
                    </div>
                    <div className="u-menu-item">
                        <i>💳</i>
                        <span>PAYMENTS</span>
                        <span
                            style={{
                                marginLeft: "auto",
                            }}>
                            ›
                        </span>
                    </div>
                    <div className="u-menu-item">
                        <i>🎁</i>
                        <span>Gift Cards</span>
                        <span
                            className="price"
                            style={{
                                marginLeft: "auto",
                            }}>
                            ₹0
                        </span>
                    </div>
                    <div className="u-menu-item">
                        <i>📱</i>
                        <span>Saved UPI</span>
                    </div>
                    <div className="u-menu-item">
                        <i>💰</i>
                        <span>Saved Cards</span>
                    </div>
                </div>
                <div className="u-main-content">
                    <div className="u-section-header">
                        <h2>Personal Information</h2>
                        <a className="u-edit-link">Edit</a>
                    </div>
                    <div className="u-form-row">
                        <div className="u-form-group">
                            <input defaultValue="Alex" readOnly type="text" />
                        </div>
                        <div className="u-form-group">
                            <input placeholder="Last Name" readOnly type="text" />
                        </div>
                    </div>
                    <div className="u-form-group">
                        <label>Your Gender</label>
                        <div className="u-radio-group">
                            <div className="u-radio-option">
                                <input defaultChecked id="male" name="gender" type="radio" />
                                <label htmlFor="male">Male</label>
                            </div>
                            <div className="u-radio-option">
                                <input id="female" name="gender" type="radio" />
                                <label htmlFor="female">Female</label>
                            </div>
                        </div>
                    </div>
                    <div className="u-section-header">
                        <h2>Email Address</h2>
                        <a className="u-edit-link">Edit</a>
                    </div>
                    <div className="u-form-group">
                        <input defaultValue="alex.smith@example.com" readOnly type="email" />
                    </div>
                    <div className="u-section-header">
                        <h2>Mobile Number</h2>
                        <a className="u-edit-link">Edit</a>
                    </div>
                    <div className="u-form-group">
                        <input defaultValue="+1234567890" readOnly type="tel" />
                    </div>
                </div>
            </div>;

        </div>
    )
}

export default UserDashboard