function App() {
  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <header className="bg-black text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">negocio-facil</h1>
        <p className="text-sm text-gray-300">
          controla clientes, stock y ventas desde tu celular
        </p>
      </header>

      <main className="p-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow">
          <h2 className="text-lg font-semibold">Clientes</h2>
          <p className="text-gray-600 mt-2">
            Gestioná clientes y deudas fácilmente.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow">
          <h2 className="text-lg font-semibold">Stock</h2>
          <p className="text-gray-600 mt-2">
            Controlá inventario y productos bajos.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow">
          <h2 className="text-lg font-semibold">Ventas</h2>
          <p className="text-gray-600 mt-2">
            Registrá ventas y movimientos del negocio.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow">
          <h2 className="text-lg font-semibold">
            Recordatorios WhatsApp
          </h2>
          <p className="text-gray-600 mt-2">
            Enviá recordatorios de pagos pendientes.
          </p>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3">
        <button className="font-medium">Inicio</button>
        <button className="font-medium">Clientes</button>
        <button className="font-medium">Stock</button>
        <button className="font-medium">Ventas</button>
      </nav>
    </div>
  );
}

export default App;