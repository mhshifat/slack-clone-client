import Downshift from "downshift";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  List,
  ListItem,
  Modal,
  Segment
} from "semantic-ui-react";

class DirectMessageModal extends Component {
  closeDirectMessageModal = e => {
    if (e) e.preventDefault();
    this.props.closeModal();
  };

  render() {
    const { state, members, team } = this.props;
    return (
      <Modal open={state}>
        <Modal.Content>
          <Form onSubmit={this.handleFormSubmit}>
            <Form.Field>
              <Downshift
                onChange={selection => {
                  this.closeDirectMessageModal();
                  this.props.history.push(
                    `/view-team/user/${team.id}/${selection.id}`
                  );
                }}
                itemToString={item => (item ? item.username : "")}
              >
                {({
                  getInputProps,
                  getItemProps,
                  getLabelProps,
                  getMenuProps,
                  isOpen,
                  inputValue,
                  highlightedIndex,
                  selectedItem
                }) => (
                  <div>
                    <Input
                      fluid
                      autoFocus
                      {...getInputProps({
                        placeholder: "Select a User to Chat"
                      })}
                    />
                    {isOpen && (
                      <Segment stacked>
                        <List {...getMenuProps()}>
                          {isOpen
                            ? members
                                .filter(
                                  item =>
                                    !inputValue ||
                                    item.username.includes(inputValue)
                                )
                                .map((item, index) => (
                                  <ListItem
                                    {...getItemProps({
                                      key: item.id,
                                      index,
                                      item,
                                      style: {
                                        backgroundColor:
                                          highlightedIndex === index
                                            ? "lightgray"
                                            : "white",
                                        fontWeight:
                                          selectedItem === item
                                            ? "bold"
                                            : "normal",
                                        cursor: "pointer",
                                        padding: "10px 0"
                                      }
                                    })}
                                  >
                                    {item.username}
                                  </ListItem>
                                ))
                            : null}
                        </List>
                      </Segment>
                    )}
                  </div>
                )}
              </Downshift>
            </Form.Field>
            <Form.Field>
              <Button color="red" onClick={this.closeDirectMessageModal} fluid>
                Cancel
              </Button>
            </Form.Field>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

export default withRouter(DirectMessageModal);
