export class Participante {
  id: number;
  nome: string;
  historico: Historico[];

  constructor(){
    this.historico = []
  }

  public get valor(): number {
    return this.historico
      .map(item => item.valor)
      .reduce((previus, current) => previus + current, 0);
  }

  public static mapListToParticipanteList(list: any[]) {
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
