import { Col, Container, ListGroup, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './../../style.css';
import './style.css';

import { Link } from "react-router-dom";
import { useThemeContext } from "../../contexts/ThemeContext";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

function Home() {
  const {theme} = useThemeContext();

  return (
    <Container fluid id={theme}>
      <Container fluid className="context-cor">
        <Header/>
        <Row className="conteudo-principal">
            <Col md={7} className="centralizado-flex">
                <div>
                  <p className="p">
                    Home.
                  </p>
                </div>
            </Col>
        </Row>
        <Footer/>
      </Container>
    </Container>
  );
}

export default Home;