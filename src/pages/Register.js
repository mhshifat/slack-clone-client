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
import { registerMutation } from "../graphql/mutations";
import catchAsync from "../utils/catchAsync";

class Register extends Component {
  state = {
    form: {
      username: "",
      email: "",
      password: ""
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
        register: { success, errors }
      }
    } = await mutate({ variables: { ...form } });
    if (!success) return await this.setState({ loading: false, errors });
    await this.setState({
      loading: false,
      errors: [],
      form: { username: "", email: "", password: "" }
    });
    history.push("/login");
  });

  renderErrorMessages = errors => {
    return errors.map(err => err.message);
  };

  showInputError = (errors, type) => {
    return errors.filter(err => err.path === type).length;
  };

  render() {
    const {
      form: { username, email, password },
      loading,
      errors
    } = this.state;
    return (
      <Container>
        <div className="u-page-content-center">
          <div className="u-page-container">
            <Header as="h3">Register</Header>
            <Divider />
            <Form onSubmit={this.handleFormSubmit}>
              <Form.Field error={!!this.showInputError(errors, "username")}>
                <Input
                  type="text"
                  name="username"
                  placeholder="Username"
                  autoFocus
                  value={username}
                  onChange={this.handleFormInputChange}
                />
              </Form.Field>

              <Form.Field error={!!this.showInputError(errors, "email")}>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={email}
                  onChange={this.handleFormInputChange}
                />
              </Form.Field>

              <Form.Field error={!!this.showInputError(errors, "password")}>
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
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
                  Create account!
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

export default graphql(registerMutation)(Register);
