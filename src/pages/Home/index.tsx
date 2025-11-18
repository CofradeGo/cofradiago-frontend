import React from "react";
import Card from "../../components/molecules/Card";
import Button from "../../components/atoms/Button";

const Home: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Bienvenido a CofradíaGo</h1>
      <Card title="Ejemplo de tarjeta">
        <p>Contenido de prueba</p>
        <Button>Click Me</Button>
      </Card>
    </div>
  );
};

export default Home;
