import React, { Component } from "react";
import { graphql } from "react-apollo";
import { withRouter } from "react-router-dom";
import { Button, Form, Input, Message, Modal } from "semantic-ui-react";
import { addMemberToTeamMutation } from "../../graphql/mutations";
import { meQuery } from "../../graphql/queries";
import catchAsync from "../../utils/catchAsync";

class InvitePeopleModal extends Component {
  state = {
    form: {
      email: ""
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

  closeInvitePeopleModal = e => {
    if (e) e.preventDefault();
    this.props.closeModal();
  };

  handleFormSubmit = catchAsync(async e => {
    e.preventDefault();
    const { form } = this.state;
    const { mutate, team } = this.props;
    await this.setState({ loading: true });
    const {
      data: {
        addMemberToTeam: { success, errors }
      }
    } = await mutate({
      variables: { ...form, teamId: team.id },
      update: (
        store,
        {
          data: {
            addMemberToTeam: { success, member }
          }
        }
      ) => {
        if (!success) return;
        const data = store.readQuery({ query: meQuery });
        const teamIdx = data.me.teams.findIndex(t => t.id === team.id);
        data.me.teams[teamIdx].members.push(member);
        store.writeQuery({ query: meQuery, data });
      }
    });
    if (!success) return await this.setState({ loading: false, errors });
    await this.setState({
      loading: false,
      errors: [],
      form: { email: "" }
    });
    this.closeInvitePeopleModal();
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
      form: { email },
      loading,
      errors
    } = this.state;
    return (
      <Modal open={state}>
        <Modal.Header>Add a User to the Team</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleFormSubmit}>
            <Form.Field error={!!this.showInputError(errors, "name")}>
              <Input
                type="email"
                fluid
                autoComplete="off"
                autoFocus
                placeholder="User email"
                value={email}
                onChange={this.handleInputChange}
                name="email"
              />
            </Form.Field>
            <Form.Group>
              <Button
                disabled={loading}
                color="red"
                onClick={this.closeInvitePeopleModal}
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

export default graphql(addMemberToTeamMutation)(withRouter(InvitePeopleModal));
