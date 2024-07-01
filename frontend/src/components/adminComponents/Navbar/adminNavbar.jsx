import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom'

import './adminNavbar.css'
import logo from '../../../assets/JobVista.png'
import AdminSidebar from '../sidebar/Sidebar';

export default function adminNavbar() {

    const navigate = useNavigate()

    const items = [
        {
            label: (
                <Button
                    label="logout"
                    icon="pi pi-fw pi-sign-out"
                    onClick={() => navigate('/adminLogin')}
                    style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        border: 'none',
                        backgroundColor: 'transparent',
                        height: '1px',
                    }}
                />
            )
        },
        {
            label: (
                <Button
                    label="logout"
                    icon="pi pi-fw pi-sign-out"
                    onClick={() => navigate('/adminLogin')}
                    style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        border: 'none',
                        backgroundColor: 'transparent',
                        height: '1px',
                    }}
                />
            )
        },
        {
            label: (
                <Button
                    label="logout"
                    icon="pi pi-fw pi-sign-out"
                    onClick={() => navigate('/adminLogin')}
                    style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        border: 'none',
                        backgroundColor: 'transparent',
                        height: '1px',
                    }}
                />
            )
        }
    ]

    const start = <img alt="logo" src={logo} height="50" className="mr-2"></img>
    const end = <AdminSidebar></AdminSidebar>
        // <Button
        //     label="logout"
        //     icon="pi pi-fw pi-sign-out"
        //     onClick={() => navigate('/adminLogin')}
        //     style={{
        //         textDecoration: 'none',
        //         color: 'inherit',
        //         border: 'none',
        //         backgroundColor: 'transparent',
        //         height: '1px',
        //     }}
        // />


    return (
        <div className="navbar-container">
            <Menubar start={start} end={end} className='adminNavbar'/>
        </div>
    )
}
