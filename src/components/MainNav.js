import { Nav, Navbar } from "react-bootstrap";

export default function MainNav() {
  return (
    <Navbar bg="light" expand="lg" className="navbar shadow">
      <Navbar.Brand href="#home">
        <span className="text-success">Budget</span> Tracker
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <>
            <Nav.Link href="/insights">Insights</Nav.Link>
            <Nav.Link href="/categories">Categories</Nav.Link>
            <Nav.Link href="/records">Records</Nav.Link>
            <Nav.Link href="/logout">Logout</Nav.Link>
          </>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
