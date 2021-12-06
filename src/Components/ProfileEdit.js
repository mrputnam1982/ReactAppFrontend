import React, {useState, Component} from 'react';
import axios from 'axios';
import {authHeader} from '../helpers/auth-header'
import {Button, Container, Row, Col, Form, FormGroup, Input, Label} from 'reactstrap'
import {Link} from 'react-router-dom';
import {authenticationService as auth} from '../services/authenticationService'
import {getImageService as getImageSvc} from '../services/getImageService'
import { EditorState, ContentState, convertFromRaw, convertToRaw} from 'draft-js'
import RichTextEditor from '../Components/RichTextEditor'
import CustomAvatarEditor from '../Components/CustomAvatarEditor'
import Avatar from 'react-avatar'
import history from '../Components/history'
import "../Styles/Profile.scss"
import CryptoJS from "crypto-js"
class ProfileEdit extends Component{

    constructor(props) {
        super(props);
        this.profile = {
            username: "",
            name: "",
            heading: "",
            body: "",
            imageUrl: ""
        }
        this.state = {
            id: "",
            profile: this.profile,
            image: "",
            editorState: EditorState.createEmpty(),
            showModal: false,
            postImage: false,
            updateEditor: false,
            contentLoaded: false
        }
        this.initialFormState = {
            name: "",
            heading: "",
            body: "",
            imageUrl: ""
        }
        this.username = auth.getUsernameFromJWT();
        this.submitDisabled = true;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.displayAvatarEditor = this.displayAvatarEditor.bind(this);
        this.closeAvatarEditor = this.closeAvatarEditor.bind(this);
        this.imageSaved = this.imageSaved.bind(this);
        this.postImagetoImgBB = this.postImageToImgBB.bind(this);
        this.getBase64Image = this.getBase64Image.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();
        const promise = auth.verifyLogin();

        if(promise) {
            this.submitDisabled = true;
            promise.then(result => {
                if(localStorage.getItem('currentUser')) {


                    const {id, profile, image, editorState, showModal, postImage} = this.state;
                    const imgUrl = this.state.image
                    console.log("submitting profile info", this.state);
                    if(imgUrl && postImage)
                    {
                        //console.log("ImgBB Post URL", imgUrl);

                        var updatedClient = {
                            id: id,
                            name: this.profile.name,
                            profileHeading: this.profile.heading,
                            profileInfo: null,
                            avatar: {username: this.profile.username, strBase64File: imgUrl},
                        }

                        updatedClient.profileInfo =
                            JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
                            //console.log("profile handleSubmit", updatedClient);
                            const requestBody = JSON.stringify(updatedClient)
                            axios.put(`/api/clients/${updatedClient.id}`, requestBody, {

                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization': authHeader()
                                }
                            }).then(response => {
                                getImageSvc.setImage(this.state.image);
                                history.push('/posts');
                            }).catch(err => console.log(err));


                    }

                    else{
                        var updatedClient = {
                            id: id,
                            name: this.profile.name,
                            profileHeading: this.profile.heading,
                            profileInfo: null,
                            avatar: null

                        }
                        updatedClient.profileInfo =
                            JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
                        //console.log("profile handleSubmit", updatedClient);
                        const requestBody = JSON.stringify(updatedClient)
                        axios.put(`/api/clients/${updatedClient.id}`, requestBody, {

                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': authHeader()
                            }
                        }).then(response => {
                            history.push('/posts');
                        }).catch(err => console.log(err));
                    }

                }
            })
            this.setState({});
        }

    }
    onChangeRichTextEditor = (newEditorState) =>{
      this.setState({editorState: newEditorState});

    }

    async getClient() {
        let client = "";

        await axios.get(`/api/clients/getByUsername/${this.username}`, {
            headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': authHeader()
            }
        }).then(response => {
            //.log("ProfileEdit", response.data);
            client = response.data;
        }).catch(err => {
            console.log("ProfileEdit Error", err);
        })
        this.initialFormState = {
            name: client.name,
            heading: client.profileHeading,
            body: client.profileInfo
        }
        this.profile = {
            username: client.username,
            name: client.name,
            heading: client.profileHeading,
            body: client.profileInfo,
        }
        if(getImageSvc.currentImageValue === "") {
            if(client.avatar) this.profile.imageUrl = client.avatar.strBase64File;
            else this.profile.imageUrl = "";
        }
        else this.profile.imageUrl = getImageSvc.currentImageValue;

        var editorState = this.state.editorState;
        if(this.profile.body) {
            //console.log("Profile", this.profile);
            editorState =
                EditorState.createWithContent(convertFromRaw(
                    JSON.parse(this.profile.body)
                ));
        }


        this.setState({
            id: client.id,
            profile: this.profile,
            editorState: editorState,
            image: this.profile.imageUrl,
            contentLoaded: true})


    }

    componentDidMount() {
        if(localStorage.getItem('currentUser')) {
            this.getClient();
        }
    }

    handleChange(event) {

        const target = event.target;
        //console.log("Target", target);
        const value = target.value;

        const name = target.name;

        let profile = this.profile;
        profile[name] = value

        this.setState({profile});
    }

    checkFormState() {
        let name = "";
        let heading = "";
        let body = "";
        let imageUrl = "";
        let originalName = "";
        let originalHeading = "";
        let originalBody = "";
        let originalUrl = "";
        if(this.state.profile.name) {
            name = this.state.profile.name;
        }
        if(this.state.profile.heading) {
            heading = this.state.profile.heading;
        }
        if(this.state.profile.body)
        {
            body = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
        }
        if(this.state.profile.imageUrl)
        {
            imageUrl = this.state.profile.imageUrl;
        }
        if(this.initialFormState.name) {
            originalName = this.initialFormState.name;
        }
        if(this.initialFormState.heading) {
            originalHeading = this.initialFormState.heading;
        }
        if(this.initialFormState.body) {
            originalBody = this.initialFormState.body;
        }
        if(this.initialFormState.imageUrl) {
            originalUrl = this.initialFormState.imageUrl;
        }

        if(this.state.postImage) return false;
        if(name === originalName
            && heading === originalHeading
            && body === originalBody)
        {
            //console.log("keep button disabled")
            return true;
        }

        else
        {
            //console.log("enable button")
            return false;
        }
    }

    displayAvatarEditor() {
        this.setState({showModal: true});
    }

    closeAvatarEditor() {

        this.setState({showModal: false});

    }

    setImage = (avatarEditorImage) => {
         this.setState({image: avatarEditorImage})

    }

    imageSaved = (avatarEditorImage) => {
        this.setState({image: avatarEditorImage, postImage: true});
    }


    async postImageToImgBB(avatarEditorImage) {
        const API_KEY = "cfb81278dab11ed393283f39d4119f59";
        const API_URL = "https://api.imgbb.com/1/upload";
        let image =
            avatarEditorImage.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "")

        var form = new FormData();
        form.append('image', image)
        await axios.post(API_URL, form, {
            params: {
                key: API_KEY
                },
    //
    //           headers: {
    //                'Accept': 'application/json',
    //                'Access-Control-Allow-Origin': '*',
    //                'Connection': 'keep-alive',
    //                'Content-Type': 'application/json',
    //            },

            }).then(response => {
                let res = response.data.data.url;
                const profile = this.state.profile;
                //console.log("Post to ImgBB Response", res);
                profile.imageUrl = res;
                this.setState({profile: profile});
            }).catch(err => console.log(err));

        //console.log("Posting the following image", image.substring(0,20));


    }

    async getBase64Image(id) {
        await axios.get(`/api/clients/getById/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': authHeader()
            }

        }).then(response => {

            return response.data.iconUrl;
        });

        // now do something with `dataUrl`

    }

    render() {
        const {id, profile, image, editorState, showModal, postImage, contentLoaded} = this.state;
//        if(id === null && localStorage.getItem("currentUser")) {
//            console.log("GETting client with new jwt");
//            this.getClient();
//            return;
//        }

        console.log("ProfileEdit Render", this.state);
        this.submitDisabled = this.checkFormState();
        //console.log("render", this.state);


        return(

                <div>
                {contentLoaded ?
                    (
                    <div>
                        <CustomAvatarEditor
                            image={image}
                            showModal={showModal}
                            modalClose={this.closeAvatarEditor}
                            setImage={this.setImage}
                            imageSaved={this.imageSaved}
                        />
                        <Container>
                            <h1>Edit Profile</h1>
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <Label for="name"><strong>Name</strong></Label>
                                    <Input style={{maxWidth: "250px"}}
                                        type="text" name="name" id="name" value={profile.name}
                                           onChange={this.handleChange} autoComplete="name"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="heading"><strong>Heading</strong></Label>
                                    <Input type="text" name="heading" id="heading" value={profile.heading}
                                           onChange={this.handleChange} autoComplete="heading"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="body"><strong>Profile Info</strong></Label>

                                        <RichTextEditor
                                            editorState={this.state.editorState}
                                            onChange={this.onChangeRichTextEditor}/>

                                </FormGroup>
                                <FormGroup>
                                    <Container>
                                        <Row>
                                            <Label for="Icon"><strong>Profile Icon</strong></Label>
                                        </Row>
                                        <Row>
                                            {image ?
                                                <Avatar round ={true}
                                                    borderRadius="50"
                                                    size="100"
                                                    name={image}
                                                    src={image}/>
                                                :
                                                <Avatar size="100"
                                                    round={true}
                                                    name={profile.name}/>
                                             }
                                        </Row>
                                        <Row>
                                            <Button style={{marginTop: "10px", maxWidth: "200px"}}
                                                color="primary"
                                                onClick={this.displayAvatarEditor}>
                                                Choose Icon
                                            </Button>

                                         </Row>

                                    </Container>
                                </FormGroup>
                                <FormGroup>
                                    <Button disabled={this.submitDisabled} color="primary" type="submit">Update Profile</Button>{' '}
                                    <Button color="secondary" tag={Link} to="/posts">Cancel</Button>
                                </FormGroup>
                            </Form>
                        </Container>
                    </div>  ) : <div/>  }
                </div>

        )

    }
}

export default ProfileEdit;