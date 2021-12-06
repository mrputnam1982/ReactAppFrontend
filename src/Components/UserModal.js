import React, { Component, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import LoginForm from '../auth/LoginForm'
import RegistrationForm from '../auth/RegistrationForm'
import {authenticationService as auth} from '../services/authenticationService'
import { Link } from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {FaSignInAlt, FaPlusSquare } from "react-icons/fa";
import '../Styles/UserModal.scss';

export default class UserModal extends Component{


    constructor(props) {
        super(props);
        this.isLoggedIn = false;
        this.displayLogin = true;
        this.handleClose = this.handleClose.bind(this);
    }


    handleClose() {
        this.setState({});
    }


    componentDidMount() {
        auth.currentUser.subscribe(user => {
            //no jwt in local storage, user not logged in
            if(user && user.getCurrentUserValue !== null) {
                this.isLoggedIn = true;
            }
        });

    }

    render() {

        let {show, displayLogin, onHide} = this.props;
        const loginToggle = this.state;

        return(
        <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                  <Modal.Title>{displayLogin ?
                        <div> <FaSignInAlt/> SignIn </div>
                        : <div> <FaPlusSquare /> Register </div>}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {displayLogin ? <LoginForm/> :
                    <RegistrationForm/>}
                </Modal.Body>

        </Modal> );
    }


}