import React, {useState, Component} from 'react'
import ReactDOM from 'react-dom';
import {Button, Container, Row, Col} from 'react-bootstrap';
import '../Styles/UserModal.scss';
import UserModal from './UserModal';

export default class Landing extends Component{

    constructor(props) {
        super(props);
        this.state = {show: false, displayLogin: false, height: 0, width: 0};
        this.openLoginDlg = this.openLoginDlg.bind(this);
        this.openRegisterDlg = this.openRegisterDlg.bind(this);
        this.onCloseDlg = this.onCloseDlg.bind(this);

        //window.addEventListener("resize", this.update);
    }

    update = () => {
        console.log("Login Button position within window", ReactDOM
            .findDOMNode(this.refs['button'])
            .getBoundingClientRect());
        this.setState({height: window.innerHeight, width: window.innerWidth})
    }
    openLoginDlg(){
        this.setState({show: true, displayLogin: true});
    }

    openRegisterDlg(){
        this.setState({show: true, displayLogin: false});
    }

    onCloseDlg =() => {
        this.setState({show:false})
    }
    render() {
        const {show, displayLogin, height, width} = this.state;
        console.log("Landing Component", show, displayLogin);
        console.log("Window Dimensions:", width, "X", height);
        return(

            <div ref="root">

                <UserModal show={show} displayLogin={displayLogin} onHide={this.onCloseDlg}/>
                <Col style={{marginLeft: "auto",
                    marginRight: "auto"
                    }}>
                    <Container>

                    <Row>
                        <Col>
                        <Button ref="button" className={"btn-primary"}
                            onClick={this.openLoginDlg}>
                            Login
                        </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <Button className={"link-style btn-secondary"}
                            style={{outline: "none"}}
                            onClick={this.openRegisterDlg}>
                            Don't have an account? Register Here..
                        </Button>
                        </Col>
                     </Row>
                     </Container>
                </Col>

            </div>
        )
    }
}