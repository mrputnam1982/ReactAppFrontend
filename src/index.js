import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import history from "./Components/history";
import {Router} from "react-router-dom";
import {CustomRouter} from "./Routes/CustomRouter";
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>

    <CustomRouter history={history}>
    <App/>
    </CustomRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
