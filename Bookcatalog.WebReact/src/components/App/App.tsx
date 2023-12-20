import { Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import './App.scss';
import "@fortawesome/fontawesome-free/js/all.js";
import { Routes, Route } from 'react-router-dom';
import Home from 'components/Home/Home';
import { Book } from 'components/Book/Book';

function App() {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/home">React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/home">Home</Nav.Link>
              <Nav.Link href="/book">Books</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container fluid>
        <Row>
          <Col>
            <Routes>
              <Route path="" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/book" element={<Book />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
