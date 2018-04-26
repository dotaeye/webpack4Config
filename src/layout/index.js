import React from "react";
import { getCommonName } from "../example/common";
import { Home, About, Topics } from "../example";

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      userRole: "guest"
    };
  }

  componentWillMount() {
    this.checkLogin();
  }

  checkLogin() {
    setTimeout(() => {
      this.setState(
        {
          login: true,
          userRole: "admin"
        },
        1500
      );
    });
  }

  render() {
    const { login } = this.state;
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">{getCommonName(SERVICE_URL)}</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/topics">Topics</Link>
            </li>
          </ul>

          <hr />

          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/login" component={Login} />
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
    const { isAuthed, component: Component, ...rest } = this.props;

    return (
      <Route
        {...rest}
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
  state = {
    redirectToReferrer: false
  };

  login = () => {
    this.setState({ redirectToReferrer: true });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={this.login}>Log in</button>
      </div>
    );
  }
}
