import React, { useEffect, useRef, useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { doSignOut } from '../../firbase/auth'
import { useAuth } from '../../store/authContext'

const Header = () => {
    const { userLoggedIn } = useAuth()
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    console.log({location})
    const navbarRef = useRef(null);

    const handleToggle = () => {
        setExpanded(!expanded);
    };

    const handleClickOutside = (event) => {
        if (navbarRef.current && !navbarRef.current.contains(event.target)) {
            setExpanded(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        // <nav className='flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-center bg-gray-200'>
        //     {
        //         userLoggedIn
        //             ?
        //             <>
        //                 <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className='text-sm text-blue-600 underline'>Logout</button>
        //             </>
        //             :
        //             <>
        //                 <Link className='text-sm text-blue-600 underline' to={'/login'}>Login</Link>
        //                 <Link className='text-sm text-blue-600 underline' to={'/register'}>Register New Account</Link>
        //             </>
        //     }

        // </nav>
        <Navbar collapseOnSelect expand="lg" expanded={expanded} className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">Exam</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={handleToggle}/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link className={location?.pathname === '/admin' ? 'nav-item-manual-active' :'nav-item-manual'} onClick={() => navigate('/admin')}>Dashboard</Nav.Link>
                        {/* <Nav.Link className='nav-item-manual' onClick={() => navigate('/exam')}>exam</Nav.Link> */}
                        <Nav.Link className='nav-item-manual' onClick={() => { doSignOut().then(() => { navigate('/login') }) }}>{userLoggedIn ? 'Logout' : 'Login'}</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header