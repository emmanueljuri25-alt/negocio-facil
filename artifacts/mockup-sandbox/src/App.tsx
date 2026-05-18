import { useEffect, useState } from "react";

type Cliente = {
  nombre: string;
  telefono: string;
  deuda: number;
};

function App() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [deuda, setDeuda] = useState("");

  useEffect(() => {
    const guardados = localStorage.getItem("clientes");
    if (guardados) {
      setClientes(JSON.parse(guardados));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("clientes", JSON.stringify(clientes));
  }, [clientes]);

  function agregarCliente() {
    if (!nombre) return;

    const nuevoCliente: Cliente = {
      nombre,
      telefono,
      deuda: Number(deuda) || 0,
    };

    setClientes([nuevoCliente, ...clientes]);

    setNombre("");
    setTelefono("");
    setDeuda("");
  }

  const deudaTotal = clientes.reduce(
    (total, cliente) => total + cliente.deuda,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <header className="bg-black text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">negocio-facil</h1>
        <p className="text-sm text-gray-300">
          controla clientes, stock y ventas desde tu celular
        </p>
      </header>

      <main className="p-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-3">
            Agregar cliente
          </h2>

          <div className="space-y-3">
            <input
              className="w-full border rounded-xl p-3"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <input
              className="w-full border rounded-xl p-3"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />

            <input
              className="w-full border rounded-xl p-3"
              placeholder="Deuda / Fiado"
              type="number"
              value={deuda}
              onChange={(e) => setDeuda(e.target.value)}
            />

            <button
              onClick={agregarCliente}
              className="w-full bg-black text-white p-3 rounded-xl font-semibold"
            >
              Guardar cliente
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow">
          <h2 className="text-lg font-semibold">
            Resumen del negocio
          </h2>

          <div className="mt-3 space-y-2">
            <p>
              👥 Clientes: <strong>{clientes.length}</strong>
            </p>

            <p>
              💸 Total fiado:{" "}
              <strong>
                ${deudaTotal.toLocaleString("es-AR")}
              </strong>
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {clientes.map((cliente, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 shadow"
            >
              <h3 className="font-semibold text-lg">
                {cliente.nombre}
              </h3>

              <p className="text-gray-600">
                📞 {cliente.telefono || "Sin teléfono"}
              </p>

              <p className="mt-2 text-red-600 font-semibold">
                💰 Debe: $
                {cliente.deuda.toLocaleString("es-AR")}
              </p>
            </div>
          ))}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3">
        <button className="font-medium">Inicio</button>
        <button className="font-medium">Clientes</button>
        <button className="font-medium">Fiado</button>
        <button className="font-medium">Stock</button>
      </nav>
    </div>
  );
}

export default App;