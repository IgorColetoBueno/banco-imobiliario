import React, { Component, useState } from "react";
import logo from "./logo.svg";
import { Container, Col, Row } from "./components/Grid";
import { Card, CardHeader, CardTitle, CardBody } from "./components/Card";
import { Navbar } from "./components/Navbar";
import DatabaseManager from "./services/Database";
import { Participante } from "./models/Participante";
import { NumberUtil, FormatoUnidadeDeMedida } from "./utils/number";
import "@fortawesome/fontawesome-free/css/all.css";

const STORE_NAME = "Participantes";

interface Props {}

interface State {
  db: DatabaseManager;
  participantes: Participante[];
}

class App extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      db: new DatabaseManager(STORE_NAME),
      participantes: []
    };
  }

  async componentWillMount() {
    await this.state.db.limparDados();
    await this.state.db.salvar({ historico: [], nome: "Igor" } as Participante);
    await this.state.db.salvar({
      historico: [],
      nome: "Lígia"
    } as Participante);
    await this.state.db.salvar({
      historico: [],
      nome: "Felipe"
    } as Participante);
    await this.state.db.salvar({
      historico: [],
      nome: "Mais um"
    } as Participante);
    await this.updateParticipantes();
  }

  private async updateParticipantes() {
    let participantes = (await this.state.db.obterTodos(
      Participante.mapListToParticipanteList
    )) as Participante[];

    await this.setState({ participantes });
  }

  renderCards() {
    debugger;
    if (!this.state && !this.state.participantes.length) {
      return <span>Ainda não há participantes!</span>;
    }
    debugger;
    return this.state.participantes.map(item => {
      let valor = NumberUtil.toDisplayNumber(
        item.valor,
        2,
        FormatoUnidadeDeMedida.BRL
      );

      return (
        <Col key={`participante-${item.id}`} className="my-3" cols="12 3 3 3">
          <Card>
            <CardHeader>
              <CardTitle>{item.nome}</CardTitle>
            </CardHeader>
            <CardBody className="d-flex justify-content-between">
              <h3>{valor}</h3>
              <div>
                <button className="btn btn-success">
                  <i className="fas fa-plus" />
                </button>
                <button className="btn btn-danger">
                  <i className="fas fa-minus" />
                </button>
              </div>
            </CardBody>
          </Card>
        </Col>
      );
    });
  }

  render() {
    return (
      <React.Fragment>
        <Navbar title="Banco imobiliário" />
        <Container fluid>
          <Row>{this.renderCards()}</Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default App;
