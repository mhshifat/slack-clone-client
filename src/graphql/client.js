import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink, split } from "apollo-link";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import saveTokens from "../utils/saveTokens";

const { REACT_APP_API_URI, REACT_APP_SUBSCRIPTION_URI } = process.env;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors && graphQLErrors.length) {
    graphQLErrors.forEach(err => {
      console.error(err.message);
    });
  }
  if (networkError) {
    console.error(networkError.message);
  }
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-token": localStorage.getItem("token"),
      "x-refresh-token": localStorage.getItem("refreshToken")
    }
  };
});

const afterWareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const {
      response: { headers }
    } = operation.getContext();
    const token = headers && headers.get("x-token");
    const refreshToken = headers && headers.get("x-refresh-token");
    if (token && refreshToken) {
      saveTokens(token, refreshToken);
    }
    return response;
  });
});

const httpLink = new HttpLink({
  uri: REACT_APP_API_URI || "http://localhost:5000/api"
});

const wsLink = new WebSocketLink({
  uri: REACT_APP_SUBSCRIPTION_URI || "ws://localhost:5000/subscription",
  options: {
    reconnect: true,
    connectionParams: {
      token: localStorage.getItem("token"),
      refreshToken: localStorage.getItem("refreshToken")
    }
  }
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  afterWareLink.concat(authLink.concat(errorLink.concat(httpLink)))
);

export default new ApolloClient({
  cache: new InMemoryCache(),
  link
});
