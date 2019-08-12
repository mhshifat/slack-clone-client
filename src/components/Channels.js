import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";
import AddChannelModal from "./modals/AddChannelModal";
import DirectMessageModal from "./modals/DirectMessageModal";
import InvitePeopleModal from "./modals/InvitePeopleModal";

const ChannelsWrapper = styled.div`
  grid-column: 2;
  grid-row: 1 / 4;
  background-color: #4e3a4c;
  color: #958993;
  padding-top: 10px;
`;

const TeamNameHeader = styled.h1`
  color: #fff;
  font-size: 20px;
`;

const SideBarList = styled.ul`
  width: 100%;
  list-style: none;
  padding-left: 0px;
`;

const paddingLeft = "padding-left: 10px";

const SideBarListItem = styled.li`
  padding: 2px;
  ${paddingLeft};
  &:hover {
    background: #3e313c;
  }
`;

const SideBarListHeader = styled.li`
  ${paddingLeft};
`;

const PushLeft = styled.div`
  ${paddingLeft};
`;

const Green = styled.span`
  color: #38978d;
`;

const Bubble = ({ on = true }) => (on ? <Green>●</Green> : "○");

const channel = ({ id, name }, teamId) => (
  <Link key={`channel-${id}`} to={`/view-team/${teamId}/${id}`}>
    <SideBarListItem># {name}</SideBarListItem>
  </Link>
);

const user = ({ id, username }, team) => (
  <Link
    style={{
      display: team.members.every(m => m.username !== username) && "none"
    }}
    key={`channel-${id}`}
    to={`/view-team/user/${team.id}/${id}`}
  >
    <SideBarListItem>
      <Bubble /> {username}
    </SideBarListItem>
  </Link>
);

class Channels extends Component {
  state = {
    showAddChannelModal: false,
    showInvitePeopleModal: false,
    showDirectMessageModal: false
  };

  handleAddChannelModalState = e => {
    if (e) e.preventDefault();
    this.setState(state => ({
      showAddChannelModal: !state.showAddChannelModal
    }));
  };

  handleInvitePeopleModalState = e => {
    if (e) e.preventDefault();
    this.setState(state => ({
      showInvitePeopleModal: !state.showInvitePeopleModal
    }));
  };

  handleDirectMessageModalState = e => {
    if (e) e.preventDefault();
    this.setState(state => ({
      showDirectMessageModal: !state.showDirectMessageModal
    }));
  };

  render() {
    const {
      showAddChannelModal,
      showInvitePeopleModal,
      showDirectMessageModal
    } = this.state;
    const { teamName, userName, channels, users, team, members } = this.props;
    return (
      <React.Fragment>
        <ChannelsWrapper>
          <PushLeft>
            <TeamNameHeader>{teamName}</TeamNameHeader>
            {userName}
          </PushLeft>
          <SideBarList>
            <SideBarListHeader>
              Channels{" "}
              {userName === team.owner.username && (
                <Icon
                  name="add circle"
                  onClick={this.handleAddChannelModalState}
                />
              )}
            </SideBarListHeader>
            {channels.map(c => channel(c, team.id))}
          </SideBarList>
          <SideBarList>
            <SideBarListHeader>
              Direct Messages{" "}
              <Icon
                name="add circle"
                onClick={this.handleDirectMessageModalState}
              />
            </SideBarListHeader>
            {users.map(u => user(u, team))}
          </SideBarList>
          {userName === team.owner.username && (
            <PushLeft>
              <span
                style={{ textDecoration: "underline", cursor: "pointer" }}
                onClick={this.handleInvitePeopleModalState}
              >
                Invite People
              </span>
            </PushLeft>
          )}
        </ChannelsWrapper>
        <AddChannelModal
          key="channel-modal"
          team={team}
          state={showAddChannelModal}
          closeModal={this.handleAddChannelModalState}
        />
        <InvitePeopleModal
          key="invite-people-modal"
          team={team}
          state={showInvitePeopleModal}
          closeModal={this.handleInvitePeopleModalState}
        />
        <DirectMessageModal
          key="direct-message-modal"
          state={showDirectMessageModal}
          closeModal={this.handleDirectMessageModalState}
          members={members}
          team={team}
        />
      </React.Fragment>
    );
  }
}

export default Channels;
