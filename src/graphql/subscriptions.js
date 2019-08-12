import gql from "graphql-tag";

export const newMessageSubscription = gql`
  subscription($channelId: ID!) {
    newMessage(channelId: $channelId) {
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

export const newDirectMessageSubscription = gql`
  subscription($receiverId: ID!) {
    newDirectMessage(receiverId: $receiverId) {
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
  }
`;
