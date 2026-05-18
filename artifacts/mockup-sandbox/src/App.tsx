import { useEffect, useMemo, useState } from "react";

type Cliente = {
  id: number;
  nombre: string;
  telefono: string;
  deuda: number;
};

type MovimientoCaja = {
  id: number;
  tipo: "Ingreso" | "Gasto";
  descripcion: string;
  monto: number;
  fecha: string;
};

type Proveedor = {
  id: number;
  nombre: string;
  telefono: string;
  empresa: string;
};

function App() {
  const [pantalla, setPantalla] = useState("inicio");

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([]);

  const [nombreCliente, setNombreCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");
  const [deudaCliente, setDeudaCliente] = useState("");

  const [nombreProveedor, setNombreProveedor] = useState("");
  const [telefonoProveedor, setTelefonoProveedor] = useState("");
  const [empresaProveedor, setEmpresaProveedor] = useState("");

  const [tipoMovimiento, setTipoMovimiento] = useState<"Ingreso" | "Gasto">("Ingreso");
  const [descripcionMovimiento, setDescripcionMovimiento] = useState("");
  const [montoMovimiento, setMontoMovimiento] = useState("");

  useEffect(() => {
    const clientesGuardados = localStorage.getItem("negocio_clientes");
    const proveedoresGuardados = localStorage.getItem("negocio_proveedores");
    const movimientosGuardados = localStorage.getItem("negocio_movimientos");

    if (clientesGuardados) setClientes(JSON.parse(clientesGuardados));
    if (proveedoresGuardados) setProveedores(JSON.parse(proveedoresGuardados));
    if (movimientosGuardados) setMovimientos(JSON.parse(movimientosGuardados));
  }, []);

  useEffect(() => {
    localStorage.setItem("negocio_clientes", JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    localStorage.setItem("negocio_proveedores", JSON.stringify(proveedores));
  }, [proveedores]);

  useEffect(() => {
    localStorage.setItem("negocio_movimientos", JSON.stringify(movimientos));
  }, [movimientos]);

  function agregarCliente() {
    if (!nombreCliente) return;

    const nuevoCliente: Cliente = {
      id: Date.now(),
      nombre: nombreCliente,
      telefono: telefonoCliente,
      deuda: Number(deudaCliente) || 0,
    };

    setClientes([nuevoCliente, ...clientes]);

    setNombreCliente("");
    setTelefonoCliente("");
    setDeudaCliente("");
  }

  function agregarProveedor() {
    if (!nombreProveedor) return;

    const nuevoProveedor: Proveedor = {
      id: Date.now(),
      nombre: nombreProveedor,
      telefono: telefonoProveedor,
      empresa: empresaProveedor,
    };

    setProveedores([nuevoProveedor, ...proveedores]);

    setNombreProveedor("");
    setTelefonoProveedor("");
    setEmpresaProveedor("");
  }

  function agregarMovimiento() {
    if (!descripcionMovimiento || !montoMovimiento) return;

    const nuevoMovimiento: MovimientoCaja = {
      id: Date.now(),
      tipo: tipoMovimiento,
      descripcion: descripcionMovimiento,
      monto: Number(montoMovimiento),
      fecha: new Date().toLocaleDateString("es-AR"),
    };

    setMovimientos([nuevoMovimiento, ...movimientos]);

    setDescripcionMovimiento("");
    setMontoMovimiento("");
  }

  function eliminarCliente(id: number) {
    setClientes(clientes.filter((c) => c.id !== id));
  }

  function eliminarProveedor(id: number) {
    setProveedores(proveedores.filter((p) => p.id !== id));
  }

  function eliminarMovimiento(id: number) {
    setMovimientos(movimientos.filter((m) => m.id !== id));
  }

  const totalFiado = useMemo(() => {
    return clientes.reduce((acc, cliente) => acc + cliente.deuda, 0);
  }, [clientes]);

  const ingresos = useMemo(() => {
    return movimientos
      .filter((m) => m.tipo === "Ingreso")
      .reduce((acc, m) => acc + m.monto, 0);
  }, [movimientos]);

  const gastos = useMemo(() => {
    return movimientos
      .filter((m) => m.tipo === "Gasto")
      .reduce((acc, m) => acc + m.monto, 0);
  }, [movimientos]);

  const caja = ingresos - gastos;

  function mensajeWhatsApp(cliente: Cliente) {
    const texto = `Hola ${cliente.nombre}, te recordamos que tenés un saldo pendiente de $${cliente.deuda.toLocaleString(
      "es-AR"
    )}. Gracias.`;

    const url = `https://wa.me/54${cliente.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(
      texto
    )}`;

    window.open(url, "_blank");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 pb-28">
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-6 rounded-b-3xl shadow-2xl sticky top-0 z-50">
        <h1 className="text-2xl font-bold">negocio-facil</h1>
        <p className="text-sm text-gray-300 mt-1">
          Gestión moderna para comercios argentinos
        </p>
      </header>

      <main className="p-4 space-y-5">
        {pantalla === "inicio" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/90 backdrop-blur rounded-3xl p-5 shadow-xl border border-white/40">
                <p className="text-sm text-gray-500">Clientes</p>
                <h2 className="text-2xl font-bold mt-1">
                  {clientes.length}
                </h2>
              </div>

              <div className="bg-white/90 backdrop-blur rounded-3xl p-5 shadow-xl border border-white/40">
                <p className="text-sm text-gray-500">Fiado total</p>
                <h2 className="text-xl font-bold mt-1 text-red-600">
                  ${totalFiado.toLocaleString("es-AR")}
                </h2>
              </div>

              <div className="bg-white/90 backdrop-blur rounded-3xl p-5 shadow-xl border border-white/40">
                <p className="text-sm text-gray-500">Caja diaria</p>
                <h2 className="text-xl font-bold mt-1 text-green-600">
                  ${caja.toLocaleString("es-AR")}
                </h2>
              </div>

              <div className="bg-white/90 backdrop-blur rounded-3xl p-5 shadow-xl border border-white/40">
                <p className="text-sm text-gray-500">Proveedores</p>
                <h2 className="text-2xl font-bold mt-1">
                  {proveedores.length}
                </h2>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur rounded-3xl p-5 shadow-xl border border-white/40">
              <h2 className="text-xl font-bold mb-3">
                Estado del negocio
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Total ingresos</span>
                  <strong className="text-green-600">
                    ${ingresos.toLocaleString("es-AR")}
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span>Total gastos</span>
                  <strong className="text-red-600">
                    ${gastos.toLocaleString("es-AR")}
                  </strong>
                </div>

                <div className="flex justify-between border-t pt-3 text-base">
                  <span>Resultado</span>
                  <strong>
                    ${caja.toLocaleString("es-AR")}
                  </strong>
                </div>
              </div>
            </div>
          </>
        )}

        {pantalla === "clientes" && (
          <>
            <div className="bg-white rounded-3xl p-5 shadow-lg space-y-3">
              <h2 className="text-xl font-bold">Nuevo cliente</h2>

              <input
                className="w-full border rounded-2xl p-3"
                placeholder="Nombre"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
              />

              <input
                className="w-full border rounded-2xl p-3"
                placeholder="Teléfono"
                value={telefonoCliente}
                onChange={(e) => setTelefonoCliente(e.target.value)}
              />

              <input
                className="w-full border rounded-2xl p-3"
                placeholder="Deuda / Fiado"
                type="number"
                value={deudaCliente}
                onChange={(e) => setDeudaCliente(e.target.value)}
              />

              <button
                onClick={agregarCliente}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-2xl font-bold shadow-xl active:scale-95 transition-all"
              >
                Guardar cliente
              </button>
            </div>

            <div className="space-y-3">
              {clientes.map((cliente) => (
                <div
                  key={cliente.id}
                  className="bg-white/90 backdrop-blur rounded-3xl p-5 shadow-xl border border-white/40"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">
                        {cliente.nombre}
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        📞 {cliente.telefono || "Sin teléfono"}
                      </p>
                    </div>

                    <button
                      onClick={() => eliminarCliente(cliente.id)}
                      className="text-red-500 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-red-600 font-bold text-lg">
                      💰 ${cliente.deuda.toLocaleString("es-AR")}
                    </p>

                    {cliente.telefono && (
                      <button
                        onClick={() => mensajeWhatsApp(cliente)}
                        className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm"
                      >
                        WhatsApp
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {pantalla === "caja" && (
          <>
            <div className="bg-white rounded-3xl p-5 shadow-lg space-y-3">
              <h2 className="text-xl font-bold">Caja diaria</h2>

              <select
                className="w-full border rounded-2xl p-3"
                value={tipoMovimiento}
                onChange={(e) =>
                  setTipoMovimiento(e.target.value as "Ingreso" | "Gasto")
                }
              >
                <option value="Ingreso">Ingreso</option>
                <option value="Gasto">Gasto</option>
              </select>

              <input
                className="w-full border rounded-2xl p-3"
                placeholder="Descripción"
                value={descripcionMovimiento}
                onChange={(e) => setDescripcionMovimiento(e.target.value)}
              />

              <input
                className="w-full border rounded-2xl p-3"
                placeholder="Monto"
                type="number"
                value={montoMovimiento}
                onChange={(e) => setMontoMovimiento(e.target.value)}
              />

              <button
                onClick={agregarMovimiento}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-2xl font-bold shadow-xl active:scale-95 transition-all"
              >
                Guardar movimiento
              </button>
            </div>

            <div className="space-y-3">
              {movimientos.map((movimiento) => (
                <div
                  key={movimiento.id}
                  className="bg-white/90 backdrop-blur rounded-3xl p-5 shadow-xl border border-white/40"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">
                        {movimiento.descripcion}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {movimiento.fecha}
                      </p>
                    </div>

                    <button
                      onClick={() => eliminarMovimiento(movimiento.id)}
                      className="text-red-500 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>

                  <p
                    className={`mt-3 text-lg font-bold ${
                      movimiento.tipo === "Ingreso"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {movimiento.tipo === "Ingreso" ? "+" : "-"}$
                    {movimiento.monto.toLocaleString("es-AR")}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {pantalla === "proveedores" && (
          <>
            <div className="bg-white rounded-3xl p-5 shadow-lg space-y-3">
              <h2 className="text-xl font-bold">Nuevo proveedor</h2>

              <input
                className="w-full border rounded-2xl p-3"
                placeholder="Nombre"
                value={nombreProveedor}
                onChange={(e) => setNombreProveedor(e.target.value)}
              />

              <input
                className="w-full border rounded-2xl p-3"
                placeholder="Empresa"
                value={empresaProveedor}
                onChange={(e) => setEmpresaProveedor(e.target.value)}
              />

              <input
                className="w-full border rounded-2xl p-3"
                placeholder="Teléfono"
                value={telefonoProveedor}
                onChange={(e) => setTelefonoProveedor(e.target.value)}
              />

              <button
                onClick={agregarProveedor}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-2xl font-bold shadow-xl active:scale-95 transition-all"
              >
                Guardar proveedor
              </button>
            </div>

            <div className="space-y-3">
              {proveedores.map((proveedor) => (
                <div
                  key={proveedor.id}
                  className="bg-white/90 backdrop-blur rounded-3xl p-5 shadow-xl border border-white/40"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">
                        {proveedor.nombre}
                      </h3>

                      <p className="text-gray-500 mt-1">
                        🏢 {proveedor.empresa}
                      </p>

                      <p className="text-gray-500 mt-1">
                        📞 {proveedor.telefono}
                      </p>
                    </div>

                    <button
                      onClick={() => eliminarProveedor(proveedor.id)}
                      className="text-red-500 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <nav className="fixed bottom-3 left-3 right-3 bg-white/90 backdrop-blur rounded-3xl shadow-2xl flex justify-around p-4 border border-gray-200">
        <button
          onClick={() => setPantalla("inicio")}
          className="text-sm font-semibold"
        >
          Inicio
        </button>

        <button
          onClick={() => setPantalla("clientes")}
          className="text-sm font-semibold"
        >
          Clientes
        </button>

        <button
          onClick={() => setPantalla("caja")}
          className="text-sm font-semibold"
        >
          Caja
        </button>

        <button
          onClick={() => setPantalla("proveedores")}
          className="text-sm font-semibold"
        >
          Proveedores
        </button>
      </nav>
    </div>
  );
}

export default App;