import "./Card.css";

const Card = ({ children, variant = "elevated" }) => {
  return <div className={`card card-${variant}`}>{children}</div>;
};

export default Card;
