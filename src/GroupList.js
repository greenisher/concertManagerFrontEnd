import React, { Component } from "react";
import { Button, ButtonGroup, Container, Table } from "reactstrap";
import AppNavbar from "./AppNavbar";
import { Link } from "react-router-dom";

class GroupList extends Component {
  constructor(props) {
    super(props);
    this.state = { groups: [], isLoading: true };
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    fetch("https://concert-manager-api.herokuapp.com/api/groups")
      .then(response => response.json())
      .then(data => this.setState({ groups: data, isLoading: false }));
  }

  async remove(id) {
    await fetch(`api/group/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(() => {
      let updatedGroups = [...this.state.groups].filter(i => i.id !== id);
      this.setState({ groups: updatedGroups });
    });
  }

  render() {
    const { groups, isLoading } = this.state;

    if (isLoading) {
      return <p>Loading. . .</p>;
    }

    const groupList = groups.map(group => {
      return (
        <tr key={group.id}>
          <td style={{ whiteSpace: "nowrap" }}>{group.name}</td>
          <td style={{ whiteSpace: "nowrap" }}>{group.genre}</td>
          <td>
            {group.concerts.map(concert => {
              return (
                <div key={concert.id}>
                  {new Intl.DateTimeFormat("en-GB", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit"
                  }).format(new Date(concert.date))}
                  : {concert.location}
                </div>
              );
            })}
          </td>
          <td>
            <ButtonGroup>
              <Button
                size="sm"
                color="primary"
                tag={Link}
                to={"/group/" + group.id}
              >
                Edit
              </Button>
              <Button
                size="sm"
                color="danger"
                onClick={() => this.remove(group.id)}
              >
                Delete
              </Button>
            </ButtonGroup>
          </td>
        </tr>
      );
    });

    return (
      <div>
        <AppNavbar />
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/group/new">
              Add Group
            </Button>
          </div>
          <h3>Upcoming Concerts</h3>
          <Table className="mt-4">
            <thead>
              <tr>
                <th width="25%">Name</th>
                <th width="25">Genre</th>
                <th width="25%">Next Playing</th>
                <th width="25%">Edit</th>
              </tr>
            </thead>
            <tbody>{groupList}</tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default GroupList;
