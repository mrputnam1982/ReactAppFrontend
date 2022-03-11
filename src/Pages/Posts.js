import React, { Component, useState } from 'react';
import '../Styles/App.scss';
import AppNavbar from '../Components/AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col } from 'reactstrap';
import {authenticationService as auth} from '../services/authenticationService'
import {getNameService as getNameSvc} from '../services/getNameService'
import axios from 'axios';
import PostList from "../Components/PostList"
import Cookies from 'universal-cookie';
import {Pagination} from "../helpers/Pagination";
import {authHeader} from "../helpers/auth-header";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faArrowLeft} from "@fortawesome/free-solid-svg-icons"
class Posts extends Component {

    constructor(props) {
        super(props);
        this.state = {role: "ROLE_GUEST", posts: [], currentPage: []};
        this.subscriptionRole = null;
        this.goToNextPage = this.goToNextPage.bind(this);
        this.goToPrevPage = this.goToPrevPage.bind(this);
        this.updatePagination  = this.updatePagination.bind(this);
    }

    componentWillMount() {
        this.subscriptionRole = getNameSvc.currentRole.subscribe(role => {
            if(role) {
                console.log("Getting observable role", role);
                this.setState({role: role});
            }
        })

    }

    componentDidMount() {
        const promise = auth.verifyLogin();
        console.log("Posts componentDidMount", promise);
        if(promise) {
            promise.then(result => {
                const resolved = result;
                if(localStorage.getItem('currentUser')) {
                    console.log("Posts componentDidMount re-render");
                    this.setState({role: getNameSvc.currentRoleValue});
                }
            })
        }
        axios.get('api/posts', {
            headers: {
                'Authorization': authHeader()
           }
        }).then(
            res => {
                console.log(res.data);

                //response.json();
                const posts = res.data;
                this.state.posts = posts;

        }).then(
            res => {
            this.state.posts = this.state.posts.sort(function(a,b) {
                return a.modifiedAt < b.modifiedAt ? 1 : -1;
            });
            Pagination.setItemCount(this.state.posts.length);
            Pagination.setTotalPages();

            console.log(Pagination.totalPages);

            this.setState({currentPage: this.getCurrentPage()});
        });
    }

    updatePagination() {
        let posts = [];
        axios.get('api/posts', {
            headers: {
                'Authorization': authHeader()
           }
        }).then(
            res => {
                console.log(res.data);

                //response.json();
                posts = res.data;

        }).then(() => {
            Pagination.setItemCount(posts.length);
            Pagination.setTotalPages();
            Pagination.currentPage = 1;
            this.setState({posts: posts, currentPage: this.getCurrentPage()})
        });
    }
    componentWillUnmount() {
        this.subscriptionRole.unsubscribe();
    }

    goToNextPage() {
        Pagination.goToNextPage();
        this.setState({currentPage: this.getCurrentPage()});
    }

    goToPrevPage() {
        Pagination.goToPrevPage();
        this.setState({currentPage: this.getCurrentPage()});
    }

    getCurrentPage() {
            console.log("CurrentPage", Pagination.currentPage);
        return this.state.posts.slice(Pagination.getCurrentStartIndex(),
                Pagination.getCurrentEndIndex() + 1);
    }

    isLastPage() {
        if(Pagination.currentPage === Pagination.totalPages) return true;
        else return false;
    }

    isFirstPage() {
        if(Pagination.currentPage === 1) return true;
        else return false;
    }
    render() {
        const currRole = this.state.role.roleName;
        const currentPage = this.state.currentPage;
        const prevButtonDisabled = this.isFirstPage();
        const nextButtonDisabled = this.isLastPage();
//        console.log(currRole);
        console.log("CurrentPage", currentPage);
        return (
            <div>
                <Container fluid>
                    <Row>
                        {currRole === "ROLE_ADMIN" ?
                            <div className="float-right">
                                <Button color="success"><Link to={{
                                    pathname: "posts/edit/",
                                    state: {params: {id: "new"}}
                                }}>Add Post
                                </Link>
                                </Button>
                            </div>
                            :
                            <div/>
                        }
                        <h3>Posts</h3>
                        <div className="col-md-8">
                            <PostList updatePosts={this.updatePagination} posts={currentPage} role={currRole}/>
                        </div>
                    </Row>
                    {Pagination.totalPages !== 1 ?
                        <Row>
                            <Col>
                                <Button color="primary" disabled={prevButtonDisabled} onClick={this.goToPrevPage}>
                                    <FontAwesomeIcon icon={faArrowLeft}/>
                                </Button>
                            </Col>
                            <Col>
                                <Button color="primary" disabled={nextButtonDisabled} onClick={this.goToNextPage}>
                                    <FontAwesomeIcon icon={faArrowRight}/>
                                </Button>
                            </Col>
                        </Row>
                    : <div/>}
                </Container>
            </div>
        );
    }
}
export default Posts;