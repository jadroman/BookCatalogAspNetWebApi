import { Col, Container, Nav, NavDropdown, Navbar, Row } from 'react-bootstrap';
import './App.scss';
import "@fortawesome/fontawesome-free/js/all.js";
import { Route, Navigate, HashRouter, Routes, Outlet, NavLink } from 'react-router-dom';
import Home from 'components/Home/Home';
import { Book } from 'components/Book/Book';
import { Category } from 'components/Category/Category';
import bookShelf from 'images/bookshelf.png'; //<a href="https://www.flaticon.com/free-icons/library" title="library icons">Library icons created by Freepik - Flaticon</a>
import { Login } from 'components/Login/Login';
import { isUserAuthenicated } from 'utils/auth';
import { Fragment, useState } from 'react';

function App() {

  const [userIsAuthenticated, setUserIsAuthenticated] = useState<boolean>(isUserAuthenicated());

  const onUserIsAuthenticated = (isUserAuthenicated: boolean) => {
    setUserIsAuthenticated(isUserAuthenicated);
  }

  const renderLogedInUser = () => {
    const userName = localStorage.getItem("bookCatalogUserName");

    if (userName) {
      //return <Chip label={userName} variant="outlined" />
      return <>

        <Navbar.Collapse id="basic-navbar-nav me-3">
          <Nav className="me-auto">
            <NavDropdown title={userName} id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => logout()}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </>
    }
  }

  const logout = () => {
    localStorage.removeItem("bookCatalogToken");
    localStorage.removeItem("bookCatalogRefreshToken");
    localStorage.removeItem("bookCatalogUserName");
    setUserIsAuthenticated(false);

    window.location.hash = '/login'
  }

  const renderNavigationIfUserAuthenticated = () => {
    if (userIsAuthenticated) {
      return <>
        <NavLink to="/home">
          home
        </NavLink>
        <NavLink to="/book">
          Books
        </NavLink>
        <NavLink
          to="/category">
          Categories
        </NavLink>
      </>
    }
    else {
      return <div className="me-auto fs-3" style={{ color: 'whiteSmoke !important' }}>Welcome to Book Catalog</div>
    }
  }

  return (
    <>
      <HashRouter>
        <Fragment>
          <Navbar expand="sm" className="navbar navbar-light" style={{ backgroundColor: '#6cadee' }}>
            <Navbar.Brand href="#/home">
              <img
                src={bookShelf}
                width="60"
                height="60"
                className="ms-3 d-inline-block align-top"
                alt="logo"
              />
            </Navbar.Brand>
            <Container className="d-flex justify-content-center">
              <div className="fs-3 d-flex justify-content-center navigationWrapper">
                {renderNavigationIfUserAuthenticated()}
              </div>
            </Container>
            {renderLogedInUser()}
          </Navbar>
          <Container fluid>
            <Row>
              <Col>
                <Routes>
                  {/* <Route path="/login" element={<Login />} />
                  <Route path="" element={<Book />} />
                  <Route path="/home" element={<Home />} /> */}
                  {/* <Route path="/book" element={<Book />} /> */}
                  <Route path='/' element={<ProtectedRoute />}>
                    <Route path='/' element={<Home />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/book' element={<Book />} />
                    <Route path='/category' element={<Category />} />
                  </Route>
                  <Route path='/login' element={<Login onUserIsAuthenticated={onUserIsAuthenticated} />} />
                  {/* <Route path='*' element={<Home />} /> */}
                  {/* <Route path="/category" element={<Category />} /> */}
                </Routes>
              </Col>
            </Row>
          </Container>
        </Fragment>
      </HashRouter>
    </>
  );
}

export default App;

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("bookCatalogToken");
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

