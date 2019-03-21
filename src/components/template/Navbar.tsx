import * as React from "react";

interface INavbarProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: string;
}

export const Navbar: React.SFC<INavbarProps> = props => {
  let { title, children, ...rest } = props;
  return (
    <nav className="navbar navbar-dark bg-info" {...rest}>
      <span className="navbar-brand mb-0 h1">
        <i className={props.icon} /> {title}
      </span>
    </nav>
  );
};
