import ReactDOM from "react-dom/client";
import Button from "./components/Button";
import Card from "./components/Card";

const App = () => (
  <div style={{ padding: "2rem" }}>
    <h1>Shared UI Components</h1>
    <div
      style={{
        marginTop: "2rem",
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
      }}
    >
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
    </div>
    <div style={{ marginTop: "2rem" }}>
      <Card variant="elevated">
        <h3>Elevated Card</h3>
        <p>This is an elevated card with shadow.</p>
      </Card>
    </div>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
