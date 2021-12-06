import React, {Component, useState} from 'react';
import {Dropdown, Navbar, NavbarBrand, Nav, Button, Container, Row, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {authenticationService} from '../services/authenticationService';
import {getNameService as getNameSvc} from '../services/getNameService';
import {getImageService as getImgSvc} from '../services/getImageService';
import UserModal from './UserModal';
import {Subject} from 'rxjs';
import Avatar from 'react-avatar'
import history from './history';
import '../Styles/App.scss';

export default class AppNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            displayLogin: true,
            displayDropdown: false,
            name: "",
            avatar: ""
        };
        this.toggle = this.toggle.bind(this);
        this.loginLinkName = "Login"

        this.isDlgOpen = false;
        this.logout = this.logout.bind(this);
    }



    componentDidMount() {
        //console.log(authenticationService.loggedIn);
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

        this.subscriptionImageSet = getImgSvc.currentImage.subscribe(image => {
            if(authenticationService.loggedIn === true)
            {

                if(image === "undefined" || !image) {

                image = getImgSvc.currentImageValue;
                //console.log("Image observable subscription triggered", image);
                }
                this.setState({avatar: image})
            }

        })
    }
    componentWillUnmount() {
        this.subscriptionProfileDropdown.unsubscribe();
        this.subscriptionImageSet.unsubscribe();
        this.subscriptionLogOut.unsubscribe();
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    logout() {
        authenticationService.logout();
        history.push('/');
    }

    render() {
        const NavbarBrandStyle = {
            fontSize: "50px",
            fontFamily: "Arial"
        }
        const name = this.state.name;
        const avatar = this.state.avatar;

        return (

            <Navbar color="light" expand="md" class="px-2">
                <NavbarBrand style={NavbarBrandStyle}>
                    ReactApp
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
                                        <Dropdown.Item>
                                            <Link to="/posts">View Posts</Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Link to="/profile">View/Edit Profile</Link>
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
