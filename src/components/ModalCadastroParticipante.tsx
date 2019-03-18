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
  participanteId?: number;
  className?: string;
  toggle: Function;
  isOpen: boolean;
  modalId: string;
  onSave: Function;
  onError?: Function;
}

export default function ModalCadastroParticipante(props: Props) {
  const [nome, setNome] = React.useState("");

  return (
    <Modal
      isOpen={props.isOpen}
      toggle={() => props.toggle()}
      className={props.className}
    >
      <ModalHeader className="d-flex-justify-content-between">
        {props.participanteId ? "Editar" : "Novo"}
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label>Nome</Label>
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNome(e.target.value)
            }
            placeholder="Digite o nome"
            type="text"
            value={nome}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={async () => {
            try {
              const db = new DatabaseManager(PARTICIPANTES_STORE_NAME);
              let { id, ...obj } = new Participante();

              if (props.participanteId) {
                obj = await db.obterUm(props.participanteId)
              }

              obj.nome = nome;
              await db.salvar(obj);

              props.onSave();
              props.toggle();
            } catch (error) {
              alert("Ocorreu um erro ao salvar!")
            }
          }}
        >
          Salvar
        </Button>{" "}
        <Button className={!props.participanteId ? "d-none" : ""} color="danger" onClick={async () => {
          if (!confirm("Deseja mesmo deletar?")) {
            return;
          }

          let db = new DatabaseManager(PARTICIPANTES_STORE_NAME);
          await db.remover(props.participanteId);
          props.onSave();
          props.toggle();
        }}>
          Deletar
        </Button>
        <Button color="secondary" onClick={() => props.toggle()}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
