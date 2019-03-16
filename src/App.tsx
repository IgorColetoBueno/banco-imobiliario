import React, { Component, useState } from "react";
import logo from "./logo.svg";
import { Container, Col, Row } from "./components/template/Grid";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody
} from "./components/template/Card";
import { Navbar } from "./components/template/Navbar";
import DatabaseManager from "./services/Database";
import { Participante } from "./models/Participante";
import { NumberUtil, FormatoUnidadeDeMedida } from "./utils/number";
import "@fortawesome/fontawesome-free/css/all.css";
import ModalOperacao from "./components/ModalOperacaoBasica";
import { uuidv4 } from "./utils/guid";

const STORE_NAME = "Participantes";
const MODAL_OPERACAO_NAME = "modal-operacao";
const MODAL_TRANSFERENCIA_NAME = "modal-transferencia";

interface Props {}

interface State {
  modalOperacaoIsOpen?: boolean;
  db: DatabaseManager;
  participantes: Participante[];
  debito?: boolean;
  participanteSelecionado: Participante;
}

class App extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      db: new DatabaseManager(STORE_NAME),
      participantes: [],
      modalOperacaoIsOpen: false,
      participanteSelecionado: new Participante()
    };
  }

  async componentWillMount() {
    await this.state.db.limparDados();
    await this.state.db.salvar({
      id: uuidv4(),
      historico: [],
      nome: "Igor"
    } as Participante);
    await this.state.db.salvar({
      id: uuidv4(),
      historico: [],
      nome: "Lígia"
    } as Participante);
    await this.state.db.salvar({
      id: uuidv4(),
      historico: [],
      nome: "Felipe"
    } as Participante);
    await this.state.db.salvar({
      id: uuidv4(),
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
    if (!this.state && !this.state.participantes.length) {
      return <span>Ainda não há participantes!</span>;
    }
    debugger;
    return this.state.participantes.map((item, i) => {
      let valor = NumberUtil.toDisplayNumber(
        item.valor,
        2,
        FormatoUnidadeDeMedida.BRL
      );

      return (
        <Col key={`participante-${i}`} className="my-3" cols="12 3 3 3">
          <Card>
            <CardHeader>
              <CardTitle>{item.nome}</CardTitle>
            </CardHeader>
            <CardBody className="d-flex justify-content-between">
              <h3>{valor}</h3>
              <div>
                <button
                  className="btn btn-success mr-1"
                  onClick={async () =>
                    await this.renderModalOperacao(item, false)
                  }
                >
                  <i className="fas fa-plus" />
                </button>
                <button
                  className="btn btn-danger"
                  onClick={async () =>
                    await this.renderModalOperacao(item, true)
                  }
                >
                  <i className="fas fa-minus" />
                </button>
              </div>
            </CardBody>
          </Card>
        </Col>
      );
    });
  }

  async renderModalOperacao(
    participanteSelecionado: Participante,
    debito: boolean
  ) {
    await this.setState({ debito, participanteSelecionado });
    await this.togleModalOperacao();
  }

  async togleModalOperacao() {
    let { modalOperacaoIsOpen } = this.state;
    await this.setState({ modalOperacaoIsOpen: !modalOperacaoIsOpen });
  }

  render() {
    return (
      <React.Fragment>
        <Navbar title="Banco imobiliário" />
        <Container fluid>
          <Row>{this.renderCards()}</Row>
          {/* Modais de operações */}
          <ModalOperacao
            isOpen={this.state.modalOperacaoIsOpen}
            toggle={async () => await this.togleModalOperacao()}
            participante={this.state.participanteSelecionado}
            modalId={MODAL_OPERACAO_NAME}
            key={MODAL_OPERACAO_NAME}
            debito={this.state.debito}
            onSave={() => this.updateParticipantes()}
          />
        </Container>
      </React.Fragment>
    );
  }
}

export default App;
