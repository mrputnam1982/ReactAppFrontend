import React, { Component, useState, useEffect, useCallback } from 'react';
import {useLocation, Navigate} from 'react-router-dom';
import '../Styles/App.scss';
import AppNavbar from '../Components/AppNavbar';
import Landing from '../Components/Landing';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col, Carousel, CarouselControl, CarouselItem } from 'react-bootstrap';
import {authenticationService as auth} from '../services/authenticationService'
import {guest} from '../Roles/Guest';
import axios from 'axios';
import Cookies from 'universal-cookie';
import loginBackground from './../images/alpinelake_bg.jpg';
import blogBackground from './../images/book_background.jpg';
const Home = () => {

        let location = useLocation();
        const [index, setIndex] = useState(0);
        const [nav, setNav] = useState("/");
        const handleSelect = (selectedIndex, e) => {
            setIndex(selectedIndex);
        }

        
        
        const [forceRender, setForceRender] = useState(0);
        console.log("location", location);

        const replaceLocation = useCallback(() => {
            if(location.state) location.state = null;
          }, [location]);


        function ResetHomePageProps() {
            console.log("Parent location state:", location.state)
            if(location.state) {
                location.state = "undefined";
                setForceRender(forceRender => forceRender + 1);
            }
        }

        function navToPosts() {

            setNav("/posts")
        }
   
        if(nav === "/posts") {
            
            return <Navigate to="/posts"/>
        }
        else {
            return (
                
                <div>
                
                    <Carousel
                        activeIndex = {index}
                        onSelect = {handleSelect}
                    >
                        <Carousel.Item>
                            <div className={"p5 mb-4 rounded-3"}
                            style={{ backgroundImage: `url(${loginBackground})`,
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
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className={"p5 mb-4 rounded-3"}
                            style={{ backgroundImage: `url(${blogBackground})`,
                            backgroundSize: 'cover' }}>
                            <Container style={{maxWidth: "100vw",
                            maxHeight: "40vw",
                            height: "40vw"
                            }}>

                                <Row className="text-center justify-content-center d-flex">
                                    <h1 className={"display-5"} style={{color: "white"}}>
                                        Explore our site!
                                    </h1>

                                </Row>


                                <Row>
                                    <Container className="justify-content-center"
                                    style = {{maxWidth: "25vw"}}>
                                    <Col >
                                        <Row>
                                            <Button type="primary" size="sm" onClick={navToPosts}>
                                            View Posts
                                            </Button>
                                        </Row>
                                    </Col>
                                    </Container>

                                </Row>

                            </Container>
                            </div>  
                        </Carousel.Item>
                    
                    </Carousel>
                </div>
            );

        }
}
export default Home;