import React from "react";
import jsforce from "../../../../../../lib/browser/jsforce";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
        };
        jsforce.browser.init({
            clientId: process.env.SALESFORCE_CONSUMER_KEY,
            redirectUri: window.location.href,
            loginUrl: "https://test.salesforce.com"
        });
    }

    componentDidMount() {
        jsforce.browser.on("connect", this.getUser.bind(this));
    }

    getUser(connection) {
        connection.identity((error, response) => {
            if (error) {
                return;
            }
            this.setState({
                user: response,
            });
        });
    }

    render() {
        return (
            <div className="App">
                <h1>JSForce React Test</h1>
                <p>
                    <span>Welcome to the JSForce React test.</span>
                    {jsforce.browser.isLoggedIn() ? (
                        <span>
                            You are currently logged in as
                            {this.state.user.username}
                        </span>
                    ) : (
                        <span>
                            You are not logged in yet,
                            <button onClick={() => jsforce.browser.login()}>
                                Click Here
                            </button>
                            to login.
                        </span>
                    )}
                </p>
            </div>
        );
    }
}

export default App;
