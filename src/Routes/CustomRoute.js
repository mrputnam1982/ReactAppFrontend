import {authenticationService as auth} from '../services/authenticationService';
import {Route, Redirect, useParams} from 'react-router-dom';
export const CustomRoute = ({ comp: Component, ...rest }) =>
  (
    <Route {...rest} render={(props) => {
       if(rest.path === '/' && auth.loggedIn    ) auth.logout();
       else return <Component {...props}/>
    }} />
  );