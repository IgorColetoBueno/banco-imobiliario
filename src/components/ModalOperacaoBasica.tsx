import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label
} from "reactstrap";
import { Participante } from "../models/Participante";
import * as React from "react";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import DatabaseManager from "../services/Database";
import { PARTICIPANTES_STORE_NAME } from "../App";

interface Props {
  className?: string;
  toggle: Function;
  isOpen: boolean;
  participante: Participante;
  modalId: string;
  debito: boolean;
  onSave: Function;
  onReset?: Function;
  onError?: Function;
}

export default function ModalOperacao(props: Props) {
  const [valor, setValor] = React.useState(1);
  const [observacao, setObservacao] = React.useState("");

  return (
    <Modal
      isOpen={props.isOpen}
      toggle={() => props.toggle()}
      className={props.className}
    >
      <ModalHeader>{props.debito ? "Debitar" : "Creditar"}</ModalHeader>
      <ModalBody>
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
        <FormGroup>
          <Label>Observação</Label>
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setObservacao(e.target.value)
            }
            placeholder="Digite a observação"
            type="text"
            value={observacao}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={async () => {
            try {
              let { participante } = props;
              let montante = props.debito ? (valor * -1) : valor
              let obj = { ...participante, historico: [...participante.historico, { observacao, valor: montante, dataRegistro: new Date() }] } as Participante;
              const db = new DatabaseManager(PARTICIPANTES_STORE_NAME)

              await db.salvar(obj)

              setValor(1)
              setObservacao("")
              props.onSave();
              props.toggle();
            } catch (error) {
              alert("Ocorreu um erro ao salvar!")
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
