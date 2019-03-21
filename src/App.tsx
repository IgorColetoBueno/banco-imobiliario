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
import ModalCadastroParticipante from "./components/ModalCadastroParticipante";
import Button from "reactstrap/lib/Button";
import ModalHistoricoOperacoes from "./components/ModalHistoricoOperacoes";
import ModalOperacaoTransferencia from "./components/ModalOperacaoTransferencia";

export const PARTICIPANTES_STORE_NAME = "Participantes";
const MODAL_OPERACAO_NAME = "modal-operacao";
const MODAL_CADASTRO_PARTICIPANTE_NAME = "modal-cadastro-participante";
const MODAL_HISTORICO_OPERACOES_NAME = "modal-historico";
const MODAL_TRANSFERENCIA_NAME = "modal-transferencia";

interface Props {}

interface State {
  modalOperacaoIsOpen?: boolean;
  modalCadastroParticipanteIsOpen?: boolean;
  modalHistoricoIsOpen?: boolean;
  modalTransferenciaIsOpen?: boolean;
  participanteIdEdit?: number;
  db: DatabaseManager;
  participantes: Participante[];
  debito?: boolean;
  participanteSelecionado: Participante;
}

class App extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      participanteIdEdit: 0,
      db: new DatabaseManager(PARTICIPANTES_STORE_NAME),
      participantes: [],
      modalOperacaoIsOpen: false,
      modalCadastroParticipanteIsOpen: false,
      participanteSelecionado: new Participante()
    };
  }

  async componentWillMount() {
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
              <div className="d-flex justify-content-between">
                <CardTitle>{item.nome}</CardTitle>
                <div>
                  <Button
                    size="sm"
                    color="info"
                    onClick={() => {
                      this.renderModalCadastroParticipante(item.id);
                    }}
                  >
                    <i className="fas fa-pencil-alt" />
                  </Button>
                  <Button
                    className="ml-1"
                    size="sm"
                    color="secondary"
                    onClick={() => {
                      this.renderModalHistorico(item);
                    }}
                  >
                    <i className="fas fa-file-invoice-dollar" />
                  </Button>
                </div>
              </div>
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

  renderActionButtons(): React.ReactNode {
    return (
      <React.Fragment>
        <Col>
          <Button
            className="mr-1 mb-1"
            color="success"
            onClick={async () =>
              await this.renderModalCadastroParticipante(null)
            }
          >
            <i className="fas fa-plus" /> Novo participante
          </Button>
          <Button
            className="mr-1 mb-1"
            color="secondary"
            onClick={async () => await this.renderModalTransferencia()}
          >
            <i className="fas fa-hand-holding-usd" /> Nova transferência
          </Button>
        </Col>
      </React.Fragment>
    );
  }

  async renderModalOperacao(
    participanteSelecionado: Participante,
    debito: boolean
  ) {
    await this.setState({ debito, participanteSelecionado });
    await this.togleModalOperacao();
  }

  async renderModalTransferencia() {
    await this.togleModalTransferencia();
  }

  async renderModalCadastroParticipante(id?: number) {
    await this.setState({ participanteIdEdit: id });
    await this.togleModalCadastroParticipante();
  }

  async renderModalHistorico(participanteSelecionado: Participante) {
    await this.setState({ participanteSelecionado });
    await this.togleModalHistorico();
  }

  async togleModalOperacao() {
    let { modalOperacaoIsOpen } = this.state;
    await this.setState({ modalOperacaoIsOpen: !modalOperacaoIsOpen });
  }

  async togleModalCadastroParticipante() {
    let { modalCadastroParticipanteIsOpen } = this.state;
    await this.setState({
      modalCadastroParticipanteIsOpen: !modalCadastroParticipanteIsOpen
    });
  }

  async togleModalHistorico() {
    let { modalHistoricoIsOpen } = this.state;
    await this.setState({ modalHistoricoIsOpen: !modalHistoricoIsOpen });
  }

  async togleModalTransferencia() {
    let { modalTransferenciaIsOpen } = this.state;
    await this.setState({
      modalTransferenciaIsOpen: !modalTransferenciaIsOpen
    });
  }

  render() {
    return (
      <React.Fragment>
        <Navbar icon="fas fa-piggy-bank" title="Banco imobiliário" />
        <Container className="pt-3" fluid>
          <Row>{this.renderActionButtons()}</Row>
          <Row>{this.renderCards()}</Row>
          {/* Modais de operações */}
          <ModalOperacao
            isOpen={this.state.modalOperacaoIsOpen}
            toggle={async () => await this.togleModalOperacao()}
            participante={this.state.participanteSelecionado}
            modalId={MODAL_OPERACAO_NAME}
            key={MODAL_OPERACAO_NAME}
            debito={this.state.debito}
            onSave={async () => {
              this.updateParticipantes();
            }}
          />
          {/* Modal de histórico */}
          <ModalHistoricoOperacoes
            toggle={async () => await this.togleModalHistorico()}
            participante={this.state.participanteSelecionado}
            modalId={MODAL_HISTORICO_OPERACOES_NAME}
            key={MODAL_HISTORICO_OPERACOES_NAME}
            isOpen={this.state.modalHistoricoIsOpen}
          />
          {/* Modal de transferência */}
          <ModalOperacaoTransferencia
            participantes={this.state.participantes}
            toggle={async () => await this.togleModalTransferencia()}
            modalId={MODAL_TRANSFERENCIA_NAME}
            key={MODAL_TRANSFERENCIA_NAME}
            onSave={() => {
              this.updateParticipantes();
            }}
            isOpen={this.state.modalTransferenciaIsOpen}
          />
          {/* Modal de cadastro de participantes */}
          <ModalCadastroParticipante
            participanteId={this.state.participanteIdEdit}
            isOpen={this.state.modalCadastroParticipanteIsOpen}
            toggle={async () => await this.togleModalCadastroParticipante()}
            modalId={MODAL_CADASTRO_PARTICIPANTE_NAME}
            key={MODAL_CADASTRO_PARTICIPANTE_NAME}
            onSave={() => this.updateParticipantes()}
          />
        </Container>
      </React.Fragment>
    );
  }
}

export default App;
