    import React, {Component, useState} from 'react';
import {OverlayTrigger, Tooltip, Popover, Container, ListGroup, Button, Row, Col, FormLabel} from 'react-bootstrap';
import '../Styles/CommentBox.scss';
import Avatar from 'react-avatar';
import cn from 'classnames';
import moment from 'moment';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowAltCircleUp, faArrowAltCircleDown} from "@fortawesome/free-solid-svg-icons"
import {convertFromRaw} from 'draft-js';
import renderHTML from 'react-render-html';
import {stateToHTML} from 'draft-js-export-html';

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


    renderTooltip = (props) => (

        <Popover id="avatar-tooltip" {...props}>
            <Popover.Header>

                {props.popper.state ?
                    <div>
                        <b>Name:</b> {props.popper.state.options.name}
                        <br/>
                        {props.popper.state.options.title ?
                            <i>{props.popper.state.options.title}</i> : <div/>
                        }    
                    </div>
                    : <div/>
                }

            </Popover.Header>
            <Popover.Body>
                {props.popper.state ?
                    <div>

                        {/* {JSON.stringify(props.popper.state.options.userProfile.profileHeading)} */}
                        <b>A little about me:</b> {props.popper.state.options.body ?
                            <div>
                                {renderHTML(
                                    stateToHTML(
                                        convertFromRaw(
                                            JSON.parse(props.popper.state.options.body))))}
                            </div>
                            : <div>N/a</div> }
                    </div>
                : <div>
                    Loading...
                </div>
                }
            </Popover.Body>
        </Popover>
    
    );

    refreshCommentList() {

        const { role,
            comments,
            commentProfiles,
            incrementDownVote,
            incrementUpVote,
            upVoteDisabled,
            downVoteDisabled,
            icons,
            removeComment,
            count,
            currentUsername,
            currentRole
            } = this.props;
        console.log("CurrentRole", currentRole );
        console.log("Comment list properties", this.props);
        //if(count === this.state.commentCount) return;

        console.log("Refreshing the comment component",comments, icons, role)
        //console.log("Icon dictionary keys", Object.keys(icons));
        this.commentListSorted = comments.sort(function(a,b) {
            return a.createdAt < b.createdAt ? -1 : 1;
        });
        var options = { month: 'long'};
        console.log("RefreshCommentList commentProfiles", commentProfiles);
        // for(let [key, profile] of Object.entries(commentProfiles)) {
        //     var bodyHTML = ""
        //     if(profile.profileInfo !== null)
        //         bodyHTML = stateToHTML(convertFromRaw(JSON.parse(profile.profileInfo)));
        //     commentProfiles[key].profileInfo = bodyHTML;

        // }

        //console.log("CommentProfiles with bodyHTML", commentProfiles);
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
                        <div>
                            
                            {val.commentText ?
                                <ListGroup.Item>
                                

                                    {icons[val.posterUsername] ?
                                        <div>
                                        {commentProfiles[val.posterUsername] ?
                                            <div>
                                            <OverlayTrigger
                                                placement="top"
                                                delay={{ show: 250, hide: 400 }}
                                                overlay={this.renderTooltip}
                                                popperConfig=
                                                    {{name  : commentProfiles[val.posterUsername].name,
                                                    title : commentProfiles[val.posterUsername].profileHeading,
                                                    body: commentProfiles[val.posterUsername].profileInfo}} >
                                            <div style={{width: "75px"}}>   
                                            <Avatar size="50"
                                                round={true}
                                                name={val.posterName}
                                                src={icons[val.posterUsername]}/>
                                            </div>
                                            </OverlayTrigger>
                                            </div>
                                        : <div style={{width: "75px"}}>   
                                            <Avatar size="50"
                                                round={true}
                                                name={val.posterName}
                                                src={icons[val.posterUsername]}/>
                                            </div>
                                        }
                                   
                                        </div>
                                        :
                                        <div>
                                            {commentProfiles[val.posterUsername] ?
                                                <div>
                                                <OverlayTrigger
                                                    placement="top"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={this.renderTooltip}
                                                    popperConfig=
                                                        {{name  : commentProfiles[val.posterUsername].name,
                                                        title : commentProfiles[val.posterUsername].profileHeading,
                                                        body: commentProfiles[val.posterUsername].profileInfo}} >
                                                <div style={{width: "75px"}}>   
                                                <Avatar size="50"
                                                    round={true}
                                                    name={val.posterName}/>
                                                </div>
                                                
                                                </OverlayTrigger>
                                                </div>: 
                                                 <div style={{width: "75px"}}>   
                                                 <Avatar size="50"
                                                     round={true}
                                                     name={val.posterName}/>
                                                 </div>
                                            }
                                        </div>
                                    }
                                {val.commentName}
                                <br/>
                                {dateStr}
                                <br/>
                                {val.commentText}
                                </ListGroup.Item> :
                                <div/>
                            }
                        </div>
                    </Row>
                        <Row alignItems="flex-end">
                            <Col>
                                <Button
                                        disabled={upVoteDisabled[val.id] || 
                                            currentRole === "ROLE_GUEST" ||
                                            currentUsername === val.posterUsername}
                                        size="sm"
                                        color="primary"
                                        className="rounded-circle"
                                        onClick={() => incrementUpVote(val.id)}>
                                    <FontAwesomeIcon icon={faArrowAltCircleUp}/>
                                </Button>
                                <FormLabel> {upVoteCount !== 0 ? upVoteCount : " "}</FormLabel>
                                <span> </span>

                                <Button disabled =
                                        {downVoteDisabled[val.id] || 
                                            currentRole === "ROLE_GUEST" ||
                                            currentUsername === val.posterUsername}
                                        size="sm"
                                        color="primary"
                                        className = "rounded-circle"
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

export default CommentList;