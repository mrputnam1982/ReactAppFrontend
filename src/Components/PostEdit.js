import React, { Component, useState } from 'react';
import { useLocation, Link, Navigate} from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';

import { EditorState, ContentState, convertFromRaw, convertToRaw} from 'draft-js'
import RichTextEditor from '../Components/RichTextEditor'
import AppNavbar from './AppNavbar';

import {authHeader} from '../helpers/auth-header'
import {authenticationService as auth} from '../services/authenticationService';
import {getNameService as getNameSvc} from '../services/getNameService';
import {withRouter} from '../Routes/withRouter';
import axios from 'axios';

let location

// const UseLocation = () => {
//   location = useLocation()
//   return null
// }

class PostEdit extends Component {

    emptyItem = {
        title: '',
        body: '',
        author: '',
        username: ''
    };
    initialFormState = {
        title: "",
        editorState: "",
    }
    constructor(props) {
        super(props);
        this.state = {
            post_id: "",
            value: "",
            item: this.emptyItem,
            editorState: EditorState.createEmpty(),
            redirectToPosts: false
        };
        this.state.item.author = getNameSvc.currentNameValue;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormNotDirty = this.isFormNotDirty.bind(this);
        //this.onChangeRichTextEditor = this.onChangeRichTextEditor(this);
    }
    
    async componentDidMount() {
    //    console.log(this.props.match.params.id)
//        console.log(this.item);
        var post;
        // console.log("Location", location);
        // console.log("Prestate", this.state
        console.log("Props", this.props);
        this.state.post_id = this.props.params.id;
        this.state.item.username = auth.getUsernameFromJWT();
        const promise = auth.verifyLogin();
        if(promise === "DONE") {
           if (this.state.post_id !== 'new') {
               await axios.get(`/api/posts/${this.state.post_id}`,
                   {
                       headers: {
                           'Accept': 'application/json',
                           'Content-Type': 'application/json',
                           'Authorization': authHeader()
                               }
                   }
               ).then(response => {
                   post = response.data;
                   this.initialFormState.title = post.title;
                   this.initialFormState.body = post.body;
                   this.setState({item: post,
                       editorState: EditorState.createWithContent(ContentState.createFromText(post.body))
                   });
               });

           }
        }
        else if(promise) {
            promise.then(result => {
                const resolved = result;
                if(localStorage.getItem('currentUser')) {
                    if (this.state.post_id !== 'new') {
                        axios.get(`/api/posts/${this.state.post_id}`,
                            {
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization': authHeader()
                                        }
                            }
                        ).then(response => {
                            post = response.data;

                            const editorState =
                                    EditorState.createWithContent(convertFromRaw(
                                    JSON.parse(post.body)))
                            this.initialFormState.title = post.title;
                            this.initialFormState.body = post.body;
                            this.setState({item: post,
                                editorState: editorState
                            });
                        });

                    }
                }
            })
        }

    }
    getTextFromEditorState(editorState) {
        if(!editorState) return "";
        var jsonFormat = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
        jsonFormat = JSON.parse(jsonFormat);
        var txt = "";
        var blockArr = jsonFormat["blocks"];
        blockArr.forEach(entry => {
            txt += entry["text"];
        })
        return txt; 
    }
    isFormNotDirty() {
        
        var currentBody = this.getTextFromEditorState(this.state.editorState)
        var initialBody = this.getTextFromEditorState(this.initialFormState.editorState);
       
        console.log("currentBody", currentBody);
        console.log("initialBody", initialBody);
        if((initialBody === "" && currentBody === "") || 
            (this.initialFormState.title === "" && this.state.item.title === ""))
            return true;

        else if(currentBody === this.initialBody &&
            this.state.item.title === this.initialFormState.title ) return true;
        else return false;
    }
    onChangeRichTextEditor = (newEditorState) =>{
      this.setState({editorState: newEditorState});

    }
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {item, editorState} = this.state;
        item.body = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
        console.log("item to post", JSON.stringify(item));
        if(item.id) {
            axios.put(`/api/posts/${item.id}`, item, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authHeader()
                    }
                
                }).then(response => {
                    this.setState({redirectToPosts: true})
            
                }).catch(err => console.log(err.response));

        }
        else {
            await axios.post(`/api/posts`, item, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': authHeader()
            }
                
            }).then(response => {
                this.setState({redirectToPosts: true})
        
            }).catch(err => console.log(err.response));
        }
    }
    render() {
        //console.log("editor text", editorState.getCurrentContent().getPlainText(''));
        //const {editorStateUpdated} = this.state.editorState;
        const heading = <h2>{this.state.item.id ? 'Edit Post' : 'New Post'}</h2>;
        const isDisabled = this.isFormNotDirty();
        if(this.state.redirectToPosts) {
            this.state.redirectToPosts = false;
            return <Navigate to="/posts"/>
        }
        else {
            return <div>
                <Container>
                    {heading}
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="title">Title</Label>
                            <Input type="text" name="title" id="title" value={this.state.item.title || ''}
                                onChange={this.handleChange} autoComplete="title"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="body">Body</Label>

                            {this.onChangeRichTextEditor ?

                                <RichTextEditor
                                    editorState={this.state.editorState}
                                    onChange={this.onChangeRichTextEditor}
                                /> :
                                <div/>
                            }

                        </FormGroup>
                        <FormGroup>
                            <Button color="primary" type="submit" disabled={isDisabled}>Save</Button>{' '}
                            <Button color="secondary" tag={Link} to="/posts">Cancel</Button>
                        </FormGroup>
                    </Form>
                </Container>
            </div>
        }
    }
}
export default withRouter(PostEdit);