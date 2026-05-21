import { useEffect, useMemo, useState } from "react";
import Login from "./components/Login";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
};

export default function App() {

  // LOGIN

  const [logueado, setLogueado] =
    useState(false);

  if (!logueado) {

    return (
      <Login
        onLogin={() =>
          setLogueado(true)
        }
      />
    );

  }

  // STATES

  const [vista, setVista] = useState<
    "caja" |
    "stock" |
    "ventas"
  >("caja");

  const [productos, setProductos] =
    useState<Producto[]>([]);

  const [ticket, setTicket] =
    useState<any[]>([]);

  const [ventas, setVentas] =
    useState<any[]>([]);

  const [busqueda, setBusqueda] =
    useState("");

  const [montoRecibido, setMontoRecibido] =
    useState("");

  const [telefonoCliente, setTelefonoCliente] =
    useState("");

  // NUEVO PRODUCTO

  const [mostrarNuevo, setMostrarNuevo] =
    useState(false);

  const [nuevoNombre, setNuevoNombre] =
    useState("");

  const [nuevoPrecio, setNuevoPrecio] =
    useState("");

  const [nuevoStock, setNuevoStock] =
    useState("");

  const [nuevoCategoria, setNuevoCategoria] =
    useState("");

  // STORAGE

  useEffect(() => {

    const p =
      localStorage.getItem("productos");

    const v =
      localStorage.getItem("ventas");

    if (p) {
      setProductos(JSON.parse(p));
    }

    if (v) {
      setVentas(JSON.parse(v));
    }

    if (!p) {

      setProductos([
        {
          id: 1,
          nombre: "Coca Cola",
          precio: 3500,
          stock: 10,
          categoria: "Bebidas",
        },
        {
          id: 2,
          nombre: "Yerba",
          precio: 7200,
          stock: 5,
          categoria: "Almacén",
        },
      ]);

    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "productos",
      JSON.stringify(productos)
    );

  }, [productos]);

  useEffect(() => {

    localStorage.setItem(
      "ventas",
      JSON.stringify(ventas)
    );

  }, [ventas]);

  // FILTRO

  const productosFiltrados =
    useMemo(() => {

      return productos.filter((p) =>
        p.nombre
          .toLowerCase()
          .includes(
            busqueda.toLowerCase()
          )
      );

    }, [productos, busqueda]);

  // TOTALES

  const totalTicket = ticket.reduce(
    (acc, item) =>
      acc +
      item.precio * item.cantidad,
    0
  );

  const totalCaja = ventas.reduce(
    (acc, venta) =>
      acc + venta.total,
    0
  );

  const cambio =
    Number(montoRecibido || 0) -
    totalTicket;

  // AGREGAR PRODUCTO

  function agregarProducto() {

    if (
      !nuevoNombre ||
      !nuevoPrecio
    ) return;

    const nuevo = {
      id: Date.now(),
      nombre: nuevoNombre,
      precio: Number(nuevoPrecio),
      stock: Number(nuevoStock),
      categoria: nuevoCategoria,
    };

    setProductos([
      ...productos,
      nuevo,
    ]);

    setNuevoNombre("");
    setNuevoPrecio("");
    setNuevoStock("");
    setNuevoCategoria("");

    setMostrarNuevo(false);

  }

  // AGREGAR TICKET

  function agregarAlTicket(
    producto: Producto
  ) {

    const existe = ticket.find(
      (t) => t.id === producto.id
    );

    if (existe) {

      setTicket(
        ticket.map((t) =>
          t.id === producto.id
            ? {
                ...t,
                cantidad:
                  t.cantidad + 1,
              }
            : t
        )
      );

    } else {

      setTicket([
        ...ticket,
        {
          ...producto,
          cantidad: 1,
        },
      ]);

    }

  }

  // FINALIZAR

  function finalizarVenta(
    metodo: string
  ) {

    if (ticket.length === 0) return;

    const venta = {
      id: Date.now(),
      fecha:
        new Date().toLocaleString(),
      metodo,
      total: totalTicket,
      productos: ticket,
    };

    setVentas([
      venta,
      ...ventas,
    ]);

    const actualizados =
      productos.map((p) => {

        const vendido =
          ticket.find(
            (t) => t.id === p.id
          );

        if (!vendido) return p;

        return {
          ...p,
          stock:
            p.stock -
            vendido.cantidad,
        };

      });

    setProductos(actualizados);

    setTicket([]);

    setMontoRecibido("");

  }

  // WHATSAPP

  function enviarWhatsApp() {

    const numero =
      telefonoCliente.replace(/\D/g, "");

    const detalle =
      ticket
        .map(
          (p) =>
            `${p.nombre} x${p.cantidad}`
        )
        .join("\n");

    const mensaje =
`🧾 NEGOCIO FÁCIL

${detalle}

TOTAL: $${totalTicket}`;

    window.open(
      `https://wa.me/54${numero}?text=${encodeURIComponent(mensaje)}`,
      "_blank"
    );

  }

  // QR

  const qr =
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TOTAL:${totalTicket}`;

  // UI

  return (

    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}

      <div className="bg-white p-5 shadow-lg flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-black">
            NEGOCIO FÁCIL
          </h1>

          <p className="text-gray-500">
            Sistema POS
          </p>

        </div>

        <div className="bg-emerald-100 px-5 py-3 rounded-2xl">

          <p className="text-sm">
            Caja diaria
          </p>

          <h2 className="text-3xl font-black text-emerald-600">
            ${totalCaja}
          </h2>

        </div>

      </div>

      {/* NAV */}

      <div className="p-4 flex gap-3">

        <button
          onClick={() =>
            setVista("caja")
          }
          className="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-bold"
        >
          Caja
        </button>

        <button
          onClick={() =>
            setVista("stock")
          }
          className="bg-white px-5 py-3 rounded-2xl font-bold"
        >
          Stock
        </button>

        <button
          onClick={() =>
            setVista("ventas")
          }
          className="bg-white px-5 py-3 rounded-2xl font-bold"
        >
          Ventas
        </button>

      </div>

      {/* CAJA */}

      {vista === "caja" && (

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 p-4">

          {/* PRODUCTOS */}

          <div className="xl:col-span-2">

            <input
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(
                  e.target.value
                )
              }
              className="w-full p-4 rounded-2xl mb-4"
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

              {productosFiltrados.map(
                (producto) => (

                  <button
                    key={producto.id}
                    onClick={() =>
                      agregarAlTicket(
                        producto
                      )
                    }
                    className="bg-white rounded-3xl p-4 shadow-xl text-left"
                  >

                    <h3 className="font-black text-xl">
                      {
                        producto.nombre
                      }
                    </h3>

                    <p className="text-indigo-600 text-3xl font-black mt-3">
                      $
                      {
                        producto.precio
                      }
                    </p>

                    <p className="mt-3 text-sm">
                      Stock:
                      {
                        producto.stock
                      }
                    </p>

                  </button>

                )
              )}

            </div>

          </div>

          {/* TICKET */}

          <div className="bg-slate-900 text-white rounded-3xl p-5">

            <h2 className="text-4xl font-black">
              Ticket
            </h2>

            <div className="space-y-3 mt-5">

              {ticket.map((item) => (

                <div
                  key={item.id}
                  className="bg-slate-800 rounded-2xl p-4 flex justify-between"
                >

                  <div>

                    <h3>
                      {item.nombre}
                    </h3>

                    <p>
                      x{item.cantidad}
                    </p>

                  </div>

                  <p className="font-black">
                    $
                    {item.precio *
                      item.cantidad}
                  </p>

                </div>

              ))}

            </div>

            <div className="bg-slate-800 p-5 rounded-3xl mt-5">

              <div className="flex justify-between">

                <span>TOTAL</span>

                <span className="text-4xl font-black text-emerald-400">
                  ${totalTicket}
                </span>

              </div>

            </div>

            <div className="mt-5">

              <input
                type="number"
                placeholder="Dinero recibido"
                value={montoRecibido}
                onChange={(e) =>
                  setMontoRecibido(
                    e.target.value
                  )
                }
                className="w-full bg-white text-black p-4 rounded-2xl"
              />

              <div className="flex justify-between mt-3">

                <span>
                  Cambio
                </span>

                <span className="font-black text-emerald-400">
                  $
                  {cambio > 0
                    ? cambio
                    : 0}
                </span>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">

              <button
                onClick={() =>
                  finalizarVenta(
                    "Efectivo"
                  )
                }
                className="bg-emerald-500 p-4 rounded-2xl font-black"
              >
                Efectivo
              </button>

              <button
                onClick={() =>
                  finalizarVenta(
                    "QR"
                  )
                }
                className="bg-cyan-500 p-4 rounded-2xl font-black"
              >
                QR
              </button>

            </div>

            <div className="bg-white rounded-3xl p-4 mt-5">

              <img
                src={qr}
                alt="QR"
                className="w-full"
              />

            </div>

            <div className="mt-5">

              <input
                placeholder="WhatsApp"
                value={
                  telefonoCliente
                }
                onChange={(e) =>
                  setTelefonoCliente(
                    e.target.value
                  )
                }
                className="w-full bg-white text-black p-4 rounded-2xl"
              />

              <button
                onClick={
                  enviarWhatsApp
                }
                className="w-full bg-green-500 p-4 rounded-2xl mt-3 font-black"
              >
                Enviar WhatsApp
              </button>

            </div>

          </div>

        </div>

      )}

      {/* STOCK */}

      {vista === "stock" && (

        <div className="p-4">

          <div className="bg-white rounded-3xl p-5">

            <div className="flex justify-between items-center">

              <h2 className="text-4xl font-black">
                Stock
              </h2>

              <button
                onClick={() =>
                  setMostrarNuevo(
                    true
                  )
                }
                className="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-black"
              >
                + Producto
              </button>

            </div>

            <div className="space-y-3 mt-5">

              {productos.map(
                (producto) => (

                  <div
                    key={producto.id}
                    className="bg-slate-100 rounded-2xl p-4 flex justify-between"
                  >

                    <div>

                      <h3 className="font-black">
                        {
                          producto.nombre
                        }
                      </h3>

                      <p>
                        Stock:
                        {
                          producto.stock
                        }
                      </p>

                    </div>

                    <p className="font-black text-indigo-600">
                      $
                      {
                        producto.precio
                      }
                    </p>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      )}

      {/* VENTAS */}

      {vista === "ventas" && (

        <div className="p-4 space-y-4">

          {ventas.map((venta) => (

            <div
              key={venta.id}
              className="bg-white rounded-3xl p-5"
            >

              <div className="flex justify-between">

                <div>

                  <h3 className="font-black text-2xl">
                    {venta.metodo}
                  </h3>

                  <p className="text-gray-500">
                    {venta.fecha}
                  </p>

                </div>

                <p className="text-3xl font-black text-indigo-600">
                  $
                  {venta.total}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* MODAL */}

      {mostrarNuevo && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl p-6 w-full max-w-md">

            <h2 className="text-3xl font-black mb-5">
              Nuevo producto
            </h2>

            <div className="space-y-3">

              <input
                placeholder="Nombre"
                value={nuevoNombre}
                onChange={(e) =>
                  setNuevoNombre(
                    e.target.value
                  )
                }
                className="w-full border p-4 rounded-2xl"
              />

              <input
                placeholder="Categoría"
                value={nuevoCategoria}
                onChange={(e) =>
                  setNuevoCategoria(
                    e.target.value
                  )
                }
                className="w-full border p-4 rounded-2xl"
              />

              <input
                type="number"
                placeholder="Precio"
                value={nuevoPrecio}
                onChange={(e) =>
                  setNuevoPrecio(
                    e.target.value
                  )
                }
                className="w-full border p-4 rounded-2xl"
              />

              <input
                type="number"
                placeholder="Stock"
                value={nuevoStock}
                onChange={(e) =>
                  setNuevoStock(
                    e.target.value
                  )
                }
                className="w-full border p-4 rounded-2xl"
              />

            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">

              <button
                onClick={() =>
                  setMostrarNuevo(
                    false
                  )
                }
                className="bg-gray-200 p-4 rounded-2xl"
              >
                Cancelar
              </button>

              <button
                onClick={
                  agregarProducto
                }
                className="bg-indigo-600 text-white p-4 rounded-2xl"
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