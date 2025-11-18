import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    // BrowserRouter es necesario para que react-router funcione
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
