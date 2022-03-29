import React, { Component, useState } from 'react';
import '../Styles/App.scss';
import AppNavbar from '../Components/AppNavbar';
import { Link, Navigate } from 'react-router-dom';
import { Button, Container, Row, Col } from 'reactstrap';
import {authenticationService as auth} from '../services/authenticationService'
import {getNameService as getNameSvc} from '../services/getNameService'
import {getIsLoading} from '../services/loadingService'
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
        this.state = {role: "ROLE_GUEST", posts: [], currentPagePosts: [], redirectToPostView: false, isLoading: true};
        this.subscriptionRole = null;
        this.goToNextPage = this.goToNextPage.bind(this);
        this.goToPrevPage = this.goToPrevPage.bind(this);
        this.updatePagination  = this.updatePagination.bind(this);
        this.redirect = this.redirect.bind(this);
    }

    componentWillMount() {
        this.subscriptionRole = getNameSvc.currentRole.subscribe(role => {
            if(role) {
                console.log("Getting observable role", role);
                this.setState({role: role});
            }
        })



        // this.subscriptionIsLoading = getIsLoading.isLoading.subscribe(loading => {
        //     console.log("Loading status changed", loading);
        //     if(loading) this.setState({isLoading: true});
        //     else this.setState({isLoading: false});
        // })

    }

    componentDidMount() {
        const promise = auth.verifyLogin();
        this.postListChild = React.createRef();
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
        let postListSorted = [];
        axios.get('api/posts').then(
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
            Pagination.currentPage = 1;
            console.log(Pagination.totalPages); 
            this.setState({currentPage: Pagination.currentPage, currentPagePosts: this.getCurrentPagePosts(), isLoading: false});
        });
    }

    updatePagination() {
        let posts = [];
        let postListSorted = [];
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
            
            if(Pagination.itemCount <= (Pagination.totalPages - 1) * 3) {
                Pagination.goToPrevPage();
            }

            Pagination.setTotalPages();
            this.state.posts = posts;
            console.log("updated pagination", posts)
            this.state.posts = posts.sort(function(a,b) {
                return a.modifiedAt < b.modifiedAt ? 1 : -1;
            });
           
            this.setState({currentPage: Pagination.currentPage, currentPagePosts: this.getCurrentPagePosts(), isLoading:false})

        });
    }
    componentWillUnmount() {
        this.subscriptionRole.unsubscribe();
        // this.subscriptionIsLoading.unsubscribe();
    }

    goToNextPage() {
        Pagination.goToNextPage();
        console.log(Pagination.currentPage);
        this.setState({currentPage: Pagination.currentPage, currentPagePosts: this.getCurrentPagePosts()});
    }

    goToPrevPage() {
        Pagination.goToPrevPage();
        this.setState({currentPage: Pagination.currentPage, currentPagePosts: this.getCurrentPagePosts()});
    }

    getCurrentPagePosts() {
            console.log("CurrentPage", Pagination.currentPage);
            console.log("CurrentStartIndex", Pagination.getCurrentStartIndex());
            console.log("CurrentEndIndex", Pagination.getCurrentEndIndex());
            console.log("Pagination Object", Pagination);
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
    redirect() {
        this.setState({redirectToPostView: true})
    }
    render() {
        const currRole = this.state.role.roleName;
        const currentPage = this.state.currentPage;
        const currentPosts = this.state.currentPagePosts;
        const prevButtonDisabled = this.isFirstPage();
        const nextButtonDisabled = this.isLastPage();

//        console.log(currRole);
        console.log("CurrentPage", currentPage);
        var id = "new"
        
        if(this.state.isLoading){
            console.log("loading");
            return <div/>;
        }
        return (
            <div>
                <Container fluid>
                    <Row>
                        {(currRole === "ROLE_ADMIN" || currRole === "ROLE_USER") ?
                            <div className="float-right">
                                <Link to={{pathname:`/posts/edit/${id}`}}>
                                <Button color="primary">
                                    Add Post                              
                                </Button>
                                </Link>
                            </div>
                            :
                            <div/>
                        }
                        <h3>Posts</h3>
                        <div className="col-md-8">
                            <PostList ref={this.postListChild} 
                                updatePosts={this.updatePagination} 
                                posts={currentPosts} 
                                role={currRole}/>
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