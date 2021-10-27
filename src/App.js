//import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import {Navbar,Nav} from 'react-bootstrap';
import Home from "./components/Home";
import RestaurantDetail from "./components/RestaurantDetail";
import RestaurantSearch from "./components/RestaurantSearch";
import RestaurantUpdate from "./components/RestaurantUpdate";
import RestaurantList from "./components/RestaurantsList";
import RestaurantCreate from "./components/RestaurantCreate";
import background from "./components/restro3.jpg";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome,faList,faPlusSquare,faSearch ,faPenSquare,faInfoCircle}  from '@fortawesome/free-solid-svg-icons'


function App() {
  
  return (
   
     <div className="App">
       <p>&#169;2021</p>
       {/* <Home /> */}
 
         <div className="image" style={{ backgroundImage: `url(${background})`  }}> 

        <Router>
       
    {/* <div className="navbar">  */}
    <Navbar bg="light" expand="lg">
   <h1><marquee scrollamount='15'><Navbar.Brand href="#home"><h1>Restrorant</h1></Navbar.Brand></marquee></h1><br />
   <Navbar.Toggle aria-controls="basic-navbar-nav" />
   <Navbar.Collapse id="basic-navbar-nav">
     <Nav className="me-auto"> 
       <Nav.Link href="#home"><Link to="/"><FontAwesomeIcon icon={faHome}/>Home</Link></Nav.Link>
       <Nav.Link href="#link"> <Link to="/list"><FontAwesomeIcon icon={faList}/>List</Link></Nav.Link>
       <Nav.Link href="#link"><Link to="/create"><FontAwesomeIcon icon={faPlusSquare}/>Create</Link></Nav.Link>
       <Nav.Link href="#link">  <Link to="/search"><FontAwesomeIcon icon={faSearch}/></Link>Search</Nav.Link>
       <Nav.Link href="#link"> <Link to="/update"><FontAwesomeIcon icon={faPenSquare}/></Link>Update</Nav.Link>
      <Nav.Link href="#link"> <Link to="/detail"><FontAwesomeIcon icon={faInfoCircle}/></Link>Detail</Nav.Link> 
     </Nav>
   </Navbar.Collapse>
   </Navbar> 
       <Route path="/list">
         <RestaurantList />
       </Route>
       <Route path="/create">
         <RestaurantCreate />
       </Route>
       <Route path="/search">
         <RestaurantSearch />
       </Route>
       <Route path="/update/:id"
       render={props=>(
         <RestaurantUpdate  {...props}/>
       )} />
       
       {/* </Route> */}
       <Route path="/detail">
         <RestaurantDetail />
       </Route>

       <Route exact path="/">
         <Home />
       </Route>
       
       {/* </div> */}
     </Router>
    
     </div>
   
   </div> 
   // </div>
    )
   
  }
export default App;
