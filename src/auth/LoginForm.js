import React, { Component} from 'react'
import PropTypes from 'prop-types'
//import Input from '../Input'
import {Card,Form,Button,Col, Alert} from "react-bootstrap"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave,faPlusSquare,faUndo} from "@fortawesome/free-solid-svg-icons"
import {Link} from "react-router-dom"
import {authenticationService as auth} from '../services/authenticationService'
import {getImageService as getImgSvc} from '../services/getImageService'
import history from '../Components/history';
import Cookies from 'universal-cookie';
import {getNameService as getNameSvc} from '../services/getNameService'
export default class LoginForm extends Component {

    //...
    constructor(props) {
        super(props);
        this.state = {email: "", password: "", show: false, loginFail: false,
            verificationError: false};

//        if(props.error) {
//            this.state = {
//              failure: 'wrong username or password!',
//              errcount: 0
//            }
//        } else {
//            this.state = { errcount: 0 }
//        }
          this.handleSubmit = this.handleSubmit.bind(this);
          this.resendVerificationEmail = this.resendVerificationEmail.bind(this);
    }

    resetUser=() => {
    this.setState({email: "", password: ""});
    }

    async resendVerificationEmail() {
        const promise = await auth.resendVerificationEmail(this.state.email, this.state.password);
        
        this.setState({verificationError: false});
    }
    async handleSubmit(event) {
        var image = "";
        //console.log(this.state.password);
        const promise = await auth.login(this.state.email, this.state.password)
        console.log("Loginform", auth.loggedIn);
        console.log(promise);
        if(auth.loggedIn) {
            getNameSvc.setName(promise.name);
            getNameSvc.setRole(promise.roles[0]);
            if(promise.image) getImgSvc.setImage(promise.image.strBase64File)
            else getImgSvc.setImage("");
            this.setState({loginFail: false});;
            history.push('/posts');
        }
        else {
            
            if(auth.verificationError) {
                this.setState({verificationError: true})
            }
            else this.setState({password: "", loginFail: true});
        }
    }


//    handleError = (field, errmsg) => {
//        if(!field) return
//
//        if(errmsg) {
//            this.setState((prevState) => ({
//                failure: '',
//                errcount: prevState.errcount + 1,
//                errmsgs: {...prevState.errmsgs, [field]: errmsg}
//            }))
//        } else {
//            this.setState((prevState) => ({
//                failure: '',
//                errcount: prevState.errcount===1? 0 : prevState.errcount-1,
//                errmsgs: {...prevState.errmsgs, [field]: ''}
//            }))
//        }
//    }

    userChange = (event) =>{
        this.setState({
            [event.target.name]:event.target.value
        })
    };

    onKeyDown = (event) => {
        if(event.key === 'Enter') this.handleSubmit();

    }
//    renderError = () => {
//        if(this.state.errcount || this.state.failure) {
//            const errmsg = this.state.failure
//              || Object.values(this.state.errmsgs).find(v=>v)
//            return <div className="error">{errmsg}</div>
//        }
//    }
    render() {
        let {email, password} = this.state;
        if(this.props.username) email = this.props.username;    
        return(
            <div>
            <Card className={"border border-dark bg-dark text-white"}>
                <Form onReset={this.resetUser} id="userFormId">
                <Card.Header>

                </Card.Header>
                <Card.Body>



                <Form.Group as= {Col} controlId="formGridemail">
                <Form.Label>Email</Form.Label>
                <Form.Control required autoComplete="off"
                type="email"
                name="email"
                value={email}
                onChange={this.userChange}

                onKeyDown={this.onKeyDown}
                className={"bg-light"}
                placeholder="Enter Email" />
                </Form.Group>

                <Form.Group as= {Col} controlId="formGridpassword">
                <Form.Label>Password</Form.Label>
                <Form.Control required autoComplete="off"
                type="password"
                name="password"
                value={password}
                onChange={this.userChange}
                onKeyDown={this.onKeyDown}
                className={"bg-light"}
                placeholder="Enter Password" />
                
                </Form.Group>

                <Card.Footer style={{"textAlign":"right"}}>
                {this.state.loginFail ? <Alert key='danger'> Invalid Credentials </Alert> : <div/>}
                {this.state.verificationError ?
                    <div> 
                    <Alert key='info'>
                        Verification Failed, send new confirmation link?
                        <Button size="sm" variant="secondary" onClick={this.resendVerificationEmail}>
                            Resend Email
                        </Button>
                    </Alert>
                    </div> : <div/>
                }
                <Button size="sm" variant="primary" onClick={this.handleSubmit}>
                <FontAwesomeIcon icon={faSave} />Submit
                </Button>{" "}
                </Card.Footer>
                </Card.Body>
                </Form>
            </Card>
            </div>
    	);


    }

}

LoginForm.propTypes = {
  name: PropTypes.string,
  action: PropTypes.string,
  method: PropTypes.string,
  inputs: PropTypes.array,
  error: PropTypes.string
}
