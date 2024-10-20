import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import BaseRouter from "./routes";
import Sidepanel from "./containers/Sidepanel";
import Profile from "./containers/Profile";
import AddChatModal from "./containers/Popup";
import * as actions from "./store/actions/auth";
import * as navActions from "./store/actions/nav";
import * as messageActions from "./store/actions/message";
import WebSocketInstance from "./websocket";
import "./assets/style.css";
import 'antd/dist/reset.css';

class App extends React.Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  constructor(props) {
    super(props);
    WebSocketInstance.addCallbacks(
      this.props.setMessages.bind(this),
      this.props.addMessage.bind(this)
    );
  }

  render() {
    return (
      <Router>
        <div id="frame">
          <Sidepanel />
          <div className="content">
            {this.props.authenticated ? (
              <>
                <AddChatModal
                  isVisible={this.props.showAddChatPopup}
                  close={() => this.props.closeAddChatPopup()}
                />
                <Profile />
                <BaseRouter />
              </>
            ) : (
              <p>Please log in to continue.</p>
            )}
          </div>
        </div>
      </Router>
    );
  }

}

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  // Append the message to the chat window
  let chatWindow = document.querySelector('.messages');
  let messageHTML = `<li class="sent">
    <img src="https://placehold.it/50/55C1E7/fff&text=USER" alt="" />
    <p>${data.message}</p>
  </li>`;

  chatWindow.innerHTML += messageHTML;
  
  // Scroll to the bottom
  chatWindow.scrollTop = chatWindow.scrollHeight;
};

const mapStateToProps = state => {
  return {
    showAddChatPopup: state.nav.showAddChatPopup,
    authenticated: state.auth.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
    closeAddChatPopup: () => dispatch(navActions.closeAddChatPopup()),
    addMessage: message => dispatch(messageActions.addMessage(message)),
    setMessages: messages => dispatch(messageActions.setMessages(messages))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
