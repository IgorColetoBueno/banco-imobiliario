import * as React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { Participante } from "../models/Participante";
import { FormatoUnidadeDeMedida, NumberUtil } from "../utils/number";

interface Props {
  participante?: Participante;
  className?: string;
  toggle: Function;
  isOpen: boolean;
  modalId: string;
}

export default function ModalHistoricoOperacoes(props: Props) {
  return (
    <Modal
      size="lg"
      isOpen={props.isOpen}
      toggle={() => props.toggle()}
      className={props.className}
    >
      <ModalHeader>{props.participante.nome}</ModalHeader>
      <ModalBody>
        <table className="table table-responsive-sm">
          <thead>
            <tr>
              <th>Observação</th>
              <th>Data e hora</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {props.participante.historico.map((item, i) => (
              <tr key={`tr-${i}`}>
                <td>
                  {item.observacao ? item.observacao : "Não há observação."}
                </td>

                <td>{item.dataRegistro.toLocaleString()}</td>
                <td className="ml-3">
                  {NumberUtil.toDisplayNumber(
                    item.valor,
                    2,
                    FormatoUnidadeDeMedida.BRL
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => props.toggle()}>
          Ok
        </Button>
      </ModalFooter>
    </Modal>
  );
}
