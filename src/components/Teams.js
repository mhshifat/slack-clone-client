import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Divider, Icon } from "semantic-ui-react";
import styled from "styled-components";
import logoutTheUser from "../utils/logoutTheUser";

const TeamsWrapper = styled.div`
  grid-column: 1;
  grid-row: 1 / 4;
  background-color: #362234;
  color: #958993;
`;

const TeamList = styled.ul`
  width: 100%;
  padding-left: 0px;
  list-style: none;
`;

const TeamListItem = styled.li`
  height: 35px;
  width: 35px;
  background-color: #676066;
  color: #fff;
  margin: auto;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border-radius: 3px;
  font-weight: bold;
  & i {
    margin: 0;
    cursor: pointer;
    color: #fff;
  }
  & a {
    color: #958993;
  }
`;

const team = ({ id, name }) => (
  <Link key={`team-${id}`} to={`/view-team/${id}`}>
    <TeamListItem>{name.charAt(0).toUpperCase()}</TeamListItem>
  </Link>
);

class Teams extends Component {
  HandleUserLogout = () => {
    logoutTheUser();
    this.props.history.push("/login");
  };

  render() {
    const { teams } = this.props;
    return (
      <TeamsWrapper>
        <TeamList>
          <TeamList>
            <TeamListItem>
              <Link to="/create-team">
                <Icon name="add circle" size="small" />
              </Link>
            </TeamListItem>
          </TeamList>
          <Divider />
          {teams.map(team)}
          <Divider />
          <TeamListItem onClick={this.HandleUserLogout}>
            <Icon name="power off" size="small" />
          </TeamListItem>
        </TeamList>
      </TeamsWrapper>
    );
  }
}

export default withRouter(Teams);
