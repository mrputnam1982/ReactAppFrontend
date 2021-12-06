import React, { Component, useState } from 'react';
import '../Styles/App.scss';
import AppNavbar from '../Components/AppNavbar';
import Landing from '../Components/Landing';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import {authenticationService as auth} from '../services/authenticationService'
import {guest} from '../Roles/Guest';
import axios from 'axios';
import Cookies from 'universal-cookie';
import background from './../images/alpinelake_bg.jpg';
const Home = () => {


        return (
            <div>
            <div className={"p5 mb-4 rounded-3"}
                style={{ backgroundImage: `url(${background})`,
                backgroundSize: 'cover' }}>
            <Container style={{position: "relative",
                maxWidth: "100vw",
                maxHeight: "40vw",
                height: "40vw"}}>

                    <Row className="text-center justify-content-center d-flex">
                        <h1 className={"display-5"}>Landing Page</h1>

                    </Row>


                    <Row className="items-align">
                      <Landing/>
                    </Row>

            </Container>
            </div>
            </div>
        );
}
export default Home;