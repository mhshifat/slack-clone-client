import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Form, Input, Message } from "semantic-ui-react";
import styled from "styled-components";
import { createMessageMutation } from "../graphql/mutations";
import catchAsync from "../utils/catchAsync";

const SendMsgWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  padding: 20px;
`;

class SendMessage extends Component {
  state = {
    form: {
      message: ""
    },
    loading: false,
    errors: []
  };

  handleInputChange = async e => {
    const { name, value } = e.target;
    const { form, errors } = this.state;
    await this.setState({ form: { ...form, [name]: value } });
    const newErrors = errors.filter(err => err.path !== name);
    await this.setState({ errors: newErrors });
  };

  renderErrorMessages = errors => {
    return errors.map(err => err.message);
  };

  showInputError = (errors, type) => {
    return errors.filter(err => err.path === type).length;
  };

  handleFormSubmit = catchAsync(async e => {
    e.preventDefault();
    const { form } = this.state;
    const { mutate, channelId } = this.props;
    await this.setState({ loading: true });
    const {
      data: {
        createMessage: { success, errors }
      }
    } = await mutate({
      variables: { ...form, channelId }
    });
    if (!success) return await this.setState({ loading: false, errors });
    await this.setState({
      loading: false,
      errors: [],
      form: { message: "" }
    });
  });

  render() {
    const { placeholderContent } = this.props;
    const {
      form: { message },
      loading,
      errors
    } = this.state;
    return (
      <SendMsgWrapper>
        <Form onSubmit={this.handleFormSubmit}>
          <Form.Field error={!!this.showInputError(errors, "message")}>
            <Input
              fluid
              placeholder={placeholderContent}
              autoFocus
              value={message}
              disabled={loading}
              onChange={this.handleInputChange}
              name="message"
            />
          </Form.Field>
        </Form>
        {!!errors.length && (
          <Message
            error
            header="There was some errors with your submission"
            list={this.renderErrorMessages(errors)}
          />
        )}
      </SendMsgWrapper>
    );
  }
}

export default graphql(createMessageMutation)(SendMessage);
