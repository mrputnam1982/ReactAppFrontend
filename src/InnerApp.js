import React, {Component} from 'react';
import { Route, Routes, Navigate} from 'react-router-dom';
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
import {authenticationService as auth} from './services/authenticationService';
export default class InnerApp extends React.PureComponent{

    render() {

        return (
            <div>

                  <div>
                  <AppNavbar/>
                  <Routes>
                    <Route path='/'
                        element={
                            <customRoute path="/">
                                <Home/>
                            </customRoute>
                        }

                    />
                    <Route path='/posts'
                        element={
                            <requireAuth redirectTo="/">
                                <Posts/>
                            </requireAuth>
                        }
                    />
                    <Route path='/posts/edit/:id'
                        element={
                            <requireAuth redirectTo="/">
                                <PostEdit/>
                            </requireAuth>
                        }
                    />
                    <Route path='/posts/view/:id'
                        element= {
                            <requireAuth redirectTo="/">
                                <PostView/>
                            </requireAuth>
                        }
                    />
                    <Route path='/registration'
                        element={
                            <requireAuth redirectTo="/">
                                <RegistrationSuccess/>
                            </requireAuth>
                        }
                    />
                    <Route path='/profile'
                        element={
                            <requireAuth redirectTo="/">
                                <Profile/>
                            </requireAuth>
                        }
                    />
                  </Routes>
                  </div>

            </div>
        );
    }
}

function requireAuth({children, redirectTo}) {
    return auth.loggedIn === true
        ? children
        : <Navigate to={redirectTo}/>
}

function customRoute({children, path}) {

    if(path === '/' && auth.loggedIn ) auth.logout();
    else return children;

}