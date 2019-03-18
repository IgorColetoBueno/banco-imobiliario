import * as React from "react";

interface INavbarProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const Navbar: React.SFC<INavbarProps> = props => {
  let { title, children, ...rest } = props;
  return (
    <nav className="navbar navbar-dark bg-info" {...rest}>
      <span className="navbar-brand mb-0 h1">{title}</span>
    </nav>
  );
};
