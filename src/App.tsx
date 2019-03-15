import React, { Component, useState } from "react";
import logo from "./logo.svg";
import { Container, Col, Row } from "./components/Grid";
import { Card, CardHeader, CardTitle, CardBody } from "./components/Card";
import { Navbar } from "./components/Navbar";
import DatabaseManager from "./services/Database";
import { Participante } from "./models/Participante";
import { NumberUtil, FormatoUnidadeDeMedida } from "./utils/number";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

    this.setState({ participantes });
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
        <Col className="my-3" cols="12 3 3 3">
          <Card>
            <CardHeader>
              <CardTitle>{item.nome}</CardTitle>
            </CardHeader>
            <CardBody className="d-flex justify-content-between">
              <h3>{valor}</h3>
              <div>
                <button>
                  <FontAwesomeIcon color="success" icon="plus" />
                </button>
                <button>
                  <i className="fa-fa-minus" />
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
