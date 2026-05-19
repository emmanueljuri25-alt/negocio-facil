import { useState } from "react";

export default function NegocioFacilPOS() {

  const [mostrarAgregar, setMostrarAgregar] = useState(false);

  const [telefonoCliente, setTelefonoCliente] = useState("");

  const [montoRecibido, setMontoRecibido] = useState("");

  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [nuevoStock, setNuevoStock] = useState("");
  const [nuevoCategoria, setNuevoCategoria] = useState("");

  const [productos, setProductos] = useState([
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

  const totalTicket = 9800;

  const cambio =
    Number(montoRecibido || 0) - totalTicket;

  function agregarNuevoProducto() {

    if (!nuevoNombre || !nuevoPrecio) return;

    const nuevoProductoData = {
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

  const ticketTexto = `
🧾 NEGOCIO-FÁCIL

Coca Cola 2.25L x2 - $7000
Pan Lactal x1 - $2800

TOTAL: $9800

Gracias por su compra ❤️
`;

  function imprimirTicket() {
    window.print();
  }

  function enviarWhatsApp() {

    const numero =
      telefonoCliente.replace(/\D/g, "");

    if (!numero) {
      alert("Ingresar teléfono");
      return;
    }

    const url =
      `https://wa.me/54${numero}?text=${encodeURIComponent(ticketTexto)}`;

    window.open(url, "_blank");
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 p-4">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">

        {/* PRODUCTOS */}

        <div className="lg:col-span-2 bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-5 border border-white/40">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

            <div>
              <h1 className="text-4xl font-black text-slate-800">
                NEGOCIO-FÁCIL
              </h1>

              <p className="text-gray-500 mt-1">
                Caja rápida para almacenes
              </p>
            </div>

            <input
              placeholder="Buscar producto..."
              className="w-full md:w-96 p-4 rounded-2xl border border-gray-200 shadow-sm text-lg"
            />

          </div>

          {/* CATEGORÍAS */}

          <div className="flex gap-3 overflow-auto pb-2 mb-6">

            {[
              "Todos",
              "Bebidas",
              "Almacén",
              "Snacks",
              "Panificados",
            ].map((cat) => (

              <button
                key={cat}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-2xl font-bold whitespace-nowrap shadow-lg active:scale-95 transition-all"
              >
                {cat}
              </button>

            ))}

          </div>

          {/* PRODUCTOS */}

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">

            {productos.map((producto) => (

              <button
                key={producto.id}
                className="bg-white rounded-3xl p-4 shadow-xl border border-gray-100 text-left active:scale-95 transition-all hover:shadow-2xl"
              >

                <div className="flex justify-between items-start">

                  <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">
                    {producto.categoria}
                  </span>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold text-white ${
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

                  <h3 className="font-bold text-lg text-slate-800 leading-tight">
                    {producto.nombre}
                  </h3>

                  <p className="text-3xl font-black text-indigo-600 mt-3">
                    ${producto.precio}
                  </p>

                </div>

              </button>

            ))}

          </div>

        </div>

        {/* TICKET */}

        <div className="ticket-print bg-slate-900 text-white rounded-3xl shadow-2xl p-5 flex flex-col">

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="text-3xl font-black">
                Ticket
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                Venta rápida
              </p>

            </div>

            <div className="bg-emerald-500 px-4 py-2 rounded-2xl font-bold shadow-lg">
              Caja abierta
            </div>

          </div>

          {/* PRODUCTOS TICKET */}

          <div className="space-y-3 flex-1 overflow-auto">

            <div className="bg-slate-800 rounded-2xl p-4 flex justify-between items-center">

              <div>

                <h3 className="font-bold">
                  Coca Cola 2.25L
                </h3>

                <p className="text-sm text-slate-400">
                  x2
                </p>

              </div>

              <div className="text-right">

                <p className="font-black text-xl">
                  $7000
                </p>

              </div>

            </div>

            <div className="bg-slate-800 rounded-2xl p-4 flex justify-between items-center">

              <div>

                <h3 className="font-bold">
                  Pan Lactal
                </h3>

                <p className="text-sm text-slate-400">
                  x1
                </p>

              </div>

              <div className="text-right">

                <p className="font-black text-xl">
                  $2800
                </p>

              </div>

            </div>

          </div>

          {/* TOTAL */}

          <div className="mt-6 bg-slate-800 rounded-3xl p-5 shadow-inner">

            <div className="flex justify-between items-center">

              <span className="text-slate-400 text-lg">
                TOTAL
              </span>

              <span className="text-5xl font-black text-emerald-400">
                $9800
              </span>

            </div>

          </div>

          {/* BOTONES */}

          <div className="grid grid-cols-2 gap-3 mt-6">

            <button className="bg-emerald-500 p-5 rounded-3xl text-xl font-black shadow-xl active:scale-95 transition-all">
              Efectivo
            </button>

            <button className="bg-indigo-500 p-5 rounded-3xl text-xl font-black shadow-xl active:scale-95 transition-all">
              Transferencia
            </button>

            <button className="bg-cyan-500 p-5 rounded-3xl text-xl font-black shadow-xl active:scale-95 transition-all">
              QR
            </button>

            <button className="bg-yellow-500 text-black p-5 rounded-3xl text-xl font-black shadow-xl active:scale-95 transition-all">
              Fiado
            </button>

          </div>

          {/* EFECTIVO */}

          <div className="mt-6 bg-slate-800 rounded-3xl p-5">

            <h3 className="text-xl font-bold mb-4">
              Cobro en efectivo
            </h3>

            <input
              type="number"
              placeholder="Dinero recibido"
              value={montoRecibido}
              onChange={(e) =>
                setMontoRecibido(e.target.value)
              }
              className="w-full p-4 rounded-2xl text-black text-xl font-bold"
            />

            <div className="mt-5 flex justify-between items-center">

              <span className="text-slate-400 text-xl">
                Cambio
              </span>

              <span className="text-4xl font-black text-emerald-400">
                ${cambio > 0 ? cambio : 0}
              </span>

            </div>

          </div>

          {/* IMPRESIÓN */}

          <div className="mt-6 grid grid-cols-2 gap-3">

            <button
              onClick={imprimirTicket}
              className="bg-white text-black p-5 rounded-3xl text-xl font-black shadow-xl active:scale-95 transition-all"
            >
              🖨 Imprimir
            </button>

            <button
              onClick={enviarWhatsApp}
              className="bg-green-500 text-white p-5 rounded-3xl text-xl font-black shadow-xl active:scale-95 transition-all"
            >
              WhatsApp
            </button>

          </div>

          <div className="mt-4">

            <input
              placeholder="Teléfono cliente"
              value={telefonoCliente}
              onChange={(e) =>
                setTelefonoCliente(e.target.value)
              }
              className="w-full p-4 rounded-2xl text-black text-xl font-bold"
            />

          </div>

        </div>

      </div>

      {/* BOTÓN FLOTANTE */}

      <button
        onClick={() =>
          setMostrarAgregar(true)
        }
        className="fixed bottom-6 right-6 w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-5xl shadow-2xl active:scale-95 transition-all z-50"
      >
        +
      </button>

      {/* MODAL */}

      {mostrarAgregar && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">

            <h2 className="text-3xl font-black mb-5">
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
                onClick={agregarNuevoProducto}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-2xl font-bold"
              >
                Guardar
              </button>

            </div>

          </div>

        </div>

      )}

      <style>
        {`
          @media print {

            body * {
              visibility: hidden;
            }

            .ticket-print,
            .ticket-print * {
              visibility: visible;
            }

            .ticket-print {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              background: white;
              color: black;
              padding: 20px;
            }

          }
        `}
      </style>

    </div>
  );
}