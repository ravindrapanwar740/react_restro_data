import React, { Component } from "react";

class RestaurantUpdate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: null,
      rating: null,
      address: null,
      email: null,
      id:null
    };
  }
  componentDidMount() {
fetch('http://localhost:3000/restaurant/'+this.props.match.params.id).then((response) => {
  response.json().then((result) => {
    this.setState({ 
      name:result.name, 
      email:result.email, 
      id :result.id, 
      rating:result.rating, 
      address:result.address, 
     })
  });
});
}
  update()
  {
    fetch("http://localhost:3000/restaurant/"+this.state.id,
    {
      method:"Put",
      headers:{
  'content-type':'application/json'
      },
      body:JSON.stringify(this.state)
    }).then((result)=>{
  result.json().then((resp)=>{
  alert("data upadate")
  })
 })
  }
  render() {
   //console.warn(this.state)
    return (
      <div>
      <marquee>  <h1>Restaurant Update</h1> </marquee>
        <div>
          <input
            onChange={(event) => {this.setState({ name: event.target.value, });
            }} placeholder="Enter Restraurant name" value={this.state.name}/>
          <br />
          <br />
          <input
            onChange={(event) => {
              this.setState({
                rating: event.target.value,
              });
            }}
            placeholder="Enter Restraurant Rating" value={this.state.rating}
          />
          <br />
          <br />
          <input
            onChange={(event) => {
              this.setState({
                address: event.target.value,
              });
            }}
            placeholder="Enter Restraurant Location" value={this.state.address}
          />
          <br />
          <br />
          <input
            onChange={(event) => {
              this.setState({
                email: event.target.value,
              });
            }}
            placeholder="Enter Restraurant Email" value={this.state.email}
          />
          <br />
          <br />
          <button onClick={()=>{this.update()}}>Update Restaurant</button>
        </div> 
      </div>
    );
  }
}
export default RestaurantUpdate;
