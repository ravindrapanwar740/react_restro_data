import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

class RestaurantsList extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      list: null,
    };
  }
  componentDidMount() {
    this.getData();
  }
  getData() {
    fetch("http://localhost:3000/restaurant").then((response) => {
      response.json().then((result) => {
        this.setState({ list: result });
      });
    });
  }

  delete(id) {
    fetch("http://localhost:3000/restaurant/" + id, {
      method: "DELETE",
    }).then((result) => {
      result.json().then((resp) => {
        alert("Data Deleted");
        this.getData();
      });
    });
  }
  show() {
    alert("Welcome");
  }
  // update()
  // {
  //   fetch("http://localhost:3000/restaurant").then((response) => {
  //     response.json().then((result) => {
  //       this.setState({ list: result })
  //     });
  //   });

  // }
  render() {
    return (
      <div>
        <marquee>
          {" "}
          <h1>Restaurant List</h1>
        </marquee>
        {this.state.list ? (
          <div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Rating</th>
                  <th>Location</th>
                  <th>Email</th>
                  <th>Update</th>
                </tr>
                </thead>
                <tbody>
                {this.state.list.map((item, i) => (
                  <tr>
                    <td>
                      <b>{item.id}</b>
                    </td>
                    <td>
                      <b>{item.name}</b>
                    </td>
                    <td>
                      <b>{item.rating}</b>
                    </td>
                    <td>
                      <b>{item.address}</b>
                    </td>
                    <td>
                      <b>{item.email}</b>
                    </td>
                    <td>
                      <Link to={"/update/" + item.id}>
                        <FontAwesomeIcon icon={faEdit} color="orange" />
                      </Link>
                      <span onClick={() => this.delete(item.id)}>
                        <FontAwesomeIcon icon={faTrashAlt} color="red" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <p>Loading.....</p>
        )}
      </div>
    );
  }
}
export default RestaurantsList;
//item.email}
