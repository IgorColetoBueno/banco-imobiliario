import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  Row,
  Col
} from "reactstrap";
import { Participante } from "../models/Participante";
import * as React from "react";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import DatabaseManager from "../services/Database";
import { PARTICIPANTES_STORE_NAME } from "../App";

interface Props {
  participantes: Participante[];
  className?: string;
  toggle: Function;
  isOpen: boolean;
  modalId: string;
  onSave: Function;
  onReset?: Function;
  onError?: Function;
}

export default function ModalOperacaoTransferencia(props: Props) {
  const [participanteDebitar, setParticipanteDebitar] = React.useState(0);
  const [participanteCreditar, setParticipanteCreditar] = React.useState(0);

  const [valor, setValor] = React.useState(1);
  const [observacao, setObservacao] = React.useState("");

  return (
    <Modal
      isOpen={props.isOpen}
      toggle={() => props.toggle()}
      className={props.className}
      size="lg"
    >
      <ModalHeader>Transferência</ModalHeader>
      <ModalBody>
        <Row>
          <Col sm="12" lg="4" md="4">
            <FormGroup>
              <Label className="text-danger font-weight-bold">A debitar</Label>
              <Input
                placeholder="Selecione..."
                type="select"
                name="a-debitar"
                value={participanteDebitar}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setParticipanteDebitar(parseInt(e.target.value))
                }
              >
                <option disabled value={0}>
                  Selecione...
                </option>
                {props.participantes.map(item => (
                  <option key={`item-debitar-${item.id}`} value={item.id}>
                    {item.nome}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>
          <Col sm="12" lg="4" md="4">
            <FormGroup>
              <Label>Valor</Label>
              <Input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValor(parseFloat(e.target.value || "0"))
                }
                placeholder="Digite o valor"
                type="number"
                value={valor}
              />
            </FormGroup>
          </Col>
          <Col sm="12" lg="4" md="4">
            <FormGroup>
              <Label className="text-success font-weight-bold">
                A creditar
              </Label>
              <Input
                placeholder="Selecione..."
                type="select"
                name="a-creditar"
                value={participanteCreditar}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setParticipanteCreditar(parseInt(e.target.value))
                }
              >
                <option disabled value={0}>
                  Selecione...
                </option>
                {props.participantes.map(item => {
                  if (item.id == participanteDebitar) {
                    return null;
                  }
                  return (
                    <option key={`item-creditar-${item.id}`} value={item.id}>
                      {item.nome}
                    </option>
                  );
                })}
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label>
                Observação <small>(Já existe uma observação automática)</small>
              </Label>
              <Input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setObservacao(e.target.value)
                }
                placeholder="Digite a observação"
                type="text"
                value={observacao}
              />
            </FormGroup>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={async () => {
            try {
              if (!participanteCreditar) {
                alert("Preencha o participante a creditar!");
                return;
              }
              if (!participanteDebitar) {
                alert("Preencha o participante a debitar!");
                return;
              }
              const db = new DatabaseManager(PARTICIPANTES_STORE_NAME);
              debugger;
              let participanteDebitado = await db.obterUm(participanteDebitar);
              let participanteCreditado = await db.obterUm(
                participanteCreditar
              );

              participanteCreditado = {
                ...participanteCreditado,
                historico: [
                  ...participanteCreditado.historico,
                  {
                    observacao: `Transferência recebida de ${
                      participanteDebitado.nome
                    }. ${observacao}`.trim(),
                    valor,
                    dataRegistro: new Date()
                  }
                ]
              } as Participante;

              participanteDebitado = {
                ...participanteDebitado,
                historico: [
                  ...participanteDebitado.historico,
                  {
                    observacao: `Transferência para ${
                      participanteCreditado.nome
                    }. ${observacao}`.trim(),
                    valor: valor * -1,
                    dataRegistro: new Date()
                  }
                ]
              } as Participante;

              await db.salvar(participanteCreditado);
              await db.salvar(participanteDebitado);

              setParticipanteCreditar(0);
              setParticipanteDebitar(0);
              setValor(0);
              setObservacao("");
              props.onSave();
              props.toggle();
            } catch (error) {
              alert("Ocorreu um erro ao salvar!");
            }
          }}
        >
          Salvar
        </Button>{" "}
        <Button color="secondary" onClick={() => props.toggle()}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
