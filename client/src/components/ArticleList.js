import React from 'react'
import {ListGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import formatDate from "../context/formatDate";

let Latex = require('react-latex')

const ArticleList = (props) => {
    return(
        <ListGroup variant="flush" as="ol">
            {props.articles.map(article => article.article).map(article => {
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
    )
}

export default ArticleList