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
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={() => {
            props.toggle();
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
