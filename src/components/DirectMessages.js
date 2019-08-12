import moment from "moment";
import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Comment } from "semantic-ui-react";
import styled from "styled-components";
import { directMessagesQuery } from "../graphql/queries";
import { newDirectMessageSubscription } from "../graphql/subscriptions";

const MessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 2;
  padding: 20px;
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
`;

class DirectMessages extends Component {
  componentWillMount = () => {
    this.unsubscribe = this.subscribe(this.props.receiverId);
  };

  componentDidUpdate = () => {
    if (this.unsubscribe) this.unsubscribe();
    this.unsubscribe = this.subscribe(this.props.receiverId);
  };

  componentWillUnmount = () => {
    if (this.unsubscribe) this.unsubscribe();
  };

  subscribe = receiverId => {
    return this.props.data.subscribeToMore({
      document: newDirectMessageSubscription,
      variables: { receiverId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;
        return {
          ...prev,
          directMessages: [
            ...prev.directMessages,
            subscriptionData.data.newDirectMessage
          ]
        };
      }
    });
  };

  render() {
    const {
      data: { loading, directMessages }
    } = this.props;
    if (loading) return "Loading...";
    return (
      <MessageWrapper>
        <Comment.Group>
          {directMessages &&
            directMessages.map(m => (
              <Comment key={`message-${m.id}`}>
                <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
                <Comment.Content>
                  <Comment.Author as="a">{m.sender.username}</Comment.Author>
                  <Comment.Metadata>
                    <div>{moment.unix(m.createdAt).format("HH:mm")}</div>
                  </Comment.Metadata>
                  <Comment.Text>{m.message}</Comment.Text>
                </Comment.Content>
              </Comment>
            ))}
        </Comment.Group>
      </MessageWrapper>
    );
  }
}

export default graphql(directMessagesQuery, {
  variables: props => ({ receiverId: props.receiverId }),
  options: {
    fetchPolicy: "network-only"
  }
})(DirectMessages);
