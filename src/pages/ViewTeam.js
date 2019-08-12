import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Redirect } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import MainContent from "../components/MainContent";
import MainUserContent from "../components/MainUserContent";
import Sidebar from "../components/Sidebar";
import { meQuery } from "../graphql/queries";

class ViewTeam extends Component {
  render() {
    const {
      data: { loading, me },
      match: {
        params: { channelId, teamId, userId }
      }
    } = this.props;
    if (loading) return "Loading...";
    if (me && !me.teams.length) return <Redirect to="/create-team" />;
    const team = teamId ? me.teams.find(t => t.id === teamId) : me.teams[0];
    const channel = channelId
      ? team.channels.find(c => c.id === channelId)
      : team.channels[0];
    const member = userId
      ? team.members.find(m => m.id === userId)
      : team.members[0];
    return (
      <AppLayout className="app-layout">
        <Sidebar
          key="sidebar"
          team={team}
          teams={me.teams}
          username={me.username}
          channels={team.channels}
          users={team.users}
        />
        {userId ? (
          <MainUserContent key="main-user-content" member={member} />
        ) : (
          <MainContent key="main-content" channel={channel} />
        )}
      </AppLayout>
    );
  }
}

export default graphql(meQuery, {
  options: {
    fetchPolicy: "network-only"
  }
})(ViewTeam);
