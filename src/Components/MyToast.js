import React, {Component} from "react";
import {Modal} from "react-bootstrap";
export default class MyToast extends Component{

render(){

    return(
    <div>
    <Modal show={this.props.children.show}>
    <Modal.Header className={"bg-success text-white"} closeButton={true}>
    <strong className="mr-auto">Registration Successful</strong>
    </Modal.Header>
    <Modal.Body>
    {this.props.children.message}
    </Modal.Body>
    </Modal>
    </div>
    )
}}