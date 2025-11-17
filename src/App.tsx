import './App.css'
import HealthStatus from "./components/HealthStatus";
function App() {

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl max-w-md w-full p-8 flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          CofradíaGo Frontend
        </h1>
        <p className="text-gray-700 text-lg mb-2">
          ¡TailwindCSS está funcionando!
        </p>
        <div className="text-gray-700 text-lg mb-6">
          <HealthStatus />
        </div>
        <button className="mt-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition-colors">
          Botón de prueba
        </button>
      </div>
    </div>
  )
}

export default App
