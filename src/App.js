import React, { Component, useState } from 'react';
import './Styles/App.scss'
import {createContext, useContext} from "react";
import {authenticationService as auth} from "./services/authenticationService";
import InnerApp from "./InnerApp";
//export function useAuth(){
//    return useContext(AuthContext);
//}


function App(props) {
//    const [showModal, setShowModal] = useState(false);
//    subscribeModal.subscribe(() => {
//        setShowModal(prev => !prev);
//    })

    const existingTokens = JSON.parse(localStorage.getItem("tokens"));
    const [authTokens,setAuthTokens] = useState(existingTokens || null);

    const setTokens = (data) => {
        console.log("setting tokens in localStorage");
        localStorage.setItem("tokens",JSON.stringify(data));
        setAuthTokens(data);
    }
    return(

            <InnerApp/>
    );
}

export default App;

