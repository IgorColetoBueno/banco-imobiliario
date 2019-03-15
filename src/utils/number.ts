export class NumberUtil {
  // Retorna um valor numérico
  static mapNumber(numero: string | number | undefined | null): number {
    if (numero === undefined || numero === null) {
      return 0;
    }
    if (typeof numero === "string") {
      return parseFloat(numero);
    }

    return numero;
  }
  /**
   * Formata um valor numérico para número decimal com 4 casas
   * @param param valor numérico
   */
  public static toDisplayNumber(
    param: number | string,
    decimalPlaces: number = 4,
    unidade?: FormatoUnidadeDeMedida
  ) {
    if (!param) {
      param = 0;
    }

    let value = typeof param == "string" ? parseFloat(param.toString()) : param;
    let numeroFormatado = value.toLocaleString(navigator.language, {
      minimumFractionDigits: decimalPlaces
    });

    if (unidade) {
      return "".concat(numeroFormatado, " ", unidade);
    }

    return numeroFormatado;
  }
  public static toDisplayMoney(param: number | string) {
    return `R$ ${this.toDisplayNumber(param, 2)}`;
  }
}

export enum FormatoUnidadeDeMedida {
  KG = "Kg",
  T = "T",
  SCS = "SCS",
  PERC = "%",
  BRL = "BRL",
  USD = "$"
}
