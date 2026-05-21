import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Login from "./components/Login";

export default function App() {

  // ======================================================
  // LOGIN
  // ======================================================

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

  // ======================================================
  // TYPES
  // ======================================================

  type Producto = {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    categoria: string;
  };

  // ======================================================
  // STATES
  // ======================================================

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

  const [telefonoCliente, setTelefonoCliente] =
    useState("");

  const [montoRecibido, setMontoRecibido] =
    useState("");

  const [busqueda, setBusqueda] =
    useState("");

  // ======================================================
  // NUEVO PRODUCTO
  // ======================================================

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

  // ======================================================
  // PRODUCTO MANUAL
  // ======================================================

  const [productoManual, setProductoManual] =
    useState("");

  const [precioManual, setPrecioManual] =
    useState("");

  // ======================================================
  // STORAGE
  // ======================================================

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
          nombre: "Coca Cola 2.25",
          precio: 3500,
          stock: 10,
          categoria: "Bebidas",
        },
        {
          id: 2,
          nombre: "Yerba 1KG",
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

  // ======================================================
  // FILTRO
  // ======================================================

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

  // ======================================================
  // TOTALES
  // ======================================================

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

  // ======================================================
  // AGREGAR PRODUCTO
  // ======================================================

  function agregarProducto() {

    if (
      !nuevoNombre ||
      !nuevoPrecio
    ) {
      alert("Completar datos");
      return;
    }

    const nuevo = {
      id: Date.now(),
      nombre: nuevoNombre,
      precio: Number(nuevoPrecio),
      stock: Number(nuevoStock || 0),
      categoria:
        nuevoCategoria || "General",
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

  // ======================================================
  // AGREGAR TICKET
  // ======================================================

  function agregarAlTicket(
    producto: Producto
  ) {

    if (producto.stock <= 0) {
      alert("Sin stock");
      return;
    }

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

  // ======================================================
  // PRODUCTO MANUAL
  // ======================================================

  function agregarProductoManual() {

    if (
      !productoManual ||
      !precioManual
    ) return;

    setTicket([
      ...ticket,
      {
        id: Date.now(),
        nombre: productoManual,
        precio: Number(precioManual),
        cantidad: 1,
      },
    ]);

    setProductoManual("");
    setPrecioManual("");
  }

  // ======================================================
  // NUEVA VENTA
  // ======================================================

  function nuevaVenta() {

    setTicket([]);
    setMontoRecibido("");
    setTelefonoCliente("");

  }

  // ======================================================
  // FINALIZAR
  // ======================================================

  function finalizarVenta(
    metodo: string
  ) {

    if (ticket.length === 0) {
      alert("No hay productos");
      return;
    }

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

    nuevaVenta();

    alert("Venta realizada");

  }

  // ======================================================
  // WHATSAPP
  // ======================================================

  function enviarWhatsApp() {

    if (!telefonoCliente) {
      alert("Ingresar WhatsApp");
      return;
    }

    const numero =
      telefonoCliente.replace(/\D/g, "");

    const detalle =
      ticket
        .map(
          (p) =>
            `${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}`
        )
        .join("\n");

    const mensaje =
`🧾 NEGOCIO FÁCIL

${detalle}

TOTAL: $${totalTicket}

Gracias ❤️`;

    const url =
      `https://wa.me/54${numero}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
  }

  // ======================================================
  // QR
  // ======================================================

  const qr =
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TOTAL:${totalTicket}`;

  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100">

      {/* HEADER */}

      <div className="bg-white shadow-xl p-5 flex justify-between items-center flex-wrap gap-4">

        <div>

          <h1 className="text-4xl font-black text-slate-800">
            NEGOCIO FÁCIL
          </h1>

          <p className="text-gray-500">
            Sistema POS
          </p>

        </div>

        <div className="bg-emerald-100 px-6 py-4 rounded-3xl">

          <p className="text-sm text-emerald-700">
            Caja diaria
          </p>

          <h3 className="text-3xl font-black text-emerald-600">
            ${totalCaja}
          </h3>

        </div>

      </div>

      {/* NAV */}

      <div className="p-4 flex gap-3">

        <button
          onClick={() =>
            setVista("caja")
          }
          className={`px-5 py-3 rounded-2xl font-black ${
            vista === "caja"
              ? "bg-indigo-600 text-white"
              : "bg-white"
          }`}
        >
          Caja
        </button>

        <button
          onClick={() =>
            setVista("stock")
          }
          className={`px-5 py-3 rounded-2xl font-black ${
            vista === "stock"
              ? "bg-indigo-600 text-white"
              : "bg-white"
          }`}
        >
          Stock
        </button>

        <button
          onClick={() =>
            setVista("ventas")
          }
          className={`px-5 py-3 rounded-2xl font-black ${
            vista === "ventas"
              ? "bg-indigo-600 text-white"
              : "bg-white"
          }`}
        >
          Ventas
        </button>

      </div>

      {/* CAJA */}

      {vista === "caja" && (

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 p-4">

          <div className="xl:col-span-2">

            <div className="bg-white rounded-3xl p-4 shadow-xl mb-4">

              <input
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(
                    e.target.value
                  )
                }
                className="w-full bg-slate-100 rounded-2xl p-5 text-xl outline-none"
              />

            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">

              {productosFiltrados.map(
                (producto) => (

                  <button
                    key={producto.id}
                    onClick={() =>
                      agregarAlTicket(
                        producto
                      )
                    }
                    className="bg-white rounded-3xl p-4 shadow-xl text-left hover:scale-105 transition-all"
                  >

                    <div className="flex justify-between">

                      <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                        {
                          producto.categoria
                        }
                      </span>

                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {
                          producto.stock
                        }
                      </span>

                    </div>

                    <div className="mt-6">

                      <h3 className="font-black text-xl">
                        {
                          producto.nombre
                        }
                      </h3>

                      <p className="text-4xl font-black text-indigo-600 mt-3">
                        $
                        {
                          producto.precio
                        }
                      </p>

                    </div>

                  </button>

                )
              )}

            </div>

          </div>

          {/* TICKET */}

          <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-2xl">

            <h2 className="text-4xl font-black">
              Ticket
            </h2>

            {/* MANUAL */}

            <div className="bg-slate-800 rounded-3xl p-4 mt-5">

              <input
                placeholder="Producto manual"
                value={productoManual}
                onChange={(e) =>
                  setProductoManual(
                    e.target.value
                  )
                }
                className="w-full bg-white text-black p-4 rounded-2xl mb-3"
              />

              <input
                type="number"
                placeholder="Precio"
                value={precioManual}
                onChange={(e) =>
                  setPrecioManual(
                    e.target.value
                  )
                }
                className="w-full bg-white text-black p-4 rounded-2xl"
              />

              <button
                onClick={
                  agregarProductoManual
                }
                className="w-full bg-indigo-600 p-4 rounded-2xl mt-3 font-black"
              >
                Agregar
              </button>

            </div>

            {/* ITEMS */}

            <div className="space-y-3 mt-5 max-h-[300px] overflow-auto">

              {ticket.map((item) => (

                <div
                  key={item.id}
                  className="bg-slate-800 rounded-2xl p-4 flex justify-between"
                >

                  <div>

                    <h3 className="font-bold">
                      {item.nombre}
                    </h3>

                    <p className="text-slate-400">
                      x{item.cantidad}
                    </p>

                  </div>

                  <p className="text-2xl font-black">
                    $
                    {item.precio *
                      item.cantidad}
                  </p>

                </div>

              ))}

            </div>

            {/* TOTAL */}

            <div className="bg-slate-800 rounded-3xl p-5 mt-5 flex justify-between">

              <span className="text-slate-400">
                TOTAL
              </span>

              <span className="text-5xl font-black text-emerald-400">
                ${totalTicket}
              </span>

            </div>

            {/* EFECTIVO */}

            <div className="bg-slate-800 rounded-3xl p-5 mt-5">

              <input
                type="number"
                placeholder="Dinero recibido"
                value={montoRecibido}
                onChange={(e) =>
                  setMontoRecibido(
                    e.target.value
                  )
                }
                className="w-full bg-white text-black p-4 rounded-2xl text-2xl font-black"
              />

              <div className="flex justify-between mt-5">

                <span className="text-slate-400">
                  Cambio
                </span>

                <span className="text-4xl font-black text-emerald-400">
                  $
                  {cambio > 0
                    ? cambio
                    : 0}
                </span>

              </div>

            </div>

            {/* BOTONES */}

            <div className="grid grid-cols-2 gap-3 mt-5">

              <button
                onClick={() =>
                  finalizarVenta(
                    "Efectivo"
                  )
                }
                className="bg-emerald-500 p-5 rounded-3xl font-black"
              >
                Efectivo
              </button>

              <button
                onClick={() =>
                  finalizarVenta(
                    "Transferencia"
                  )
                }
                className="bg-indigo-500 p-5 rounded-3xl font-black"
              >
                Transferencia
              </button>

              <button
                onClick={() =>
                  finalizarVenta(
                    "QR"
                  )
                }
                className="bg-cyan-500 p-5 rounded-3xl font-black"
              >
                QR
              </button>

              <button
                onClick={() =>
                  window.print()
                }
                className="bg-pink-500 p-5 rounded-3xl font-black"
              >
                Imprimir
              </button>

            </div>

            {/* QR */}

            <div className="bg-white rounded-3xl p-5 mt-5">

              <img
                src={qr}
                alt="QR"
                className="w-full rounded-2xl"
              />

            </div>

            {/* WHATSAPP */}

            <div className="mt-5">

              <input
                placeholder="WhatsApp cliente"
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
                className="w-full bg-green-500 p-5 rounded-3xl mt-3 font-black"
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

          <div className="bg-white rounded-3xl p-6 shadow-2xl">

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
                className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black"
              >
                + Producto
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}