import React, {useContext, useEffect, useState} from 'react';
import {useParams, useNavigate, Link, NavLink} from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import formatDate from '../context/formatDate';
import axios, {formToJSON} from "axios";
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Stack from 'react-bootstrap/Stack';
import Form from "react-bootstrap/Form";
import Latex from 'react-latex'
import 'katex/dist/katex.min.css';
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {HOME_ROUTE, LOGIN_ROUTE} from "../utils/consts";
import {ButtonGroup, DropdownButton, Dropdown, Modal} from "react-bootstrap";

const Article = observer(() => {
  const { id: articleId} = useParams();
  const {user} = useContext(Context)
  const history = useNavigate()
  const [article, setArticle] = useState({});
  const [show, setShow] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [isFavourite, setIsFavourite] = useState(false)
  const [favouriteLists, setFavouriteLists] = useState([])
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [folderName, setFolderName] = useState("")


  const handleClose = () => {
    setShow(false)
    setSearchInput("")
  };
  const handleShow = () => setShow(true);

  const handleShowSimilar = () => setShowSimilar(prevState => !prevState)

  const renderTooltipArticle = (props) => (
    <Tooltip id="article-tooltip" {...props}>
      Article rating is the sum of citations and references
    </Tooltip>
  );

  const renderTooltipAuthor = (props) => (
    <Tooltip id="author-tooltip" {...props}>
      Author rating is the average of H-indices of all authors
    </Tooltip>
  );

  useEffect(() => {
    const getData = async () => {
      const params = {
        id: articleId
      }
      if (user.isAuth) {
        params.userId = user.user.id
      }
      return await axios.get(`http://localhost:5000/api/article/getById`, {
        params
      })
    }

    const getFavouriteLists = async () => {
      return await axios.get("http://localhost:5000/api/favouriteList/getAll", {
        params: {
          userId: user.user.id,
        }
      })
    }

    try {
      getData().then(response => {
        console.log(response.data)
        setArticle(response.data);
        setComments(response.data.comments)
        setIsFavourite(response.data.favourites?.length)
      });
      if (user.isAuth) {
        getFavouriteLists().then(response => {
          console.log(response.data.rows)
          setFavouriteLists(response.data.rows)
        })
      }
    } catch (err) {
      console.log("Error", err.message)
    }
  }, [articleId]);

  const pdf_link = (links) => {
    links = links.split(", ")
    for (let i in links) {
      if (links[i].includes("pdf")) {
        return links[i]
      }
    }
    return links
  }

  const not_pdf_links = (links) => {
    let links1 = links.split(", ")
    return links1.filter(a => a !== pdf_link(links))
  }
  
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value)
  }

  const handleComment = (e) => {
    e.preventDefault();
    setCommentText(e.target.value)
  }

  const postComment = async () => {
    const data = {
      text: commentText,
      userId: user.user.id,
      articleId
    }
    await axios.post("http://localhost:5000/api/comment/create", data).then((response) => {
      data.id = response.data.id
      data.datetime = response.data.datetime
      data.user = {
        id: response.data.userId,
        username: user.user.username
      }
      setComments(prevState => prevState.concat(data))
    })
  }

  const removeComment = async (id) => {
    await axios.delete("http://localhost:5000/api/comment/remove", {
      data: {
        id
      }
    }).then(() => {
      setComments(prevState => prevState.filter(comment => {
        return comment.id !== id
      }))
    })
  }

  const toggleFavourites = async () => {
    if (isFavourite) {
      console.log(article)
      await axios.delete('http://localhost:5000/api/favourite/remove', {
        data: {
          listId: article.favourites[0].favourite_list.id,
          articleId
        }
      }).then(response => {
        console.log(response.data)
      })
    } else {
      await axios.post("http://localhost:5000/api/favourite/create", {
        userId: user.user.id,
        articleId
      })
    }
    setIsFavourite(!isFavourite)
  }

  const addToFavourites = async (listId) => {
    if (listId) await axios.post("http://localhost:5000/api/favourite/create", {
      listId,
      articleId
    }).then(response => {
      console.log(article)
      setArticle(prevState => {
        prevState.favourites = []
        prevState.favourites.push({favourite_list: {id: listId}})
        return prevState
      })
      setIsFavourite(true)
    })
  }

  const removeFromFavourites = async () => {
    console.log(article)
    await axios.delete('http://localhost:5000/api/favourite/remove', {
      data: {
        listId: article.favourites[0].favourite_list.id,
        articleId
      }
    }).then(response => {
      setIsFavourite(false)
      console.log(response.data)
    })
  }

  return (
      <>
        <Modal centered className="align-self-center" show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control placeholder={"Enter folder name"}
                          value={folderName}
                          onChange={e => setFolderName(e.target.value)}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={async () => {
              await axios.post("http://localhost:5000/api/favouriteList/create", {
                userId: user.user.id,
                name: folderName
              }).then(response => {
                setFavouriteLists(prevState => prevState.concat(response.data))
                setShowModal(false)
              })
            }}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
        <Container className="my-4 text-justified" style={{ maxWidth: '800px' }}>
          <h1><a href={article.links && pdf_link(article.links)}><Latex>{article.title}</Latex></a></h1>
          <div className="text-secondary mb-1">{article.conference_id ? "Presented on " + article.conference_id : ""}</div>
          <div className="text-secondary mb-1">{article.published && formatDate(article.published)}</div>
          <Row>
            <Col md="auto">
              <OverlayTrigger
                placement='right'
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltipArticle}
              >
                <div className="text-secondary mb-4">{"Article rating - " + article.articleRating}</div>
              </OverlayTrigger>
            </Col>
            <Col/>
            <Col md="auto">
              <OverlayTrigger
                placement='left'
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltipAuthor}
              >
                <div className="text-secondary mb-4" style={{display: "flex", alignItems: "end"}}>{"Author rating - " + article.authorRating}</div>
              </OverlayTrigger>
            </Col>
          </Row>
          <div className='text-secondary mb-2' style={{display: "flex", alignItems: "center", margin: 5}}><Latex>{article.summary && article.summary}</Latex></div>
          <div className="text-secondary mb-5">- {article.authors}</div>
          <Row>
            <Col>
              <Button className="align-self-end" variant="outline-dark" onClick={handleShow} style={{alignItems: "center"}}>
                Citations
              </Button>
            </Col>
            <Col className="d-flex justify-content-end">
              <Button variant="outline-dark" onClick={handleShowSimilar}>Similar articles</Button>
            </Col>
            <Offcanvas show={show} onHide={handleClose} placement='bottom' scroll="true">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Articles that have cited this document</Offcanvas.Title>
              </Offcanvas.Header>
              <Form.Control type="text"
                                  placeholder='Search by title'
                                  onChange={handleSearch}
                                  value={searchInput}/>
              <ListGroup style={{overflowY: 'scroll'}}>
                {article.citations?.filter(citation => {
                        return citation?.title.toLowerCase().match(searchInput.toLowerCase())
                    }).map(citation => {
                      return (
                        <ListGroup.Item key={citation.paperId}>
                          <div>
                            {<Link to={`/article/${citation.paperId}/${citation.title}`} style={{ textDecoration: 'none' }}>{citation.title}</Link>}
                          </div>
                        </ListGroup.Item>
                      )
                })}
              </ListGroup>
            </Offcanvas>
            <Offcanvas show={showSimilar} onHide={handleShowSimilar} placement='bottom' scroll="true">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Similar articles</Offcanvas.Title>
              </Offcanvas.Header>
              <ListGroup style={{overflowY: 'scroll'}}>
                {article.similarArticles?.map(article => {
                  return (
                      <ListGroup.Item key={article.id}>
                        <div>
                          {<Link to={`/article/${article.id}`} style={{ textDecoration: 'none' }}>{article.title}</Link>}
                        </div>
                      </ListGroup.Item>
                  )
                })}
              </ListGroup>
            </Offcanvas>
          </Row>
          <Row style={{marginTop: "10px"}}>
            <Stack direction="horizontal" gap={4}>
              <div className='text-secondary mb-5'>{article.links && (not_pdf_links(article.links) ? "Other Links" : "")}</div>
              <div className='text-secondary mb-5'>{article.links &&
                not_pdf_links(article.links).map((link) => {
                  return <a key={link} href={link}>{link}</a>
                })}
              </div>
            </Stack>
          </Row>
          <Row>
            <Col>
              <Button variant="outline-dark" onClick={() => history(HOME_ROUTE)} style={{ display: "flex", alignItems: "center", marginTop: 25 }}>Back to Home</Button>
            </Col>
            {user.isAuth ? <Col className="d-flex justify-content-end">
              {isFavourite ?
                    <Button className="align-self-end" variant="outline-danger" onClick={() => removeFromFavourites()}>Remove from favourites</Button>
                  :
                  <DropdownButton className="align-self-end"
                                  key="favourites"
                                  as={ButtonGroup}
                                  variant="outline-primary"
                                  title="To favourites"
                                  onSelect={addToFavourites}>
                    {favouriteLists.map(list => {
                      return (
                          <Dropdown.Item eventKey={list.id} key={list.id}>{list.name}</Dropdown.Item>
                      )
                    })}
                    <Dropdown.Divider/>
                    <Dropdown.Item key={0} onClick={() => {
                      setShowModal(true)
                      console.log(showModal)
                    }}>+ Add folder</Dropdown.Item>
                  </DropdownButton>}
            </Col>
            :
            <></>
            }
          </Row>
          <Row>
            <div>Comments</div>
            {user.isAuth ?
              <InputGroup>
                <Form.Control
                    placeholder="Leave your comment"
                    aria-describedby="basic-addon2"
                    value={commentText}
                    onChange={e => handleComment(e)}
                />
                <Button
                    variant="outline-primary"
                    id="button-addon2"
                    onClick={() => postComment()}>
                  →
                </Button>
              </InputGroup>
                :
              <div style={{"marginLeft": "auto", "marginRight": "auto"}}>
                <NavLink to={LOGIN_ROUTE}>Log in</NavLink> to leave comments
              </div>
            }
            <ListGroup variant="flush" as={"ol"}>
              {comments?.map(comment => {
                return (
                    <ListGroup.Item key={comment.id}>
                      <div className="fw-light d-flex">
                        <Link to={`/profile/${comment.user.username}`}
                              style={{ textDecoration: 'none' }}>
                          {comment.user.username}
                        </Link>
                        &nbsp;-&nbsp;
                        <div className="text-secondary">{new Date(comment.datetime).toLocaleDateString('en-us', {
                          weekday: "short",
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}</div>
                        {user.user.id === comment.user.id ?
                            <Button className="align-self-end" size="sm" variant={"outline-danger"} onClick={() => removeComment(comment.id)}>
                              delete
                            </Button>
                            :
                            <></>}
                      </div>
                      <div>
                        {comment.text}
                      </div>
                    </ListGroup.Item>
                )
              })}
            </ListGroup>
          </Row>
        </Container>
      </>
  );
});

export default Article;
