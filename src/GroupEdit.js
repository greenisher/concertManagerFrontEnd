import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, Container, Form, FormGroup, Input, Label } from "reactstrap";
import AppNavbar from "./AppNavbar";

class GroupEdit extends Component {
  emptyItem = {
    name: "",
    genre: "",
    concerts: ""
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== "new") {
      const group = await (await fetch(
        `https://concert-manager-api.herokuapp.com/api/group/${
          this.props.match.params.id
        }`
      )).json();
      this.setState({ item: group });
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = { ...this.state.item };
    item[name] = value;
    this.setState({ item });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { item } = this.state;

    await fetch("https://concert-manager-api.herokuapp.com/api/group", {
      method: item.id ? "PUT" : "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(item)
    });
    this.props.history.push("/groups");
  }

  render() {
    const { item } = this.state;
    const title = <h2>{item.id ? "Edit Group" : "Add Group"}</h2>;

    return (
      <div>
        <AppNavbar />
        <Container>
          {title}
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={item.name || ""}
                onChange={this.handleChange}
                autoComplete="name"
              />
            </FormGroup>
            <FormGroup>
              <Label for="genre">Genre</Label>
              <Input
                type="text"
                name="genre"
                id="genre"
                value={item.genre || ""}
                onChange={this.handleChange}
                autoComplete="genre"
              />
            </FormGroup>
            <FormGroup>
              <Label for="concerts">Concerts</Label>
              <Input
                type="text"
                name="concerts"
                id="concers"
                value={item.concerts || ""}
                onChange={this.handleChange}
                autoComplete="concerts"
              />
            </FormGroup>
            <FormGroup>
              <Button color="primary" type="submit">
                Save
              </Button>{" "}
              <Button color="secondary" tag={Link} to="/groups">
                Cancel
              </Button>
            </FormGroup>
          </Form>
        </Container>
      </div>
    );
  }
}

export default withRouter(GroupEdit);
