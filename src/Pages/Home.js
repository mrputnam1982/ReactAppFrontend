import React, { Component, useState, useEffect, useCallback } from 'react';
import {useLocation} from 'react-router-dom';
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

        let location = useLocation();
        const [forceRender, setForceRender] = useState(0);
        console.log("location", location);

        const replaceLocation = useCallback(() => {
            if(location.state) location.state = null;
          }, [location]);

        useEffect(() => {
            console.log("useEffect triggered");
            replaceLocation();
            console.log(location);    
        }, []);

        function ResetHomePageProps() {
            console.log("Parent location state:", location.state)
            if(location.state) location.state = "undefined";
            setForceRender(forceRender => forceRender + 1);
        }

        
        return (
            
            <div>
            <div className={"p5 mb-4 rounded-3"}
                style={{ backgroundImage: `url(${background})`,
                backgroundSize: 'cover' }}>
                <Container style={{maxWidth: "100vw",
                maxHeight: "40vw",
                height: "40vw"
                }}>

                    <Row className="text-center justify-content-center d-flex">
                        <h1 className={"display-5"}>Landing Page</h1>

                    </Row>


                    <Row className="text-center justify-content-center d-flex">
                    
                    {(location.state !== "undefined" && location.state != null) ?
                        <div>
                            <Landing 
                                email={location.state.email}
                                show={location.state.show} 
                                displayLogin={location.state.displayLogin}
                                resetHomePageProps = {ResetHomePageProps}/>
                        </div>
                        : <Landing email={null}
                            show={false}
                            displayLogin={false}
                            resetHomePageProps = {ResetHomePageProps}/>
                    }

                    </Row>

            </Container>
            </div>
            </div>
        );
}
export default Home;