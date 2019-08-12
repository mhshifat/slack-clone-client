import gql from "graphql-tag";

export const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(data: { email: $email, password: $password }) {
      success
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

export const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(
      data: { username: $username, email: $email, password: $password }
    ) {
      success
      user {
        id
        username
        email
      }
      errors {
        path
        message
      }
    }
  }
`;

export const createTeamMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      success
      team {
        id
        name
        owner {
          id
          username
          email
        }
      }
      errors {
        path
        message
      }
    }
  }
`;

export const createChannelMutation = gql`
  mutation($teamId: ID!, $name: String!) {
    createChannel(data: { teamId: $teamId, name: $name }) {
      success
      channel {
        id
        name
        public
      }
      errors {
        path
        message
      }
    }
  }
`;

export const addMemberToTeamMutation = gql`
  mutation($teamId: ID!, $email: String!) {
    addMemberToTeam(data: { teamId: $teamId, email: $email }) {
      success
      member {
        id
        username
        email
      }
      errors {
        path
        message
      }
    }
  }
`;

export const createMessageMutation = gql`
  mutation($message: String!, $channelId: ID!) {
    createMessage(data: { channelId: $channelId, message: $message }) {
      success
      message {
        id
        message
        createdAt
        channel {
          id
          name
          public
        }
        user {
          id
          username
          email
        }
      }
      errors {
        path
        message
      }
    }
  }
`;

export const createDirectMessageMutation = gql`
  mutation($message: String!, $receiverId: ID!) {
    createDirectMessage(data: { receiverId: $receiverId, message: $message }) {
      success
      directMessage {
        id
        message
        createdAt
        sender {
          id
          username
          email
        }
        receiver {
          id
          username
          email
        }
      }
      errors {
        path
        message
      }
    }
  }
`;
