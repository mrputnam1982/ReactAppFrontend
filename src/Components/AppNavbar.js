import React, {Component, useState} from 'react';
import {Dropdown, Navbar, NavbarBrand, Nav, Button, Container, Row, Col} from 'react-bootstrap';
import {Link, Navigate} from 'react-router-dom';
import {authenticationService} from '../services/authenticationService';
import {getNameService as getNameSvc} from '../services/getNameService';
import {getImageService as getImgSvc} from '../services/getImageService';
import UserModal from './UserModal';
import {Subject} from 'rxjs';
import Avatar from 'react-avatar'
import history from '../Components/history'
import '../Styles/App.scss';

export default class AppNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            displayLogin: true,
            displayDropdown: false,
            name: "",
            avatar: "",
            redirectToLogin: false,
            redirectToPosts: false,
            redirectToProfile: false
        };
        this.toggle = this.toggle.bind(this);
        this.loginLinkName = "Login"

        this.isDlgOpen = false;
        this.logout = this.logout.bind(this);
        this.onClickPostRedirect = this.onClickPostRedirect.bind(this);
        this.onClickProfileRedirect = this.onClickProfileRedirect.bind(this);
    }


    async componentDidMount() {
        //console.log(authenticationService.loggedIn);
        this.state.avatar = "";
        this.state.name = "";
        this.state.displayDropdown = false;

        this.subscriptionLogOut = authenticationService.currentUser.subscribe(user => {
            console.log("Logout?", user);
            if(user === null) this.setState({name:"", displayDropdown: false})
        })
        this.subscriptionProfileDropdown = getNameSvc.currentName.subscribe(name => {
            console.log("checking profile dropdown name", name);
            //upon page refresh update the name field to the current user's name
            if(name === "undefined" || !name) {
                name = getNameSvc.currentNameValue;
            }
            if(name) {
             console.log("currentName Observable Triggered", name);

             this.setState({name: name, displayDropdown: true});
            }


        })

        this.subscriptionImageSet = await getImgSvc.currentImage.subscribe(image => {
            //console.log("checking profile icon availability", getImgSvc.currentImageValue);
            if(authenticationService.loggedIn === true)
            {
                
                if(image === "undefined" || !image) {
                    
                    image = getImgSvc.currentImageValue;
                //console.log("Image observable subscription triggered", image);
                }
                this.setState({avatar: image})
            }

        })

        window.addEventListener("beforeunload", (ev) => 
        {  
            ev.preventDefault();
            if(performance.navigation.type != performance.navigation.TYPE_RELOAD)
                authenticationService.logout();
        });
    }
    componentWillUnmount() {
        this.subscriptionProfileDropdown.unsubscribe();
        this.subscriptionImageSet.unsubscribe();
        this.subscriptionLogOut.unsubscribe();

        window.removeEventListener("beforeunload", null);
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    logout() {
        authenticationService.logout();
        this.setState({redirectToLogin: true});
    }

    onClickPostRedirect() {
        this.setState({redirectToPosts: true})
    }

    onClickProfileRedirect() {
        this.setState({redirectToProfile: true})
    }
    render() {
        const NavbarBrandStyle = {
            fontSize: "50px",
            fontFamily: "Arial"
        }
        const name = this.state.name;
        const avatar = this.state.avatar;

        if(this.state.redirectToLogin) {
            this.state.redirectToLogin = false;
            history.push("/");
            //return <Navigate to="/"/>
        }
        if(this.state.redirectToPosts) {
            this.state.redirectToPosts = false;
            history.push("/posts");
        }
        if(this.state.redirectToProfile) {
            this.state.redirectToProfile = false;
            history.push("/profile");
        }
        return (

            <Navbar color="light" expand="md" class="px-2">

                <NavbarBrand style={NavbarBrandStyle}>
                    <Link to='/' style={{textDecoration: "none"}}>ReactBlog</Link>
                </NavbarBrand>
            

            {name ? (
                <Nav className="ms-auto" style={{marginRight: "20px"}}>
                    <Container>
                        <Row>
                            <Col style={{marginRight: "10px"}}  >
                                {avatar ? (

                                        <Avatar round ={true}
                                            size="40"
                                            name={name}
                                            src={avatar}/>
                                        ): (
                                        name ? (
                                            <Avatar size="40"
                                                round={true}
                                                name={name}/>
                                            ) : <div/>
                                        )
                                }
                            </Col>
                            <Col>
                                {this.state.displayDropdown ? (
                                    <Dropdown class="px-20">

                                        <Dropdown.Toggle variant="success"> Welcome, {name} </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                           
                                            <Dropdown.Item onClick={this.onClickPostRedirect}>
                                                View Posts
                                            </Dropdown.Item>
                                            
                                       
                                            <Dropdown.Item onClick={this.onClickProfileRedirect}>
                                                View/Edit Profile
                                            </Dropdown.Item>
                                        
                                            <Dropdown.Item>Contact Us</Dropdown.Item>
                                            <Dropdown.Item onClick={this.logout}>Logout</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown> )
                                    : <div/>

                                }
                            </Col>
                        </Row>
                    </Container>
                </Nav>
                ) : ( <div/> )
            }
        </Navbar>
        );

    }
}
