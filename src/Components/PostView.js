import React, { Component, useState } from 'react';
import { Link, useLocation} from 'react-router-dom';
import axios from 'axios';
import { Button, Container, Card, CardHeader, CardTitle, CardBody, CardText, CardFooter, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import CommentBox from './CommentBox';
import CommentList from './CommentList';
import {authHeader} from '../helpers/auth-header'
import moment from 'moment';
import {authenticationService as auth} from '../services/authenticationService';
import {getImageService as getImgSvc} from '../services/getImageService';
import {getNameService as getNameSvc} from '../services/getNameService';
import {convertFromRaw} from 'draft-js';
import renderHTML from 'react-render-html';
import {stateToHTML} from 'draft-js-export-html';
import {withRouter} from '../Routes/withRouter'
let commentCounter = 1;
let location

const UseLocation = () => {
  location = useLocation()
  return null
}
class PostView extends Component {

    emptyItem = {
        title: '',
        date: '',
        body: '',
    };



    constructor(props) {
        super(props);
        var post_id;
        this.currentRole = "ROLE_GUEST";
        this.state = {
            title: '',
            date: '',
            body: '',
            commentValue: '',
            comments: [],
            icons: {},
            currentCount: commentCounter,
            votes: {},
            usersVoted: {},
            upVoteDisabled: {},
            downVoteDisabled: {},
            username: "",
            isExpanded : false,
            isLoading: true
        }

        this.handleCommentValue = this.handleCommentValue.bind(this);
        this.enterCommentLine = this.enterCommentLine.bind(this);
        this.submitCommentLine = this.submitCommentLine.bind(this);
        this.onCommentClose = this.onCommentClose.bind(this);
        this.setCommentLine = this.setCommentLine.bind(this);
        this.removeComment = this.removeComment.bind(this);
        this.incrementUpVote = this.incrementUpVote.bind(this);
        this.incrementDownVote = this.incrementDownVote.bind(this);
        this.updateUserVoted = this.updateUserVoted.bind(this);
    }

    async componentDidMount() {
    //    console.log(this.props.match.params.id)
//        console.log(this.item);
        //console.log(this.props.match.params.id);
        this.state.username = auth.getUsernameFromJWT();


        this.post_id = this.props.params.id;
        console.log("post id", this.post_id);
        const promise = auth.verifyLogin();
        if(promise) {
            promise.then(result => {
                const resolved = result;
                if(localStorage.getItem('currentUser')) this.getPostAndComments();
            })
        }

    }

    async getPostAndComments() {
        this.currentRole = getNameSvc.currentRoleValue.roleName;
            //console.log("ComponentDidMount currentRole", this.currentRole);
        var state = {
            title: "",
            date: "",
            body: "",
            comments: {},
            icons: {},
            currentCount: 0,
            votes: {},
            usersVoted: {},
            upVoteDisabled: {},
            downVoteDisabled: {}
        }
        await axios.get(`/api/posts/${this.post_id}`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': authHeader()
            }
        }).then(response => {
        state.title = response.data.title;
        state.date = response.data.modifiedAt;
        state.body = response.data.body;
        state.comments = response.data.comments;
        console.log(state.comments);

        }).catch(err => {console.log(err)});
        //occasionally a lone comment is deleted, leaving a null reference
        //to comments in the parent Post Object, which needs to be discarded
        if(state.comments && state.comments[0] === null) state.comments.pop();
        if(state.comments && state.comments[0]) {
        const usernameSet = new Set();
        const imageSet = new Set();

            state.comments.map(comment => {
                    //console.log("Comment:", comment);
                    state.currentCount++;
                    state.votes[comment.id] = comment.votes;
                    state.usersVoted[comment.id] = {};
                    if(comment.usersVoted !== null && Object.keys(comment.usersVoted).length >= 0)
                    {

                        state.usersVoted[comment.id] =
                            comment.usersVoted[comment.id];
                    }
                    else state.usersVoted[comment.id][comment.posterUsername] = false;
                    usernameSet.add(comment.posterUsername)
            });


            //when page is first loaded, ensure correct upvote and downvote buttons
            //are enabled for the current user
            state.comments.forEach(comment => {
                state.upVoteDisabled[comment.id] = false;
                state.downVoteDisabled[comment.id] = false;
                if(comment.votes) {
                    comment.votes.forEach(vote => {
                        if(vote.username === this.state.username) {
                            if(vote.voteType === "UP") {
                                state.upVoteDisabled[comment.id] = true;
                            }
                            else if(vote.voteType === "DOWN") {
                                state.downVoteDisabled[comment.id] = true;
                            }
                        }
                    })
                }
            });

            var usernameArr = Array.from(usernameSet);
            var index = 0;
            console.log(usernameArr);
            await usernameArr.forEach(username => {
                axios.get(`/api/getImage/${username}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': authHeader()
                    }

                }).then(response => {
                    if(response.data){
                        console.log("image received", response.data);
                        var key = response.data.username;
                        state.icons[key] = response.data.strBase64File;

                    }
                    index++;
                    //call render when all images have been retrieved from the server

                    if(index === usernameArr.length) {
                        //update the commentCounter
                        commentCounter = state.currentCount;
                        this.setState({
                            title: state.title,
                            date: state.date,
                            body: state.body,
                            comments: state.comments,
                            icons: state.icons,
                            currentCount: state.currentCount,
                            upVoteDisabled: state.upVoteDisabled,
                            downVoteDisabled: state.downVoteDisabled,
                            isLoading: false
                        });
                    }

                });
            })

        }
        else {
            var imageData = getImgSvc.currentImageValue;
            state.icons[imageData.username] = imageData.strBase64File;
            //update the commentCounter
            commentCounter = state.currentCount;
            var votes = null;
            var usersVoted = null;
            this.setState({
                title: state.title,
                date: state.date,
                body: state.body,
                comments: state.comments,
                icons: state.icons,
                votes: votes,
                usersVoted : usersVoted,
                currentCount: state.currentCount,
                isLoading: false
            });
        }

    }
    handleCommentValue = (e) => {
        this.setState({commentValue: e.target.value});
    }
    async incrementUpVote(id) {
        console.log("Attempting to increment vote for", this.state.username, id);
        const vote = {
            id: null,
            postId: this.post_id,
            commentId: id,
            username:  this.state.username,
            voteType: "UP",

        }
        this.state.comments = this.updateCommentsWithVote(vote);
        await this.setCommentWithVotes(id);
        this.state.upVoteDisabled[id] = true;
        this.state.downVoteDisabled[id] =  false;
        this.setState({});


    }

    async incrementDownVote(id){
          console.log("Attempting to decrement vote for", this.state.username, id);

           const vote = {
                id: null,
                postId: this.post_id,
                commentId: id,
                username:  this.state.username,
                voteType: "DOWN",

            }

            this.state.comments = this.updateCommentsWithVote(vote);
            await this.setCommentWithVotes(id);
            this.state.upVoteDisabled[id] = false;
            this.state.downVoteDisabled[id] =  true;
            this.setState({});

    }

    updateCommentsWithVote(vote) {
        //get existing vote for this user on this comment
        let existingVote = null;
        let updatedComments = null;
        let votes = [];
        let vote_pushed = false;
        this.state.comments.forEach(comment => {
            if(comment.id === vote.commentId) {
                if(comment.votes) {
                    comment.votes.forEach(tmp_vote => {
                        if(tmp_vote.username === this.state.username) {
                            votes.push(vote);
                            vote_pushed = true;
                        }
                        else votes.push(tmp_vote)
                    })
                }
                if(!vote_pushed) votes.push(vote);

            }
        })
        console.log("Before updating votes", this.state.comments, votes);
        updatedComments = this.state.comments.map(comment => {
            console.log("Current comment", comment);
            if(comment.id === vote.commentId) comment.votes = votes;
            return comment;
        })
        console.log("After updating votes", updatedComments, votes);
        return updatedComments;
    }
    updateUserVoted(id, val) {

        this.state.usersVoted[id][this.state.username] = val;
    }
    async setCommentWithVotes(id) {
        var comment = null;
        this.state.comments.forEach(com => {
            if(com.id === id) comment = com;
        })
        var savedComment = await this.submitComment(comment);
        var newComment = {
            id: savedComment.id,
            posterName: savedComment.posterName,
            posterUsername: savedComment.posterUsername,
            createdAt: savedComment.createdAt,
            commentText: savedComment.commentText,
            votes: savedComment.votes[savedComment.id],
            usersVoted: savedComment.usersVoted
        }

        //modify existing comment to update votes and usersVoted
        if(this.state.comments) {
            var index  = this.state.comments.findIndex(comment => comment.id === id)
            if(index >= 0) {
               this.state.comments.splice(index, 1)
               this.state.comments.push(savedComment);
            }
            else this.state.comments.push(savedComment);
//            this.state.comments.push(newComment);
        }

        if(Object.keys(this.state.votes) > 0)
            this.state.votes[id] = savedComment.votes;
        else {
            this.state.votes = {};
            this.state.votes[id] = savedComment.votes;
        }
        if(Object.keys(this.state.usersVoted) > 0)
            this.state.usersVoted[id] = savedComment.usersVoted;
        else {
            this.state.usersVoted = {}
            this.state.usersVoted[id] = savedComment.usersVoted;
        }
//        var img = getImgSvc.currentImageValue
//
//        this.state.icons[savedComment.posterUsername] = img;
        this.setState({
          commentValue: ""
        });
    }
    async setComment() {
        commentCounter++;

        var comment = {
            id: null,
            postId: this.props.match.params.id,
            posterName: getNameSvc.currentNameValue,
            posterUsername: auth.getUsernameFromJWT(),
            commentText: this.state.commentValue,
            votes: null,
            usersVoted: null
        }
        var savedComment = await this.submitComment(comment);
        var newComment = {
            id: savedComment.id,
            posterName: savedComment.posterName,
            posterUsername: savedComment.posterUsername,
            createdAt: savedComment.createdAt,
            commentText: savedComment.commentText,
            votes: savedComment.votes,
            usersVoted: savedComment.usersVoted
        }

        if(this.state.comments) this.state.comments.push(newComment);
        else{
            this.state.comments = [];
            this.state.comments.push(newComment);
        }
        if(this.state.votes) this.state.votes[newComment.id] = null;
        else{
            this.state.votes = {};
            this.state.votes[newComment.id]  = null;
        }

        var img = getImgSvc.currentImageValue

        this.state.icons[savedComment.posterUsername] = img;
        console.log("usersVoted Undefined setComment Function?", this.state.usersVoted);
        if(this.state.usersVoted == null || typeof(this.state.usersVoted) === 'undefined')
        {
            this.state.usersVoted = {}
            this.state.usersVoted[newComment.id] = {};
            this.state.usersVoted[newComment.id][this.state.username] = false;
        }
        console.log("usersVoted after setComment Function?", this.state.usersVoted);
        this.setState({
          commentValue: ""

        });

    }
    setCommentLine() {
        //console.log("username",auth.getUsernameFromJWT());
        const promise = auth.verifyLogin();
        if(promise) {
            promise.then(result => {
                const resolved = result;
                if(localStorage.getItem('currentUser')) this.setComment();
            })
        } else console.log("Could not verify login credentials");



        console.log("Upon comment submit", this.state.comments);

    }

    async submitComment(comment) {
        var savedComment = "";

        const updatedComment = JSON.stringify(comment);
        console.log("Comment to put", updatedComment);
//        await fetch(`/api/posts/comments/${this.props.location.state.params.id}`,{
//                method: 'post',
//                body: updatedComment,
//                 headers: {
//                    'Accept': 'application/json',
//                    'Content-Type': 'application/json',
//                    'Authorization': authHeader()
//            },
//        }).then(response => {
//            savedComment  = response.data;
//
//
//        }).catch(err => {
//            console.log(err)
//        });
        await axios({
            method: 'post',
            url: `/api/posts/comments/${this.post_id}`,
            data: updatedComment,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': authHeader()
            }
        }).then(response => {
            savedComment = response.data;
        }).catch(err => {
            console.log("PutComment error", err);
        });
        console.log("SubmitComment", savedComment);
        return savedComment;
    }

    async getIconImage(username) {
        await axios.get(`/api/getImage/${username}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': authHeader()
            }

        }).then(response => {

            return response.data.strBase64File;
        })
    }
    submitCommentLine = (e) => {
         e.preventDefault();
         this.setCommentLine();
    };
    enterCommentLine = (e) => {

         if (e.charCode === 13) {
          this.setCommentLine();
         }
    };

    onCommentClose = () => {

        this.setState({commentValue: "", isExpanded: false});
    }

    async removeComment(id) {
        var currComments = this.state.comments;
        var currCommentCount = 0;
        var index = 0;
        var commentIndex = 0;
        currComments.forEach(comment => {
            if(comment.id === id) commentIndex = index;
            index++;
        })

        if(index >= 0) {
            //update all other commentId's by decrementing higher id's by one

            if(currComments.length === 1) currComments = [];
            else {
                currComments.splice(commentIndex, 1);

            }
            commentCounter--;
            await axios.delete(`/api/posts/comments/${id}`, {
                headers: {'Authorization': authHeader()}

            }).then(response => {
                //console.log("removeComment successful");
                this.setState({comments: currComments})
            })
        }
        else console.log("Could not find comment to delete");

    }
//
//    handleChange(event) {
//        const target = event.target;
//        const value = target.value;
//        const name = target.name;
//        let item = {...this.state.item};
//        item[name] = value;
//        this.setState({item});
//    }


    render() {
        const {title,
            date,
            body,
            commentValue,
            comments,
            upVoteDisabled,
            downVoteDisabled,
            icons,
            isExpanded,
            isLoading} = this.state;
//        var comments = rawComments;
//        if(comments && comments.length > 0 && comments[0] === '') comments.shift();
//        if(comments && comments.length === 0) comments = [];
        console.log("render state", this.state);
        //console.log("render props", this.incrementUpVote, this.incrementDownVote);
        //console.log("Icon dictionary keys", Object.keys(icons));
        if(isLoading) { return <div/>}

        var bodyHTML = stateToHTML(convertFromRaw(JSON.parse(body)));
        var options = { month: 'long'};

        var currentRole = this.currentRole;
        var d = new Date( date * 1000);
        var month = d.toLocaleDateString("en-US", options);
        var dateStr = month + ", " + moment(d).format("Do, YYYY, h:mm a");
        return <div>
            <Container>
                <Card>
                <CardHeader>
                    <CardTitle>
                        <h2><em>{title}</em></h2>
                        {dateStr}
                    </CardTitle>

                </CardHeader>
                <CardBody>

                    <CardText>{renderHTML(bodyHTML)}</CardText>
                </CardBody>

                </Card>
                <CommentBox
                    commentValue = {commentValue}
                    handleCommentValue = {this.handleCommentValue}
                    enterCommentLine = {this.enterCommentLine}
                    submitCommentLine = {this.submitCommentLine}
                    onClose = {this.onCommentClose}
                    isExpanded = {this.isExpanded}
                 />
                 {(typeof(comments) !== 'undefined' && comments && comments.length > 0) ?
                    <div>

                        <CommentList
                            role = {currentRole}
                            comments={comments}
                            incrementUpVote = {this.incrementUpVote}
                            incrementDownVote = {this.incrementDownVote}
                            upVoteDisabled = {upVoteDisabled}
                            downVoteDisabled = {downVoteDisabled}
                            icons={icons}
                            removeComment = {this.removeComment}
                            count = {comments.length}
                            currentUsername = {this.state.username}
                            />

                    </div> :
                    <div/>
                 }
                 <Button color="primary" tag={Link} to="/posts">Return to Posts</Button>
            </Container>
        </div>
    }
}
export default withRouter(PostView);