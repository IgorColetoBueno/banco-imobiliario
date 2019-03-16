import * as React from "react";

interface IGridProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  id?: string;
  invisible?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface IContainerProps extends IGridProps {
  fluid?: boolean;
}

interface IColProps extends IGridProps {
  cols?: string;
}

export const Container: React.SFC<IContainerProps> = props => {
  let { fluid, className, invisible, children, ...rest } = props;
  return (
    <div
      {...rest}
      style={{ display: invisible ? "none" : null }}
      className={`${fluid! ? "container-fluid" : "container"} ${className ||
        ""}`.trim()}
    >
      {children}
    </div>
  );
};

export const Row: React.SFC<IGridProps> = props => {
  let { invisible, className, children, ...rest } = props;

  if (invisible) {
    return null;
  }

  return (
    <div {...rest} className={`row ${className || ""}`.trim()}>
      {children}
    </div>
  );
};

/**
 * Abstrai a "div.col". Propriedade "cols" é usada com a seguinte ordem: (sm md lg xl), ou seja , cols={'12 6 6 4'}
 */
export const Col: React.SFC<IColProps> = props => {
  let { invisible, cols, className, children, ...rest } = props;
  if (invisible) {
    return null;
  }
  return (
    <div {...rest} className={`${obterCols(cols)} ${className || ""}`.trim()}>
      {children}
    </div>
  );
};

const obterCols = (cols: string) => {
  if (!cols) {
    return "col";
  }
  // Aqui esperamos a seguinte entrada de cols: '12 4 4 2'
  let colArray = cols.split(" ");

  let colString = "";
  colString = colString.concat(colArray[0] ? `col-sm-${colArray[0]} ` : "");
  colString = colString.concat(colArray[1] ? `col-md-${colArray[1]} ` : "");
  colString = colString.concat(colArray[2] ? `col-lg-${colArray[2]} ` : "");
  colString = colString.concat(colArray[3] ? `col-xl-${colArray[3]}` : "");

  return colString || "col";
};
