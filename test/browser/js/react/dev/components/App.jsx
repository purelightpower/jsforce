import React from "react";
import jsforce from "../../../../../../lib/browser/jsforce";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            accounts: null,
        };
        jsforce.browser.init({
            clientId: process.env.SALESFORCE_CONSUMER_KEY,
            redirectUri: window.location.href,
            loginUrl: "https://test.salesforce.com",
        });
    }

    componentDidMount() {
        jsforce.browser.on("connect", this.getData.bind(this));
        if (jsforce.browser.isLoggedIn()) {
            this.getData(jsforce.browser.connection);
        }
    }

    getData(connection) {
        this.getUser(connection)
            .catch(() => Promise.resolve())
            .then(() => this.getAccounts(connection));
    }

    getUser(connection) {
        return new Promise((resolve, reject) => {
            connection.identity((error, response) => {
                if (error) {
                    reject(error);
                } else {
                    this.setState({
                        user: response,
                    });
                    resolve(response);
                }
            });
        });
    }

    getAccounts(connection) {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT Id, Name FROM Account LIMIT 20",
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    this.setState({
                        accounts: res.records,
                    });
                    resolve(res.records);
                }
            );
        });
    }

    render() {
        const loggedIn = jsforce.browser.isLoggedIn();
        return (
            <div className="App">
                <h1>JSForce React Test</h1>
                <p>
                    <span>Welcome to the JSForce React test.</span>
                    {loggedIn ? (
                        this.state.user ? (
                            <span>
                                You are currently logged in as
                                {this.state.user.username}
                            </span>
                        ) : (
                            <span>
                                You are logged in, but there was an issue
                                finding your user information.
                            </span>
                        )
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
                <ul>
                    {loggedIn &&
                        this.state.accounts &&
                        this.state.accounts.map((account, index) => (
                            <li key={index}>{account.Name}</li>
                        ))}
                </ul>
            </div>
        );
    }
}

export default App;
