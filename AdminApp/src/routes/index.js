import NotFound from '../components/NotFound'
import { Switch, Route, Redirect, BrowserRouter as Router } from 'react-router-dom';
import routes from './routes'
import AuthLayout from "../layout/AuthLayout";
import PrivateLayout from "../layout/PrivateLayout";

const MainRoutes = (props) => {

    const AuthLayoutRoute = ({ component: Component, ...rest }) => {
        return (
            <Route
                {...rest}
                render={(matchProps) => (
                    <AuthLayout>
                        <Component {...matchProps} />
                    </AuthLayout>
                )}
            />
        );
    };

    const PrivateLayoutRoute = ({ component: Component, path, ...rest }) => {
        return (
            <Route
                {...rest}
                render={(matchProps) => (
                    <PrivateLayout>
                        <Component {...matchProps} />
                    </PrivateLayout>
                )}
            />
        );
    };

    return (
        <Router>
            <Switch>
                {routes.filter(route => route.layout == "AuthLayoutRoute").map((route, index) => (
                    <AuthLayoutRoute exact={route.exact} path={route.path} component={route.component} key={index} />
                ))}
                {routes.filter(route => route.layout == "PrivateLayoutRoute").map((route, index) => (
                    <PrivateLayoutRoute exact={route.exact} path={route.path} component={route.component} key={index} />
                ))}
                <Route path='*' component={NotFound} />
            </Switch>

        </Router>
    )
}

export default MainRoutes;
