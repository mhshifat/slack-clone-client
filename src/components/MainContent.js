import React, { Component } from "react";
import Header from "./Header";
import Messages from "./Messages";
import SendMessage from "./SendMessage";

class MainContent extends Component {
  render() {
    const { channel } = this.props;
    return (
      <React.Fragment>
        <Header key="header" headerContent={channel.name} />
        <Messages key="messages" channelId={channel.id} />
        <SendMessage
          key="send-messages"
          placeholderContent={`Message #${channel.name}`}
          channelId={channel.id}
        />
      </React.Fragment>
    );
  }
}

export default MainContent;
