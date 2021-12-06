import React, {Component, useState} from 'react';
import {Container, ListGroup, Button, Row, Col, FormLabel} from 'react-bootstrap';
import '../Styles/CommentBox.scss';
import Avatar from 'react-avatar';
import cn from 'classnames';
import moment from 'moment';
import ReactTimeout from 'react-timeout';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowAltCircleUp, faArrowAltCircleDown} from "@fortawesome/free-solid-svg-icons"

class CommentList extends Component {

    constructor(props) {
        super(props);
        this.commentListSorted = null;
        this.state = {
            isLoading: true,
            commentCount: 0,
            upVotes: 0,
            downVotes: 0,
            isUpVotingDisabled: false,
            isDownVotingDisabled: false
        }
        this.commentList = null;
    }


    tallyVotes(votes) {
        var upVoteCount = 0;
        var downVoteCount = 0;
        if(votes && votes.length > 0)
        {
            votes.forEach(vote => {
                if(vote.voteType === "UP") upVoteCount++;
                else if(vote.voteType === "DOWN") downVoteCount++;
            })
        }
        console.log("Tallying votes", upVoteCount, downVoteCount);
        return {upVoteCount, downVoteCount};
    }
    refreshCommentList() {

        const { role,
            comments,
            incrementDownVote,
            incrementUpVote,
            upVoteDisabled,
            downVoteDisabled,
            icons,
            removeComment,
            count,
            currentUsername
            } = this.props;
        console.log("Comment list properties", this.props);
        //if(count === this.state.commentCount) return;

        console.log("Refreshing the comment component",comments, icons, role)
        //console.log("Icon dictionary keys", Object.keys(icons));
        this.commentListSorted = comments.sort(function(a,b) {
            return a.createdAt < b.createdAt ? -1 : 1;
        });
        var options = { month: 'long'};

        this.commentList = this.commentListSorted.map(val => {
            var options = { month: 'long'};
            var d = new Date( val.createdAt * 1000);
            var month = d.toLocaleDateString("en-US", options);
            var dateStr = month + ", " + moment(d).format("Do, YYYY, h:mm a");
            console.log("current comment in list", val, icons[val.posterUsername]);
            const {upVoteCount, downVoteCount} = this.tallyVotes(val.votes);
            console.log("UpVotes", upVoteCount);
            console.log("DownVotes", downVoteCount);

            return (
                <div>
                <Container>
                    <Row>
                        {val.commentText ?
                             <ListGroup.Item>
                             {icons[val.posterUsername] ?
                                 <Avatar round ={true}
                                     borderRadius="50"
                                     size="50"
                                     name={val.posterName}
                                     src={icons[val.posterUsername]}/>
                                 :
                                 <Avatar size="50"
                                     round={true}
                                     name={val.posterName}/>
                             }
                             {val.commentName}
                             <br/>
                             {dateStr}
                             <br/>
                             {val.commentText}
                             </ListGroup.Item> :
                             <div/>
                        }
                    </Row>
                        <Row alignItems="flex-end">
                            <Col>
                                <Button
                                        disabled={upVoteDisabled[val.id]}
                                        size="sm"
                                        color="primary"
                                        onClick={() => incrementUpVote(val.id)}>
                                    <FontAwesomeIcon icon={faArrowAltCircleUp}/>
                                </Button>
                                <FormLabel> {upVoteCount !== 0 ? upVoteCount : " "}</FormLabel>

                                <Button disabled =
                                        {downVoteDisabled[val.id]}
                                        size="sm"
                                        color="primary"
                                        onClick={() => incrementDownVote(val.id)}>
                                    <FontAwesomeIcon icon={faArrowAltCircleDown}/>
                                </Button>
                                <FormLabel> {downVoteCount !== 0 ? downVoteCount : " "} </FormLabel>
                            </Col>
                        </Row>
                    <Row>

                        <Col>
                        {role === "ROLE_ADMIN" ?
                            <Button size="sm" color="danger" onClick={
                                () => removeComment(val.id)}>Delete</Button>
                            : <div/>
                        }
                        </Col>
                    </Row>
                    </Container>
                </div>
            );
        });


    }
    componentDidMount() {

        this.refreshCommentList();

        this.setState({isLoading: false,
            commentCount: this.commentList.length});

    }
    render() {

        this.refreshCommentList();
//        this.state.commentCount = this.commentList.length;
        if(this.state.isLoading) return (<div/>);
        return (
              <Container>
              <ListGroup>
                {this.commentList}
              </ListGroup>
              </Container>
        );
    }
}

export default ReactTimeout(CommentList);