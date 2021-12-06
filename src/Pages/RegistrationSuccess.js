import React, { Component } from 'react';
import '../Styles/App.scss';
import AppNavbar from '../Components/AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import {Card} from "react-bootstrap";
import history from '../Components/history';

class RegistrationSuccess extends Component {

    openDlg() {
        history.push('/');
    }

    render() {
        const { state } = this.props.location;
        console.log(state);
        if(state === undefined) {
            history.push("/");
            return null;
        }
        else {
            return (
                <div>
                <Container>
                <div class = "row">
                    <div class = "col text-center">
                        Sign-up successful, please check email sent to <b>{state}</b> to finish registration process..
                    </div>
                </div>
                <div class = "row">
                    <div class = "col text-center">
                        <Button className={"btn-primary center"} onClick={this.openDlg}> Proceed </Button>
                    </div>
                </div>
                </Container>

                </div>
            );
        }
    }
}
export default RegistrationSuccess;