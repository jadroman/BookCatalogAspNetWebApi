import { Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import './App.scss';
import "@fortawesome/fontawesome-free/js/all.js";
import { Routes, Route } from 'react-router-dom';
import Home from 'components/Home/Home';
import { Book } from 'components/Book/Book';
import { ProtectedRoute } from 'components/ProtectedRoute';
import { Category } from 'components/Category/Category';
import bookShelf from 'images/bookshelf.png'; //<a href="https://www.flaticon.com/free-icons/library" title="library icons">Library icons created by Freepik - Flaticon</a>
import { useLocation } from "react-router-dom";
import { Login } from 'components/Login/Login';
import { useState } from 'react';
import { UserInfo } from 'types/authInfo';
import { Chip } from '@mui/material';
import { isUserAuthenicated } from 'utils/auth';

function App() {

  const location = useLocation();

  function checkSelectedCssClass(href: string): string {
    if (location.pathname === href) {
      return 'selectedNavigation';
    }

    return '';
  }

  const renderLogedInUser = () => {
    const userName = localStorage.getItem("bookCatalogUserName");

    if (userName) {
      return <Chip label={userName} variant="outlined" />
    }
  }

  const renderNavigationIfUserAuthenticated = () => {
    if (isUserAuthenicated()) {
      return <>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto fs-3" style={{ color: 'whiteSmoke !important' }}>
            <Nav.Link className={checkSelectedCssClass('/home')} href="/home">Home</Nav.Link>
            <Nav.Link className={checkSelectedCssClass('/book')} href="/book">Books</Nav.Link>
            <Nav.Link className={checkSelectedCssClass('/category')} href="/category">Categories</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </>
    }
    else {
      return <div className="me-auto fs-3" style={{ color: 'whiteSmoke !important' }}>Welcome to Book Catalog</div>
    }
  }

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
            {renderNavigationIfUserAuthenticated()}
          </div>
        </Container>
        {renderLogedInUser()}
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
