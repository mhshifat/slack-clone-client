import gql from "graphql-tag";

export const getUsersQuery = gql`
  query {
    getUsers {
      id
      username
      email
    }
  }
`;

export const meQuery = gql`
  query {
    me {
      id
      username
      email
      teams {
        id
        name
        owner {
          id
          username
          email
        }
        channels {
          id
          name
          public
        }
        members {
          id
          username
          email
        }
        users {
          id
          username
          email
        }
      }
    }
  }
`;

export const messagesQuery = gql`
  query($channelId: ID!) {
    messages(channelId: $channelId) {
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
  }
`;

export const directMessagesQuery = gql`
  query($receiverId: ID!) {
    directMessages(receiverId: $receiverId) {
      id
      message
      createdAt
      receiver {
        id
        username
        email
      }
      sender {
        id
        username
        email
      }
    }
  }
`;
