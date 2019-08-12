import moment from "moment";
import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Comment } from "semantic-ui-react";
import styled from "styled-components";
import { messagesQuery } from "../graphql/queries";
import { newMessageSubscription } from "../graphql/subscriptions";

const MessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 2;
  padding: 20px;
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
`;

class Messages extends Component {
  componentWillMount = () => {
    this.unsubscribe = this.subscribe(this.props.channelId);
  };

  componentDidUpdate = () => {
    if (this.unsubscribe) this.unsubscribe();
    this.unsubscribe = this.subscribe(this.props.channelId);
  };

  componentWillUnmount = () => {
    if (this.unsubscribe) this.unsubscribe();
  };

  subscribe = channelId => {
    return this.props.data.subscribeToMore({
      document: newMessageSubscription,
      variables: { channelId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;
        return {
          ...prev,
          messages: [...prev.messages, subscriptionData.data.newMessage]
        };
      }
    });
  };

  render() {
    const {
      data: { loading, messages }
    } = this.props;
    if (loading) return "Loading...";
    return (
      <MessageWrapper>
        <Comment.Group>
          {messages &&
            messages.map(m => (
              <Comment key={`message-${m.id}`}>
                <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
                <Comment.Content>
                  <Comment.Author as="a">{m.user.username}</Comment.Author>
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

export default graphql(messagesQuery, {
  variables: {
    channelId: props => ({ channelId: props.channelId })
  },
  options: {
    fetchPolicy: "network-only"
  }
})(Messages);
