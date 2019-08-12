import React, { Component } from "react";
import Channels from "./Channels";
import Teams from "./Teams";

class Sidebar extends Component {
  render() {
    const { team, teams, channels, users, username } = this.props;
    return (
      <React.Fragment>
        <Teams key="teams" teams={teams} />
        <Channels
          key="channels"
          teamName={team.name}
          team={team}
          userName={username}
          channels={channels}
          users={users}
          members={team.members}
        />
      </React.Fragment>
    );
  }
}

export default Sidebar;
