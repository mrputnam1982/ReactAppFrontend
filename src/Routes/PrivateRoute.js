import {authenticationService as auth} from '../services/authenticationService';
import {Route, Navigate} from 'react-router-dom';
export const PrivateRoute = ({ comp: Component, ...rest }) =>
  (
    <Route {...rest} render={(props) => {

      return auth.loggedIn === true
        ? <Component {...props}/>
        : <Navigate to='/'/>
    }} />
  );
