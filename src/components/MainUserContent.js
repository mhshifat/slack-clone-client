import React, { Component } from "react";
import DirectMessages from "./DirectMessages";
import Header from "./Header";
import SendDirectMessage from "./SendDirectMessage";

class MainUserContent extends Component {
  render() {
    const { member } = this.props;
    return (
      <React.Fragment>
        <Header key="header" headerContent={member.username} />
        <DirectMessages key="direct-message" receiverId={member.id} />
        <SendDirectMessage
          key="send-direct-message"
          placeholderContent={`Message ${member.username}`}
          userId={member.id}
        />
      </React.Fragment>
    );
  }
}

export default MainUserContent;
