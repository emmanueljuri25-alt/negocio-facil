import { useEffect, useState } from "react";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
};

type Venta = {
  id: number;
  fecha: string;
  total: number;
  metodo: string;
};

export default function NegocioFacilPOS() {

  // ===============================
  // STATES
  // ===============================

  const [vista, setVista] = useState<"caja" | "stock">("caja");

  const [telefonoCliente, setTelefonoCliente] = useState("");

  const [montoRecibido, setMontoRecibido] = useState("");

  const [mostrarAgregar, setMostrarAgregar] = useState(false);

  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [nuevoStock, setNuevoStock] = useState("");
  const [nuevoCategoria, setNuevoCategoria] = useState("");

  const [ventas, setVentas] = useState<Venta[]>([]);

  const [productos, setProductos] = useState<Producto[]>([
    {
      id: 1,
      nombre: "Coca Cola 2.25L",
      precio: 3500,
      stock: 12,
      categoria: "Bebidas",
    },
    {
      id: 2,
      nombre: "Pan Lactal",
      precio: 2800,
      stock: 5,
      categoria: "Panificados",
    },
    {
      id: 3,
      nombre: "Yerba 1KG",
      precio: 7200,
      stock: 3,
      categoria: "Almacén",
    },
  ]);

  // ===============================
  // STORAGE
  // ===============================

  useEffect(() => {

    const productosGuardados =
      localStorage.getItem("productos_pos");

    const ventasGuardadas =
      localStorage.getItem("ventas_pos");

    if (productosGuardados) {
      setProductos(JSON.parse(productosGuardados));
    }

    if (ventasGuardadas) {
      setVentas(JSON.parse(ventasGuardadas));
    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "productos_pos",
      JSON.stringify(productos)
    );

  }, [productos]);

  useEffect(() => {

    localStorage.setItem(
      "ventas_pos",
      JSON.stringify(ventas)
    );

  }, [ventas]);

  // ===============================
  // TICKET
  // ===============================

  const totalTicket = 9800;

  const cambio =
    Number(montoRecibido || 0) - totalTicket;

  // ===============================
  // AGREGAR PRODUCTO
  // ===============================

  function agregarProducto() {

    if (!nuevoNombre || !nuevoPrecio) return;

    const nuevoProductoData: Producto = {
      id: Date.now(),
      nombre: nuevoNombre,
      precio: Number(nuevoPrecio),
      stock: Number(nuevoStock),
      categoria: nuevoCategoria,
    };

    setProductos([
      ...productos,
      nuevoProductoData,
    ]);

    setNuevoNombre("");
    setNuevoPrecio("");
    setNuevoStock("");
    setNuevoCategoria("");

    setMostrarAgregar(false);
  }

  // ===============================
  // GUARDAR VENTA
  // ===============================

  function finalizarVenta(metodo: string) {

    const nuevaVenta: Venta = {
      id: Date.now(),
      fecha: new Date().toLocaleString(),
      total: totalTicket,
      metodo,
    };

    setVentas([nuevaVenta, ...ventas]);

    alert("Venta registrada");
  }

  // ===============================
  // TICKET WHATSAPP
  // ===============================

  const ticketTexto = `
🧾 NEGOCIO-FÁCIL

TOTAL: $${totalTicket}

Gracias por su compra ❤️
`;

  function enviarWhatsApp() {

    if (!telefonoCliente) {
      alert("Ingresar teléfono");
      return;
    }

    const numero =
      telefonoCliente.replace(/\D/g, "");

    const url =
      `https://wa.me/54${numero}?text=${encodeURIComponent(ticketTexto)}`;

    window.open(url, "_blank");
  }

  // ===============================
  // IMPRIMIR
  // ===============================

  function imprimirTicket() {
    window.print();
  }

  // ===============================
  // CAJA DÍA
  // ===============================

  const totalCaja = ventas.reduce(
    (acc, venta) => acc + venta.total,
    0
  );

  // ===============================
  // QR
  // ===============================

  const qrUrl =
    `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=TOTAL:${totalTicket}`;

  // ===============================
  // UI
  // ===============================

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 p-4">

      {/* NAV */}

      <div className="flex gap-3 mb-4">

        <button
          onClick={() => setVista("caja")}
          className={`px-6 py-3 rounded-2xl font-bold shadow-lg ${
            vista === "caja"
              ? "bg-indigo-600 text-white"
              : "bg-white"
          }`}
        >
          Caja
        </button>

        <button
          onClick={() => setVista("stock")}
          className={`px-6 py-3 rounded-2xl font-bold shadow-lg ${
            vista === "stock"
              ? "bg-indigo-600 text-white"
              : "bg-white"
          }`}
        >
          Stock
        </button>

      </div>

      {/* CAJA */}

      {vista === "caja" && (

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* TICKET */}

          <div className="xl:order-2 bg-slate-900 text-white rounded-3xl p-5 shadow-2xl">

            <h2 className="text-4xl font-black">
              Ticket
            </h2>

            <div className="mt-6 bg-slate-800 rounded-3xl p-5">

              <div className="flex justify-between items-center">

                <span className="text-xl text-slate-400">
                  TOTAL
                </span>

                <span className="text-5xl font-black text-emerald-400">
                  ${totalTicket}
                </span>

              </div>

            </div>

            {/* EFECTIVO */}

            <div className="mt-6 bg-slate-800 rounded-3xl p-5">

              <h3 className="text-xl font-bold mb-4">
                Cobro efectivo
              </h3>

              <input
                type="number"
                placeholder="Dinero recibido"
                value={montoRecibido}
                onChange={(e) =>
                  setMontoRecibido(e.target.value)
                }
                className="w-full bg-white text-black p-4 rounded-2xl text-2xl font-black"
              />

              <div className="mt-5 flex justify-between">

                <span className="text-slate-400 text-xl">
                  Cambio
                </span>

                <span className="text-4xl font-black text-emerald-400">
                  ${cambio > 0 ? cambio : 0}
                </span>

              </div>

            </div>

            {/* BOTONES */}

            <div className="grid grid-cols-2 gap-3 mt-6">

              <button
                onClick={() =>
                  finalizarVenta("Efectivo")
                }
                className="bg-emerald-500 p-5 rounded-3xl text-xl font-black shadow-xl"
              >
                Efectivo
              </button>

              <button
                onClick={() =>
                  finalizarVenta("Transferencia")
                }
                className="bg-indigo-500 p-5 rounded-3xl text-xl font-black shadow-xl"
              >
                Transferencia
              </button>

              <button
                onClick={() =>
                  finalizarVenta("QR")
                }
                className="bg-cyan-500 p-5 rounded-3xl text-xl font-black shadow-xl"
              >
                QR
              </button>

              <button
                onClick={() =>
                  finalizarVenta("Fiado")
                }
                className="bg-yellow-500 text-black p-5 rounded-3xl text-xl font-black shadow-xl"
              >
                Fiado
              </button>

            </div>

            {/* QR */}

            <div className="mt-6 bg-white rounded-3xl p-5">

              <h3 className="text-black text-2xl font-black mb-4">
                QR Pago
              </h3>

              <img
                src={qrUrl}
                alt="QR"
                className="w-full rounded-2xl"
              />

            </div>

            {/* WHATSAPP */}

            <div className="mt-6">

              <input
                placeholder="WhatsApp cliente"
                value={telefonoCliente}
                onChange={(e) =>
                  setTelefonoCliente(e.target.value)
                }
                className="w-full bg-white text-black p-4 rounded-2xl text-xl font-bold"
              />

              <button
                onClick={enviarWhatsApp}
                className="w-full mt-3 bg-green-500 text-white p-5 rounded-3xl text-xl font-black shadow-xl"
              >
                Enviar Ticket WhatsApp
              </button>

            </div>

            {/* IMPRESIÓN */}

            <button
              onClick={imprimirTicket}
              className="w-full mt-4 bg-white text-black p-5 rounded-3xl text-xl font-black shadow-xl"
            >
              🖨 Imprimir Ticket
            </button>

            {/* CAJA */}

            <div className="mt-6 bg-slate-800 rounded-3xl p-5">

              <h3 className="text-xl font-bold">
                Caja del día
              </h3>

              <p className="text-5xl font-black text-emerald-400 mt-3">
                ${totalCaja}
              </p>

              <div className="mt-4 space-y-2">

                {ventas.slice(0, 5).map((venta) => (

                  <div
                    key={venta.id}
                    className="bg-slate-700 rounded-2xl p-3"
                  >

                    <p className="font-bold">
                      ${venta.total}
                    </p>

                    <p className="text-sm text-slate-300">
                      {venta.metodo}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* PRODUCTOS */}

          <div className="xl:col-span-2 xl:order-1 bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-5">

            <div className="flex justify-between items-center mb-6">

              <div>

                <h1 className="text-5xl font-black text-slate-800">
                  NEGOCIO-FÁCIL
                </h1>

                <p className="text-gray-500 mt-1">
                  POS Profesional
                </p>

              </div>

            </div>

            <input
              placeholder="Buscar producto..."
              className="w-full p-5 rounded-3xl border text-xl font-bold mb-6"
            />

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">

              {productos.map((producto) => (

                <button
                  key={producto.id}
                  className="bg-white rounded-3xl p-4 shadow-xl border text-left"
                >

                  <div className="flex justify-between">

                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                      {producto.categoria}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs text-white font-bold ${
                        producto.stock <= 3
                          ? "bg-red-500"
                          : producto.stock <= 6
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    >
                      {producto.stock}
                    </span>

                  </div>

                  <div className="mt-6">

                    <h3 className="font-black text-xl">
                      {producto.nombre}
                    </h3>

                    <p className="text-4xl font-black text-indigo-600 mt-3">
                      ${producto.precio}
                    </p>

                  </div>

                </button>

              ))}

            </div>

          </div>

        </div>

      )}

      {/* STOCK */}

      {vista === "stock" && (

        <div className="bg-white rounded-3xl p-6 shadow-2xl">

          <div className="flex justify-between items-center">

            <h2 className="text-4xl font-black">
              Control Stock
            </h2>

            <button
              onClick={() =>
                setMostrarAgregar(true)
              }
              className="bg-indigo-600 text-white px-6 py-4 rounded-2xl text-xl font-black shadow-xl"
            >
              + Producto
            </button>

          </div>

          <div className="space-y-3 mt-6">

            {productos.map((producto) => (

              <div
                key={producto.id}
                className="bg-slate-100 rounded-3xl p-5 flex justify-between items-center"
              >

                <div>

                  <h3 className="text-2xl font-black">
                    {producto.nombre}
                  </h3>

                  <p className="text-gray-500">
                    {producto.categoria}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-3xl font-black text-indigo-600">
                    ${producto.precio}
                  </p>

                  <p className="font-bold">
                    Stock: {producto.stock}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

      {/* MODAL */}

      {mostrarAgregar && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-3xl p-6 w-full max-w-md">

            <h2 className="text-4xl font-black mb-5">
              Nuevo producto
            </h2>

            <div className="space-y-3">

              <input
                placeholder="Nombre"
                value={nuevoNombre}
                onChange={(e) =>
                  setNuevoNombre(e.target.value)
                }
                className="w-full border p-4 rounded-2xl"
              />

              <input
                placeholder="Categoría"
                value={nuevoCategoria}
                onChange={(e) =>
                  setNuevoCategoria(e.target.value)
                }
                className="w-full border p-4 rounded-2xl"
              />

              <input
                type="number"
                placeholder="Precio"
                value={nuevoPrecio}
                onChange={(e) =>
                  setNuevoPrecio(e.target.value)
                }
                className="w-full border p-4 rounded-2xl"
              />

              <input
                type="number"
                placeholder="Stock"
                value={nuevoStock}
                onChange={(e) =>
                  setNuevoStock(e.target.value)
                }
                className="w-full border p-4 rounded-2xl"
              />

            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">

              <button
                onClick={() =>
                  setMostrarAgregar(false)
                }
                className="bg-gray-200 p-4 rounded-2xl font-bold"
              >
                Cancelar
              </button>

              <button
                onClick={agregarProducto}
                className="bg-indigo-600 text-white p-4 rounded-2xl font-bold"
              >
                Guardar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}