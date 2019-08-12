import React, { Component } from "react";
import { graphql } from "react-apollo";
import {
  Button,
  Container,
  Divider,
  Form,
  Header,
  Input,
  Message
} from "semantic-ui-react";
import { createTeamMutation } from "../graphql/mutations";
import catchAsync from "../utils/catchAsync";

class CreateTeam extends Component {
  state = {
    form: {
      name: ""
    },
    errors: [],
    loading: false
  };

  handleFormInputChange = async e => {
    const { name, value } = e.target;
    const { form, errors } = this.state;
    await this.setState({ form: { ...form, [name]: value } });
    const newErrors = errors.filter(err => err.path !== name);
    await this.setState({ errors: newErrors });
  };

  handleFormSubmit = catchAsync(async e => {
    e.preventDefault();
    const { form } = this.state;
    const { mutate, history } = this.props;
    await this.setState({ loading: true });
    const {
      data: {
        createTeam: { success, errors, team }
      }
    } = await mutate({ variables: { ...form } });
    if (!success) return await this.setState({ loading: false, errors });
    await this.setState({
      loading: false,
      errors: [],
      form: { name: "" }
    });
    history.push(`/view-team/${team.id}`);
  });

  renderErrorMessages = errors => {
    return errors.map(err => err.message);
  };

  showInputError = (errors, type) => {
    return errors.filter(err => err.path === type).length;
  };

  render() {
    const {
      form: { name },
      loading,
      errors
    } = this.state;
    return (
      <Container>
        <div className="u-page-content-center">
          <div className="u-page-container">
            <Header as="h3">Create a new Team</Header>
            <Divider />
            <Form onSubmit={this.handleFormSubmit}>
              <Form.Field error={!!this.showInputError(errors, "email")}>
                <Input
                  type="text"
                  name="name"
                  placeholder="Team name"
                  value={name}
                  onChange={this.handleFormInputChange}
                />
              </Form.Field>

              <Form.Field>
                <Button
                  disabled={loading}
                  loading={loading}
                  fluid
                  color="instagram"
                >
                  Create Team!
                </Button>
              </Form.Field>
            </Form>
            {!!errors.length && (
              <Message
                error
                header="There was some errors with your submission"
                list={this.renderErrorMessages(errors)}
              />
            )}
          </div>
        </div>
      </Container>
    );
  }
}

export default graphql(createTeamMutation)(CreateTeam);
