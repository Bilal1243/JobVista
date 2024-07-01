import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';

// Theme
import 'primeicons/primeicons.css'
import './Sidebar.css'

export default function AdminSidebar() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [visibleLeft, setVisibleLeft] = useState(false);
    const handleLogoutClick = async () => {
        // try {
        //   await AdminlogoutApiCall().unwrap()
        //   dispatch(logout())
        //   navigate('/adminLogin')
        // } catch (err) {
        //   console.log(err)
        // }
    }

    return (
        <div className="card">
            <div className="flex gap-2 justify-content-center">
                <Button icon="pi pi-th-large" onClick={() => setVisibleLeft(true)} />
            </div>

            <Sidebar visible={visibleLeft} position="right" onHide={() => setVisibleLeft(false)}>
                <div className="admin-sidebar-content" style={{ flex: true }}>
                    <Link className="sidebarOptions">
                        <h5> Admin panel</h5>
                    </Link>
                </div>
                <div className="admin-sidebar-content">
                    <Link to={'/adminHome'} className="sidebarOptions">
                        <i
                            className="pi pi-home mr-3"
                            style={{ fontSize: '1.2rem', padding: '20px' }}
                        ></i>
                        Dashboard
                    </Link>
                </div>
                <div className="admin-sidebar-content">
                    <Link to={'/admin-recruiter-Requests'} className="sidebarOptions">
                        <i
                            className="pi pi-bell"
                            style={{ fontSize: '1.2rem', padding: '20px' }}
                        ></i>
                        Recruiter Requests
                    </Link>
                </div>
                <div className="admin-sidebar-content">
                    <Link to={'/userList'} className="sidebarOptions">
                        <i
                            className="pi pi-user"
                            style={{ fontSize: '1.2rem', padding: '20px' }}
                        ></i>
                        User Management
                    </Link>
                </div>
                <div className="admin-sidebar-content">
                    <Link to={'/recruiterListData'} className="sidebarOptions">
                        <i
                            className="pi pi-user"
                            style={{ fontSize: '1.2rem', padding: '20px' }}
                        ></i>
                        Recruiter Management
                    </Link>
                </div>
                <div className="admin-sidebar-content">
                    <Link to={'/job-requests'} className="sidebarOptions">
                        <i
                            className="pi pi-calendar
"
                            style={{ fontSize: '1.2rem', padding: '20px' }}
                        ></i>
                        Job Requests
                    </Link>
                </div>
                <div className="admin-sidebar-content">
                    <Link to={'/adminindustryTypes'} className="sidebarOptions">
                        <i
                            className="pi pi-calendar
"
                            style={{ fontSize: '1.2rem', padding: '20px' }}
                        ></i>
                        Industry Management
                    </Link>
                </div>
                <div className="admin-sidebar-content">
                    <Link to={'/skills'} className="sidebarOptions">
                        <i
                            className="pi pi-calendar
"
                            style={{ fontSize: '1.2rem', padding: '20px' }}
                        ></i>
                        Skills Management
                    </Link>
                </div>

                {/* Add the "Logout" link here */}
                <div className="admin-sidebar-content">
                    <Link
                        className="sidebarOptions"
                        onClick={handleLogoutClick} // Call the function when the link is clicked
                    >
                        <i
                            className="pi pi-sign-out mr-3"
                            style={{ fontSize: '1.2rem', padding: '20px' }}
                        ></i>
                        Logout
                    </Link>
                </div>
            </Sidebar>
        </div>
    )
}