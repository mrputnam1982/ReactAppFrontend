import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from '../Styles/App.scss'
import axios from "axios";
//import { GET_ERRORS } from "./types";
import {Container, Card,Form,Button,Col,Modal} from "react-bootstrap"
                            import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
                            import {faSave,faPlusSquare,faUndo} from "@fortawesome/free-solid-svg-icons"
import MyToast from '../Components/MyToast'
import {Link} from "react-router-dom"
import history from '../Components/history';
import CustomAvatarEditor from '../Components/CustomAvatarEditor';
import {ImagePicker} from 'react-file-picker';

export default class RegistrationForm extends Component {

    //...
    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.show = false;
        this.message = "";
        const {onClose} = props;
//        if(props.error) {
//            this.state = {
//              failure: 'wrong username or password!',
//              errcount: 0
//            }
//        } else {
//            this.state = { errcount: 0 }
//        }
          this.handleSubmit = this.handleSubmit.bind(this);
          this.handleChange = this.handleChange.bind(this);


    }
    initialState = {
        fullname:"",
        email:"",
        password:"",
        password_confirmation:"",
        registrationSuccess:false,
        errors:{}

    }
    resetUser=() => {
    this.setState(() => this.initialState)
    }
    resetErrors=() => {
        this.setState({errors: {}})
    }
    createNewUser = (newUser) => {
        axios.post("/auth/register", newUser)
        .then(response => {

            history.push({
                pathname: '/registration',
                state: this.state.email
            })
        })
        .catch(err => {
            console.log("Caught error", err);
        });
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.errors) {
        this.setState({ errors: nextProps.errors });
      }
    }
    handleSubmit(event) {
        const image = this.state.image;
        event.preventDefault();
        console.log(image);
        if(image === "") return;
        try{
            const user= {
                id: null,
                name: this.state.fullname,
                username: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.password_confirmation
            };
            this.resetErrors();
            this.createNewUser(user);

            //console.log("Form submitted?");
        } catch(error) {
            console.log(error);
        }
    }
    redirectToLogin() {

    }
    userChange =event =>{
        this.setState({
            [event.target.name]:event.target.value
        })

    };

    render() {

        const {fullname,
            email,
            password,
            password_confirmation,
            registrationSuccess,
            errors
        } = this.state;

        return(
            <div>
            <Card className={"border border-dark bg-dark text-white"}>
                <Form onReset={this.resetUser} onSubmit={this.handleSubmit} id="userFormId">
                <Card.Body>
                <Form.Group as= {Col} controlId="formGridName">
                <Form.Label>Name</Form.Label>
                <Form.Control required autoComplete="off"
                type="text"
                name="fullname"
                value={fullname}
                onChange={this.userChange}
                className={"bg-light"}
                isInvalid={!!errors.fullname}
                placeholder="Enter Full Name" />
                <Form.Control.Feedback type="invalid">
                    {errors.fullname}
                </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as= {Col} controlId="formGridemail">
                <Form.Label>Email</Form.Label>
                <Form.Control required autoComplete="off"
                type="email"
                name="email"
                value={email}
                onChange={this.userChange}
                isInvalid={!!errors.username}
                className={"bg-light"}
                placeholder="Enter Email (Username)" />
                <Form.Control.Feedback type="invalid">
                    {errors.username}
                </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as= {Col} controlId="formGridpassword">
                <Form.Label>Password</Form.Label>
                <Form.Control required autoComplete="off"
                type="password"
                name="password"
                value={password}
                onChange={this.userChange}
                isInvalid={!!errors.password}
                className={"bg-light"}
                placeholder="Enter Password" />
                 <Form.Control.Feedback type="invalid">
                    {errors.password}
                </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as= {Col} controlId="formGridpassword">
                <Form.Label>Password</Form.Label>
                <Form.Control required autoComplete="off"
                type="password"
                name="password_confirmation"
                value={password_confirmation}
                onChange={this.userChange}
                isInvalid={!!errors.confirmPassword}
                className={"bg-light"}
                placeholder="Re-enter Password" />
               <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                </Form.Control.Feedback>
                </Form.Group>

                <Card.Footer style={{"textAlign":"center"}}>
                <Container class="fluid">
                    <div class="row">
                        <div class="btn-group-sm btn-group-horizontal">
                        <Button size="sm" variant="primary" class="customWidth" type="submit">

                        <FontAwesomeIcon icon={faSave} />Submit
                        </Button>{" "}
                        <Button size="sm" variant="primary" class="customWidth" type="reset">
                        <FontAwesomeIcon icon={faUndo} />Reset
                        </Button>
                        </div>
                    </div>
                </Container>
                </Card.Footer>
                </Card.Body>
                </Form>
            </Card>
            </div>
        );
    }

}

//RegistrationForm.propTypes = {
//  //createNewUser: PropTypes.func.isRequired,
//  errors: PropTypes.object.isRequired
//};

const mapStateToProps = state => ({
  errors: state.errors
});

