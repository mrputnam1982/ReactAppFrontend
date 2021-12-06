import React, {useState, Component} from 'react'
import {Button, Container, Row, Col} from 'react-bootstrap';
import '../Styles/UserModal.scss';
import UserModal from './UserModal';


export default class Landing extends Component{

    constructor(props) {
        super(props);
        this.state = {show: false, displayLogin: false};
        this.openLoginDlg = this.openLoginDlg.bind(this);
        this.openRegisterDlg = this.openRegisterDlg.bind(this);
        this.onCloseDlg = this.onCloseDlg.bind(this);
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
        const {show, displayLogin} = this.state;
        console.log("Landing Component", show, displayLogin);
        return(

            <div>

                <UserModal show={show} displayLogin={displayLogin} onHide={this.onCloseDlg}/>
                <Col style={{position: "absolute", bottom: "0"}}>
                    <Row>
                        <Col className="text-center">
                        <Button className="btn-primary"
                            onClick={this.openLoginDlg}>
                            Login
                        </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-center">
                        <Button className={"link-style btn-secondary"}
                            style={{outline: "none"}}
                            onClick={this.openRegisterDlg}>
                            Don't have an account? Register Here..
                        </Button>
                        </Col>
                     </Row>
                </Col>
            </div>
        )
    }
}