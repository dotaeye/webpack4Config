import React from "react";
import PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Loadable from "react-loadable";
import { hot } from "react-hot-loader";
import { getCommonName } from "./common";
import styles from "./index.less";
import Loading from "./Loading";

const LoadableComponent = Loadable({
  loader: () => import("./Topic"),
  loading: Loading
});

export const Home = () => (
  <div className={styles.home}>
    <h2>Home</h2>
  </div>
);

export const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

export const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>Rendering with React</Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={LoadableComponent} />
    <Route
      exact
      path={match.url}
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
);

class TestLayout extends React.Component {
  static childContextTypes = {
    onLogin: PropTypes.func
  };
  state = {
    login: false,
    userRole: "guest"
  };

  getChildContext() {
    return {
      onLogin: this.onLogin
    };
  }

  componentWillMount() {
    this.checkLogin();
  }

  checkLogin = () => {
    setTimeout(() => {
      this.setState({
        login: false,
        userRole: "guest"
      });
    }, 1500);
  };

  onLogin = () => {
    this.setState({
      login: true,
      userRole: "admin"
    });
  };

  render() {
    const { login, userRole } = this.state;
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">{getCommonName(SERVICE_URL)}</Link>
            </li>
            <li>
              <Link to="/about">asdasdasd</Link>
            </li>
            <li>
              <Link to="/topics">Topics</Link>
            </li>
          </ul>

          <hr />

          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/login" component={Login} onLogin={this.onLogin} />
          <PrivateRoute
            path="/topics"
            component={Topics}
            isAuthed={login && userRole === "admin"}
          />
        </div>
      </Router>
    );
  }
}

class PrivateRoute extends React.Component {
  render() {
    const { isAuthed, component: Component, ...otherProps } = this.props;

    return (
      <Route
        {...otherProps}
        render={props =>
          isAuthed ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          )
        }
      />
    );
  }
}

class Login extends React.Component {
  static contextTypes = {
    onLogin: PropTypes.func
  };

  state = {
    redirectToReferrer: false
  };

  login = () => {
    this.setState({ redirectToReferrer: true }, () => {
      this.context.onLogin();
    });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <p>You must log in to view the page asdasd at {from.pathname}</p>
        <button onClick={this.login}>Log in</button>
      </div>
    );
  }
}

export default hot(module)(TestLayout);
