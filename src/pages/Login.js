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
import { loginMutation } from "../graphql/mutations";
import catchAsync from "../utils/catchAsync";
import saveTokens from "../utils/saveTokens";

class Login extends Component {
  state = {
    form: {
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
        login: { success, errors, token, refreshToken }
      }
    } = await mutate({ variables: { ...form } });
    if (!success) return await this.setState({ loading: false, errors });
    await this.setState({
      loading: false,
      errors: [],
      form: { email: "", password: "" }
    });
    saveTokens(token, refreshToken);
    history.push("/view-team");
  });

  renderErrorMessages = errors => {
    return errors.map(err => err.message);
  };

  showInputError = (errors, type) => {
    return errors.filter(err => err.path === type).length;
  };

  render() {
    const {
      form: { email, password },
      loading,
      errors
    } = this.state;
    return (
      <Container>
        <div className="u-page-content-center">
          <div className="u-page-container">
            <Header as="h3">Login</Header>
            <Divider />
            <Form onSubmit={this.handleFormSubmit}>
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
                  Let me in!
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

export default graphql(loginMutation)(Login);
