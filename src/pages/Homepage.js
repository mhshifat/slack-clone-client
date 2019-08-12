import React, { Component } from "react";
import { graphql } from "react-apollo";
import { getUsersQuery } from "../graphql/queries";

class Homepage extends Component {
  render() {
    const {
      data: { loading, getUsers = [] }
    } = this.props;
    if (loading) return "Loading...";
    return !getUsers.length ? (
      <div
        style={{
          padding: 30
        }}
      >
        <h4>Registered Users</h4>
        <hr />
        <div
          style={{
            paddingTop: 20
          }}
        >
          <p>No users found!</p>
        </div>
      </div>
    ) : (
      <div
        style={{
          padding: 30
        }}
      >
        <h4>Registered Users</h4>
        <hr />
        {getUsers.map(({ id, username, email }) => (
          <div key={id}>
            <ul>
              <li>{username}</li>
              <li>{email}</li>
            </ul>
          </div>
        ))}
      </div>
    );
  }
}

export default graphql(getUsersQuery)(Homepage);
