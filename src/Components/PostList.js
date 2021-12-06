import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import {authHeader} from '../helpers/auth-header'
import {ContentState, convertFromRaw} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import renderHTML from 'react-render-html';
import axios from "axios";
import moment from 'moment';
class PostList extends Component {


    constructor(props) {
        super(props);
        this.state = {posts: []};
        this.remove = this.remove.bind(this);

    }


    async remove(id) {
//        console.log(id)
        await axios.delete(`/api/posts/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': authHeader()
            }
        }).then((response) => {
           this.props.updatePosts();
        });
    }
    
    render() {
        const {isLoading} = this.state;
        const posts = this.props.posts;
        console.log("Posts", posts);
        const role = this.props.role;
        if (isLoading) {
            return <p>Loading...</p>;
        }



        const postList = posts.map(post => {
                    var body = stateToHTML(convertFromRaw(
                            JSON.parse(post.body)));
                    var options = { month: 'long'};

                    var d = new Date( post.modifiedAt * 1000);
                    var month = d.toLocaleDateString("en-US", options);

                    var date = month + ", " + moment(d).format("Do, YYYY, h:mm a");
                    return(
                    <div>
                    <article class="blog-post">
                        {role === "ROLE_ADMIN" ?
                            <ButtonGroup>
                                <Button size="sm" color="primary"> <Link to={{
                                    pathname: "posts/edit/",
                                    state: {params: {id: post.id}}
                                    }}>
                                        Edit
                                    </Link>
                                </Button>
                                <Button size="sm" color="danger" onClick={() => this.remove(post.id)}>Delete</Button>
                            </ButtonGroup> :
                            <div/>
                        }
                        <h2 class="blog-post-title"><Link to={{
                            pathname: "posts/view/",
                            state: {params: {id: post.id}}
                            }}>{post.title}</Link></h2>
                        <p class="blog-post-meta">{date}</p>
                        <p>{renderHTML(body)}</p>
                    </article>
                    </div>
                    );
        });
        console.log(postList);
        return (
            <div>
            {postList}
            </div>
        );
    }
}
export default PostList;