import * as React from "react";

interface ICardProps extends React.HTMLAttributes<HTMLDivElement> {}
interface ICardImageProps extends React.HTMLAttributes<HTMLImageElement> {
  src: string | any;
}

export const Card: React.SFC<ICardProps> = props => (
  <div {...props} className={`card ${props.className || ""}`.trim()}>
    {props.children}
  </div>
);

export const CardBody: React.SFC<ICardProps> = props => (
  <div {...props} className={`card-body ${props.className || ""}`.trim()}>
    {props.children}
  </div>
);

export const CardHeader: React.SFC<ICardProps> = props => (
  <div {...props} className={`card-header ${props.className || ""}`.trim()}>
    {props.children}
  </div>
);

export const CardTitle: React.SFC<ICardProps> = props => (
  <div {...props} className={`card-title ${props.className || ""}`.trim()}>
    {props.children}
  </div>
);

export const CardImageTop: React.SFC<ICardImageProps> = props => (
  <img {...props} className={`card-img-top ${props.className || ""}`.trim()} />
);
