import React, {CSSProperties, useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import axios from "axios";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {FaArrowCircleUp} from "react-icons/fa";
import MoonLoader from "react-spinners/ClipLoader";
import "./home.css"
import ArticleList from "../components/ArticleList"
import {Modal} from "react-bootstrap";
import Form from "react-bootstrap/Form";

let Latex = require('react-latex')

const Profile = observer(() => {
    const {user} = useContext(Context)
    const history = useNavigate()
    const PAGE_SIZE = 5
    const [fetching, setFetching] = useState(false)
    const [currPage, setCurrPage] = useState(0)
    const [lastPageReached, setLastPageReached] = useState(false)
    const [articles, setArticles] = useState([])
    const [favouriteLists, setFavouriteLists] = useState([])
    const [showTopButton, setShowTopButton] = useState(false)
    const [currFolder, setCurrFolder] = useState(0)
    const [showModal, setShowModal] = useState(false)


    const override: CSSProperties = {
        display: "block",
        margin: "0 auto",
    }

    useEffect(() => {
        const getFavouriteLists = async () => {
            return await axios.get("http://localhost:5000/api/favouriteList/getAll", {
                params: {
                    userId: user.user.id,
                }
            })
        }
        getFavouriteLists().then(response => {
            setFavouriteLists(response.data.rows)
            setCurrFolder(response.data.rows[0].id)
        })
    }, [])

    useEffect(() => {
        setArticles([])
        setCurrPage(0)
        setLastPageReached(false)
        if (currFolder !== 0) {
            setFetching(true)
        }
    }, [currFolder])

    useEffect(() => {
        const getArticles = async () => {
            return await axios.get("http://localhost:5000/api/favourite/getAll", {
                params: {
                    userId: user.user.id,
                    favouriteListId: currFolder,
                    page: currPage,
                    limit: PAGE_SIZE
                }
            })
        }
        if (fetching && !lastPageReached) {
            getArticles().then(response => {
                if (response.data.count <= PAGE_SIZE * (currPage + 1)) {
                    setLastPageReached(true)
                }
                setCurrPage(prevState => prevState + 1)
                setArticles(prevState => prevState.concat(response.data.rows))
            }).finally(() => {
                setFetching(false)
            })
        }
    }, [fetching])

    const scrollHandler = (e) => {
        const docElem = e.target.documentElement
        if (docElem.scrollTop > 300) {
            setShowTopButton(true)
        } else {
            setShowTopButton(false)
        }
    }

    window.addEventListener('scroll', scrollHandler);

    const scrollTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }

    return (
        <>
            <Modal centered className="align-self-center" show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Folders list</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {favouriteLists.map(list => {
                            return <ListGroup.Item key={list.id}>
                                <Row className="d-flex">
                                    <Col>
                                        {list.name}
                                    </Col>
                                    <Col className="d-flex justify-content-end">
                                        {list.id === favouriteLists[0].id ? <></> :
                                            <Button
                                            variant="danger"
                                            onClick={async () => {
                                                await axios.delete('http://localhost:5000/api/favouriteList/remove', {
                                                    data: {
                                                        id: list.id
                                                    }
                                                }).then(response => {
                                                    console.log(response.data)
                                                })
                                            }}
                                        >
                                            Delete
                                        </Button>}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        })}
                    </ListGroup>
                </Modal.Body>
            </Modal>
            <Row>
            <Col style={{maxWidth: 300, display: "inline-table", marginRight: 10}}>
                <ListGroup activeKey={currFolder} onSelect={eventKey => setCurrFolder(eventKey)}>
                    <div style={{
                        padding: 20,
                        fontSize: 16,
                        background: '#0d6efd',
                        color: '#fff',
                        borderRight: "1px solid rgba(0, 0, 0, .125)"
                    }}>
                        {user.user.username}'s Profile
                    </div>
                    <div style={{
                        backgroundColor: "#212529",
                        color: '#fff',
                        padding: '15px 20px',
                        borderRight: "1px solid rgba(0, 0, 0, .125)"
                    }}>
                        <Row>
                            <Col className="align-content-center">Folders</Col>
                            <Col className="d-flex justify-content-end">
                                <Button variant="secondary" onClick={() => setShowModal(true)}>
                                    Manage
                                </Button></Col>
                        </Row>
                    </div>
                    {favouriteLists.map(favList => {
                        return (
                            <ListGroup.Item action eventKey={favList.id} key={favList.id}>
                                {favList.name}
                            </ListGroup.Item>
                        )})}
                </ListGroup>
            </Col>
                <Col>
            <Container style={{maxWidth: '800px' }}>
                {<ArticleList activeKey={currFolder} articles={articles}/>}
                {!fetching?
                    <Row style={{marginTop: 20}}>
                        <Col>
                            {!lastPageReached ?
                                <Button variant='light' onClick={() => setFetching(true)}>
                                    Load More
                                </Button> : <></>
                            }
                        </Col>
                        <Col>
                            {showTopButton ?
                                <Button variant="light" size='lg' onClick={scrollTop}>
                                    <FaArrowCircleUp/>
                                </Button> : <></>}
                        </Col>
                    </Row>
                    : <MoonLoader
                        color={"#61dafb"}
                        loading={fetching}
                        size={100}
                        cssOverride={override}
                        aria-label={"Loading"}
                        data-testid={"loader"}>
                    </MoonLoader>
                }
                <div style={{color: "white"}}>I'm not letting the page jump</div>
            </Container>
                </Col>
            </Row>
        </>
    );
});

export default Profile;