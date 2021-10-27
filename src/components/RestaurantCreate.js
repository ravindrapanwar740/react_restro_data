import React, { Component } from "react";

class RestaurantCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null,
      rating: null,
      address: null,
      email: null,
    };
  }
create()
{
  fetch("http://localhost:3000/restaurant",{
    method:"Post",
    headers:{
'content-type':'application/json'
    },
    body:JSON.stringify(this.state)
  }).then((result)=>{
result.json().then((resp)=>{
alert("data insert")
})

  })
}
  render() {
    return (
      <div>
       <marquee><h1>Restaurant Create</h1></marquee>
        <div>
          <input
            onChange={(event) => {
              this.setState({
                name: event.target.value,
              });
            }}
            placeholder="Enter Restraurant name"
          />
          <br />
          <br />
          <input
            onChange={(event) => {
              this.setState({
                rating: event.target.value,
              });
            }}
            placeholder="Enter Restraurant Rating"
          />
          <br />
          <br />
          <input
            onChange={(event) => {
              this.setState({
                address: event.target.value,
              });
            }}
            placeholder="Enter Restraurant Location"
          />
          <br />
          <br />
          <input
            onChange={(event) => {
              this.setState({
                email: event.target.value,
              });
            }}
            placeholder="Enter Restraurant Email"
          />
          <br />
          <br />
          <button onClick={()=>{this.create()}}>Submit</button>
        </div>
      </div>
    );
  }
}
export default RestaurantCreate;
