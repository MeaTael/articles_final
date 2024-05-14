import React, {useContext} from 'react';
import {Nav, Navbar, Container, Button} from 'react-bootstrap'
import {HOME_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE} from "../utils/consts";
import {Context} from "../index";
import {useNavigate} from 'react-router-dom'
import {observer} from "mobx-react-lite";

const NavBar = observer(() => {
    const {user} = useContext(Context)
    const history = useNavigate()

    const LogOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        localStorage.clear()
        history(HOME_ROUTE)
    }

    return (
        <Navbar bg="dark" expand="lg" variant="dark">
            <Container>
                <Navbar.Brand href={HOME_ROUTE}>Machine Learning Articles</Navbar.Brand>
                {user.isAuth ?
                    <Nav className={'ml-auto'}>
                        <Button variant={"outline-light"} className="m-lg-2" onClick={() => history(PROFILE_ROUTE)}>Profile</Button>
                        <Button variant={"outline-light"} className="m-lg-2" onClick={() => LogOut()}>Log Out</Button>
                    </Nav>
                    :
                    <Nav className={'ml-auto'}>
                        <Button variant={"outline-light"} onClick={() => history(LOGIN_ROUTE)}>Log In</Button>
                    </Nav>

                }
            </Container>
        </Navbar>
    );
});
export default NavBar;