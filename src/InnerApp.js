import React, {Component} from 'react';
import { Router, Route, Routes} from 'react-router-dom';
import { MemoryRouter } from 'react-router';
import Home from './Pages/Home';
import Posts from './Pages/Posts'
import Profile from './Pages/Profile'
import RegistrationSuccess from './Pages/RegistrationSuccess';
import RegistrationForm from './auth/RegistrationForm';
import LoginForm from './auth/LoginForm';
import UserModal from './Components/UserModal';
import PostEdit from "./Components/PostEdit";
import PostView from "./Components/PostView";
import AppNavbar from "./Components/AppNavbar";
import history from "./Components/history";
import {PrivateRoute} from './Routes/PrivateRoute';
import {CustomRoute} from './Routes/CustomRoute';
export default class InnerApp extends React.PureComponent{

    render() {

        return (
            <div>

                <Router history={history}>
                  <div>
                  <AppNavbar/>
                  <Routes>
                    <CustomRoute path='/' exact={true} comp={Home}/>
                    <PrivateRoute exact={true} path='/posts' comp={Posts}/>
                    <PrivateRoute exact={true} path='/posts/edit/' comp={PostEdit}/>
                    <PrivateRoute exact={true} path='/posts/view/' comp={PostView}/>
                    <PrivateRoute exact={true} path='/registration' comp={RegistrationSuccess}/>
                    <PrivateRoute exact={true} path='/profile' comp={Profile}/>
                  </Routes>
                  </div>
                </Router>

            </div>
        );
    }
}
//     <Toast onClose={this.setHideToast} show={this.state.showToast} delay={3000} autohide>
//                                  <Toast.Header>
//                                    <strong className="me-auto">Bootstrap</strong>
//                                    <small>11 mins ago</small>
//                                  </Toast.Header>
//                                  <Toast.Body>"Woohoo, you're reading this text in a Toast!"</Toast.Body>
//                             </Toast>