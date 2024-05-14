import React, { useEffect, useState, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import formatDate from '../context/formatDate';
import { components } from "react-select";
import { confs } from "../confs.js";
import { default as ReactSelect } from "react-select";
import Button from 'react-bootstrap/esm/Button';
import Stack from 'react-bootstrap/Stack';
import MoonLoader from "react-spinners/ClipLoader";
import {FaArrowCircleUp} from 'react-icons/fa';
import {FiAlertCircle} from "react-icons/fi";
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import ArticleList from "../components/ArticleList";
import "./home.css"

let Latex = require('react-latex')

const Home = () => {
    const [articles, setArticles] = useState([])
    const [sortBy, setSortBy] = useState("articleRating")
    const [year, setYear] = useState((new Date()).getFullYear())
    const [yearState, setYearState] = useState((new Date()).getFullYear())
    const [order, setOrder] = useState(true)
    const [selectedConfs, setSelectedConfs] = useState([])
    const [searchInput, setSearchInput] = useState("")
    const [centralityFilter, setCentralityFilter] = useState(0)
    const [authorFilter, setAuthorFilter] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)
    const [sortLoader, setSortLoader] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [lastPageReached, setLastPageReached] = useState(false)
    const [showTopButton, setShowTopButton] = useState(false)
    const PAGE_SIZE = 10

    const override: CSSProperties = {
        display: "block",
        margin: "0 auto",
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (!fetching) {
                setLastPageReached(false)
                setSortLoader(true)
                axios.get("http://localhost:5000/api/article/getAll", {
                    params: {
                        order: order ? "DESC" : "ASC",
                        sort_by: sortBy,
                        page: 0,
                        limit: PAGE_SIZE,
                        search: searchInput,
                        min_article_rating: centralityFilter,
                        min_author_rating: authorFilter,
                        year: year,
                        conference: getConfsArray(selectedConfs)
                    }
                }).then(response => {
                    if (response.data.rows.length < PAGE_SIZE) {
                        setLastPageReached(true)
                    }
                    setArticles(response.data.rows)
                    setCurrentPage(1)
                    setSortLoader(false)
                })
            }
        }, 500)

        return () => clearTimeout(delayDebounceFn)

    }, [sortBy, searchInput, order, year, authorFilter, centralityFilter, selectedConfs])

    useEffect(() => {
        if (fetching && !lastPageReached) {
            setSortLoader(true)
            axios.get("http://localhost:5000/api/article/getAll", {
                params: {
                    order: order ? "DESC" : "ASC",
                    sort_by: sortBy,
                    page: currentPage,
                    limit: PAGE_SIZE,
                    search: searchInput,
                    min_article_rating: centralityFilter,
                    min_author_rating: authorFilter,
                    year: year
                }
            }).then(response => {
                if (response.data.rows.length < PAGE_SIZE) {
                    setLastPageReached(true)
                }
                setCurrentPage(prevState => prevState + 1)
                setArticles(prevState => prevState.concat(response.data.rows))
                console.log(response.data.rows)
            }).finally(() => {
                setFetching(false)
                setSortLoader(false)
            })
        }
    }, [fetching])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (yearState !== "Custom year") {
                setYear(yearState)
            }
        }, 500)

        return () => clearTimeout(delayDebounceFn)

    }, [yearState])

    const scrollHandler = (e) => {
        const docElem = e.target.documentElement
        if (docElem.scrollTop > 300) {
            setShowTopButton(true)
        } else {
            setShowTopButton(false)
        }
    }

    const prettify_sort_option = () => {
        if (sortBy === "published") return "publication date"
        if (sortBy === "articleRating") return "article rating"
        if (sortBy === "authorRating") return "author rating"
    }

    const handleOrderClick = () => {
        setOrder(!order, articles)
    }

    const handleChange = (selected) => {
        setSelectedConfs(selected);
    }

    const handleCentralityChange = (e) => {
        if (e === '') {
            e = 0;
        }
        setCentralityFilter(e)
    }

    const handleAuthorChange = (e) => {
        if (e === '') {
            e = 0;
        }
        setAuthorFilter(e)
    }

    const handleYearChange = (e) => {
        if (e === '') {
            return
        }
        setYear(e)
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value)
    }

    const getConfsArray = (confsDict) => {
        return confsDict.map((conf) => {
            return conf.value;
        })
    }

    const scrollTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }

    window.addEventListener('scroll', scrollHandler);

    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    <input
                        type="checkbox"
                        checked={props.isSelected}
                        onChange={() => null}
                    />{" "}
                    <label>{props.label}</label>
                </components.Option>
            </div>
        );
    };

    const sortByHandler = () => {
      if (sortBy === "published") setSortBy("articleRating")
      if (sortBy === "articleRating") setSortBy("authorRating")
      if (sortBy === "authorRating") setSortBy("published")
    }

    const sortByYearHandler = () => {
        if (yearState === "Custom year") {
            setYearState((new Date()).getFullYear())
            return
        }
        let diff = ((new Date()).getFullYear() - yearState)
        if (diff === 0 || diff === 1) {
            setYearState(yearState - 1)
        } else {
            setYearState("Custom year")
        }
    }

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

    return (
        <>
            <Container className="my-5" style={{maxWidth: "800px"}}>
                <Row>
                    <Col>
                        <h2 className="text-center">ML articles</h2>
                    </Col>
                </Row>
                <Row>
                  <Col md="auto">
                    <Stack direction='horizontal'>
                      <Button variant="outline-dark" onClick={sortByHandler}>
                        {"Sort by " + prettify_sort_option()}
                      </Button>
                      <Button variant="outline-dark" onClick={handleOrderClick}>
                        {order ? "↓" : "↑"}
                      </Button>
                    </Stack>
                  </Col>
                  <Col/>
                  <Col md="auto">
                  {"Conference filter "}
                        <span className="d-inline-block"
                              data-toggle="popover"
                              data-trigger="focus"
                              data-content="Select conference(s)">
                            <ReactSelect options={confs}
                                         isMulti
                                         closeMenuOnSelect={false}
                                         hideSelectedOptions={false}
                                         components={{Option}}
                                         onChange={handleChange}
                                         allowSelectAll={true}
                                         value={selectedConfs}/>
                        </span>
                  </Col>
                </Row>
                <Row style={{marginTop: 10, alignItems: "center"}}>
                    <Col md='auto'>
                        <Form.Control type="number"
                            placeholder='Minimal article rating'
                            onChange={(e) => {handleCentralityChange(e.target.value)}}/>                        
                    </Col>
                    <Col md="auto">
                      <OverlayTrigger
                          placement='right'
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderTooltipArticle}
                      >
                        <div><FiAlertCircle/></div>
                      </OverlayTrigger>
                    </Col>
                    <Col/>
                    <Col md="auto">
                      <OverlayTrigger
                          placement='left'
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderTooltipAuthor}
                      >
                        <div><FiAlertCircle/></div>
                      </OverlayTrigger>
                    </Col>
                    <Col md='auto'>
                      <Form.Control type="number"
                        placeholder='Minimal author rating'
                        onChange={(e) => {handleAuthorChange(e.target.value)}}/>
                    </Col>
                </Row>
                <Row style={{marginTop: 10}}>
                    {/* <Form.Control type="text"
                                  placeholder='Search by title'
                                  onChange={handleSearch}
                                  value={searchInput}/> */}
                    <Col>
                      <Form className="d-flex">
                        <Form.Control
                          type="search"
                          placeholder="Search"
                          className="me-2"
                          aria-label="Search"
                          onChange={handleSearch}
                        />
                      </Form>
                    </Col>
                </Row>
                <Row style={{marginTop: 10}}>
                    <Col md="auto">
                        <Stack direction='horizontal'>
                            <Button variant="outline-dark" onClick={sortByYearHandler}>
                                {(yearState === "Custom year" ? "" : "Since ") + yearState}
                            </Button>
                        </Stack>
                    </Col>
                    {yearState === "Custom year" ? <Col md='auto'>
                        <Form.Control type="number"
                                      placeholder='Choose year'
                                      onChange={(e) => {handleYearChange(e.target.value)}}/>
                    </Col> : null}
                </Row>
                <Row>
                  <div style={{marginTop: 10}}>
                      <MoonLoader
                          color={"#61dafb"}
                          loading={sortLoader}
                          size={25}
                          cssOverride={override}
                          aria-label={"Loading"}
                          data-testid={"loader"}>
                      </MoonLoader>
                  </div>
                </Row>
            </Container>
            <Container style={{ maxWidth: '800px' }}>
                <ListGroup variant="flush" as="ol">
                    {articles.filter((article) => {
                        return article.title.toLowerCase().match(searchInput.toLowerCase())
                    }).map((article) => {
                        // Map the articles to JSX
                        return (
                            <ListGroup.Item key={article.id}>
                                <div className="fw-bold h3">
                                    <Link to={`/article/${article.id}`}
                                          style={{ textDecoration: 'none' }}>
                                        <Latex>{article.title}</Latex>
                                    </Link>
                                </div>
                                {article.conference ? "Presented on " + article.conference.name : ""}
                                <div>
                                    {article.authors} -
                                    <span className="text-secondary">
                                        {formatDate(article.published)}
                                    </span>
                                </div>
                                <div>
                                    {"Article rating - " + article.articleRating}
                                </div>
                                <div>
                                    {"Author rating - " + article.authorRating}
                                </div>
                                <div>
                                    {"Citations count - " + article.citations.length}
                                </div>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
                {!fetching && showTopButton ?
                  <Row style={{marginTop: 20}}>
                    <Col>
                        {!lastPageReached ?
                            <Button variant='light' onClick={() => setFetching(true)}>
                                Load More
                            </Button> : <></>
                        }
                    </Col>
                    <Col></Col>
                    <Col>
                    <Button variant="light" size='lg' onClick={scrollTop}>
                      <FaArrowCircleUp/>
                    </Button>
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
        </>
    )

}

export default Home;