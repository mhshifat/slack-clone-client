import React, { Component } from "react";
import { graphql } from "react-apollo";
import { withRouter } from "react-router-dom";
import { Button, Form, Input, Message, Modal } from "semantic-ui-react";
import { createChannelMutation } from "../../graphql/mutations";
import { meQuery } from "../../graphql/queries";
import catchAsync from "../../utils/catchAsync";

class AddChannelModal extends Component {
  state = {
    form: {
      name: ""
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

  closeAddChannelModal = e => {
    if (e) e.preventDefault();
    this.props.closeModal();
  };

  handleFormSubmit = catchAsync(async e => {
    e.preventDefault();
    const { form } = this.state;
    const { mutate, history, team } = this.props;
    await this.setState({ loading: true });
    const {
      data: {
        createChannel: { success, errors, channel }
      }
    } = await mutate({
      variables: { ...form, teamId: team.id },
      update: (
        store,
        {
          data: {
            createChannel: { success, channel }
          }
        }
      ) => {
        if (!success) return;
        const data = store.readQuery({ query: meQuery });
        const teamIdx = data.me.teams.findIndex(t => t.id === team.id);
        data.me.teams[teamIdx].channels.push(channel);
        store.writeQuery({ query: meQuery, data });
      }
    });
    if (!success) return await this.setState({ loading: false, errors });
    await this.setState({
      loading: false,
      errors: [],
      form: { name: "" }
    });
    this.closeAddChannelModal();
    history.push(`/view-team/${team.id}/${channel.id}`);
  });

  renderErrorMessages = errors => {
    return errors.map(err => err.message);
  };

  showInputError = (errors, type) => {
    return errors.filter(err => err.path === type).length;
  };

  render() {
    const { state } = this.props;
    const {
      form: { name },
      loading,
      errors
    } = this.state;
    return (
      <Modal open={state}>
        <Modal.Header>Add a new Channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleFormSubmit}>
            <Form.Field error={!!this.showInputError(errors, "name")}>
              <Input
                type="text"
                fluid
                autoComplete="off"
                autoFocus
                placeholder="Channel name"
                value={name}
                onChange={this.handleInputChange}
                name="name"
              />
            </Form.Field>
            <Form.Group>
              <Button
                disabled={loading}
                color="red"
                onClick={this.closeAddChannelModal}
                fluid
              >
                Cancel
              </Button>
              <Button
                loading={loading}
                color="green"
                onClick={this.handleFormSubmit}
                fluid
              >
                Add Channel
              </Button>
            </Form.Group>
          </Form>
          {!!errors.length && (
            <Message
              error
              header="There was some errors with your submission"
              list={this.renderErrorMessages(errors)}
            />
          )}
        </Modal.Content>
      </Modal>
    );
  }
}

export default graphql(createChannelMutation)(withRouter(AddChannelModal));
