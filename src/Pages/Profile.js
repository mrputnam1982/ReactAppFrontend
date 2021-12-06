import React, { Component, useState } from 'react';
import '../Styles/App.scss';
import AppNavbar from '../Components/AppNavbar';
import ProfileEdit from '../Components/ProfileEdit';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import {authenticationService as auth} from '../services/authenticationService'
import {guest} from '../Roles/Guest';
import {authHeader} from '../helpers/auth-header'
import axios from 'axios';
import Cookies from 'universal-cookie';


async function getLogin() {
    return await auth.verifyLogin();
}
const Profile = () => {
        const [isLoading, setIsLoading] = useState(true);


        const promise = getLogin();
        if(promise === "DONE") {
            setIsLoading(false);
        }
        else if(promise) {
            promise.then(result => {
                const resolved = result;
                console.log("Promise resolved?", resolved);
                if(localStorage.getItem('currentUser')) setIsLoading(false);
            });
        }

        if(!isLoading)
        {
            return (
                <div>

                <Container style={{position: "relative",
                    maxWidth: "100vw",
                    maxHeight: "40vw",
                    height: "40vw"}}>

                       <ProfileEdit/>

                </Container>
                </div>
            );
        }
        else return (<div/>);
}
export default Profile;