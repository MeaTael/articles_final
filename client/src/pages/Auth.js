import React, {useContext, useState} from 'react';
import {Button, Card, Container, Form} from "react-bootstrap";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {HOME_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE} from "../utils/consts";
import {logIn, registration} from "../http/userApi";
import {observer} from "mobx-react-lite";
import {Context} from "../index";

const Auth = observer(() => {
    const {user} = useContext(Context)
    const location = useLocation()
    const history = useNavigate()
    const isLogin = location.pathname === LOGIN_ROUTE
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')

    const signIn = async () => {
        try {
            let data
            if (isLogin) {
                data = await logIn(login, password)
            } else {
                data = await registration(login, password)
            }
            user.setUser(data)
            user.setIsAuth(true)
            history(HOME_ROUTE)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center"
        style={{height: window.innerHeight - 54}}>
            <Card style={{width: 600}} className="p-5">
                <h2 className="m-auto">{isLogin ? "Log In" : "Registration"}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        placeholder="Enter login"
                        value={login}
                        onChange={e => setLogin(e.target.value)}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Enter password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                    {isLogin ? <></> :
                        <Form.Control
                        className="mt-3"
                        placeholder="Confirm password"
                        value={confirm}
                        onChange={e => setConfirm()}
                        type="password"
                        />}
                    <Button
                        className="mt-3 align-self-center mb-4"
                        variant="outline-success"
                        onClick={signIn}
                    >
                        {isLogin ? "Log in" : "Register"}
                    </Button>
                    {isLogin ?
                        <div style={{"marginLeft": "auto", "marginRight": "auto"}}>
                            Not registered? <NavLink to={REGISTRATION_ROUTE}>Register!</NavLink>
                        </div>
                        :
                        <div style={{"marginLeft": "auto", "marginRight": "auto"}}>
                            Already registered? <NavLink to={LOGIN_ROUTE}>Log in!</NavLink>
                        </div>
                    }

                </Form>
            </Card>
        </Container>
    );
})

export default Auth;