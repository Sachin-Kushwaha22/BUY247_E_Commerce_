import { useState, useEffect } from 'react';
import axios from 'axios'
import './style.css'
import Dashboard from './utils/Dashboard';
import Customers from './utils/Customers';
import Orders from './utils/Orders';
import EditProfilePic from './utils/EditProfilePic'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useNavigate } from 'react-router-dom';
const serverUrl = import.meta.env.VITE_SERVER_URL

function AdminDashboard({ admin }) {
    const navigate = useNavigate()
    const [ popup, setPopup ] = useState(false)
    const [ menu, setMenu ] = useState(sessionStorage.getItem('menu') || 1)

    const handleEditPopup =() => {
        setPopup(true)
    }

    const handleAdminLogout = async(e) =>{
        e.preventDefault()
        
        try {
            const response = await axios.get(`${serverUrl}/api/auth/adminLogout`,{
                withCredentials: true
            })
            if(response.status === 200){
                window.alert( ' Admin Logout ')
                navigate('/admin/signin')
            }
        } catch (error) {
            console.log('error from handleadminLogout', error);
        }
    }
    return (
        <div className="admin-container">
            <div className="sidebar-shadow"></div>
            <div className="sidebar" >
            
            
                <div className="logo" >
                <img className='logo' src="/assets/logo.png" alt="logo"  />
                </div>
                <div className="user-profile">
                    <div className='user-avatar'>
                        {/* <img onClick={handleEditPopup} src={adminPic || '/assets/default-profile.png'} alt="" /> */}
                        <EditProfilePic />
                    </div>
                    <div className="user-name">{admin.fname + " " + admin.lname}</div>
                    <div className="user-email">{admin.emailOrPhone}</div>
                </div>
                <nav className="nav-menu">
                    <a className={`nav-item ${menu === 1 ? 'active': ''}`} onClick={() => {
                        sessionStorage.setItem('menu', 1)
                        setMenu(1)
                    }}>
                        <i className="fas fa-th-large" /> Dashboard
                    </a>
                    {/* <a className="nav-item" href="#">
                        <i className="fas fa-chart-bar" /> Statistics
                    </a> */}
                    <a className={`nav-item ${menu === 2 ? 'active': ''}`} onClick={() => {
                        sessionStorage.setItem('menu', 2)
                        setMenu(2)
                    }}>
                        <i className="fas fa-users" /> Customers
                    </a>
                    <a className={`nav-item ${menu === 3 ? 'active': ''}`} onClick={() => {
                        sessionStorage.setItem('menu', 3)
                        setMenu(3)
                    }} >
                        <i className="fa-solid fa-cart-shopping" /> Orders
                    </a>
                    <a className={`nav-item ${menu === 4 ? 'active': ''}`} onClick={() => {
                        sessionStorage.setItem('menu', 4)
                        setMenu(4)
                    }}>
                        <i className="fa-solid fa-shirt" /> Products
                    </a>
                    <a className={`nav-item ${menu === 5 ? 'active': ''}`} onClick={() => {
                        sessionStorage.setItem('menu', 5)
                        setMenu(5)
                    }}>
                        <i className="fas fa-chart-line" /> Performance
                    </a>
                    {/* <a className={`nav-item ${menu === 6 ? 'active': ''}`} onClick={() => {
                        sessionStorage.setItem('menu', 6)
                        setMenu(6)
                    }}>
                        <i className="fas fa-history" /> History
                    </a> */}
                <a className="nav-item" onClick={handleAdminLogout}>
                    <i className="fas fa-sign-out-alt" /> Log out
                </a>
                </nav>
            </div>
            <div className="main-content">
                { menu === 1 && <Dashboard />}
                { menu === 2 && <Customers />}
                { menu === 3 && <Orders />}
            </div>
        </div>

    )
}

export default AdminDashboard