export class Participante {
  id?: number;
  nome: string;
  historico: Historico[];

  public get valor(): number {
    return this.historico
      .map(item => item.valor)
      .reduce((previus, current) => previus + current, 0);
  }

  public static mapListToParticipanteList(list: any[]) {
    debugger;
    return list.map(item => {
      let obj = new Participante();
      obj.id = item.id;
      obj.nome = item.nome;
      obj.historico = item.historico;
      return obj;
    });
  }
}

export interface Historico {
  valor: number;
  observacao: string;
}
