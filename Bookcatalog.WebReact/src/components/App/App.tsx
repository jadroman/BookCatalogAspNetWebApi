import { Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import './App.scss';
import "@fortawesome/fontawesome-free/js/all.js";
import { Routes, Route } from 'react-router-dom';
import Home from 'components/Home/Home';
import { Book } from 'components/Book/Book';
import { ProtectedRoute } from 'components/ProtectedRoute';
import { Login } from 'components/Login/Login';
import { Category } from 'components/Category/Category';
import bookShelf from 'images/bookshelf.png' //<a href="https://www.flaticon.com/free-icons/library" title="library icons">Library icons created by Freepik - Flaticon</a>

function App() {

  return (
    <>
      <Navbar expand="sm" className="navbar navbar-light" style={{ backgroundColor: '#6cadee' }}>
        <Navbar.Brand href="/home">
          <img
            src={bookShelf}
            width="60"
            height="60"
            className="ms-3 d-inline-block align-top"
            alt="logo"
          />
        </Navbar.Brand>
        <Container className="d-flex justify-content-center">
          <div className="d-flex justify-content-center">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto fs-3">
                <Nav.Link href="/home">Home</Nav.Link>
                <Nav.Link href="/book">Books</Nav.Link>
                <Nav.Link href="/category">Categories</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
      <Container fluid>
        <Row>
          <Col>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="" element={<Book />} />
                <Route path="/home" element={<Home />} />
                <Route path="/book" element={<Book />} />
                <Route path="/category" element={<Category />} />
              </Route>
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
