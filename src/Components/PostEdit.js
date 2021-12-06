import React, { Component, useState } from 'react';
import { Link} from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import { EditorState, ContentState, convertFromRaw, convertToRaw} from 'draft-js'
import RichTextEditor from '../Components/RichTextEditor'
import AppNavbar from './AppNavbar';
import {authHeader} from '../helpers/auth-header'
import {authenticationService as auth} from '../services/authenticationService';
import axios from 'axios';

class PostEdit extends Component {

    emptyItem = {
        title: '',
        body: '',
    };

    constructor(props) {
        super(props);
        this.state = {
            id: "",
            value: "",
            item: this.emptyItem,
            editorState: EditorState.createEmpty()
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        //this.onChangeRichTextEditor = this.onChangeRichTextEditor(this);
    }
    
    async componentDidMount() {
    //    console.log(this.props.match.params.id)
//        console.log(this.item);
        var post;
        this.state.id = this.props.location.state.params.id;
        const promise = auth.verifyLogin();
        if(promise === "DONE") {
           if (this.state.id !== 'new') {
               await axios.get(`/api/posts/${this.state.id}`,
                   {
                       headers: {
                           'Accept': 'application/json',
                           'Content-Type': 'application/json',
                           'Authorization': authHeader()
                               }
                   }
               ).then(response => {
                   post = response.data;

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
                    if (this.state.id !== 'new') {
                        axios.get(`/api/posts/${this.state.id}`,
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

                            this.setState({item: post,
                                editorState: editorState
                            });
                        });

                    }
                }
            })
        }

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
        console.log(item);
        await fetch('/api/posts' + (item.id ? '/' + item.id : ''), {
            method: (item.id) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': authHeader()
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/posts');
    }

    render() {
        //console.log("editor text", editorState.getCurrentContent().getPlainText(''));
        //const {editorStateUpdated} = this.state.editorState;
        const heading = <h2>{this.state.item.id ? 'Edit Post' : 'New Post'}</h2>;

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
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/posts">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}
export default PostEdit;