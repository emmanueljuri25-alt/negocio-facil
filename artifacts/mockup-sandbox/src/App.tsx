import { useEffect, useState } from "react";

export default function App() {

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
    "ventas" |
    "consignacion"
  >("caja");

  const [productos, setProductos] =
    useState<Producto[]>([]);

  const [ticket, setTicket] =
    useState<any[]>([]);

  const [ventas, setVentas] =
    useState<any[]>([]);

  const [fiados, setFiados] =
    useState<any[]>([]);

  const [consignaciones, setConsignaciones] =
    useState<any[]>([]);

  const [telefonoCliente, setTelefonoCliente] =
    useState("");

  const [montoRecibido, setMontoRecibido] =
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
  // STORAGE
  // ======================================================

  useEffect(() => {

    const p =
      localStorage.getItem("productos");

    const v =
      localStorage.getItem("ventas");

    const f =
      localStorage.getItem("fiados");

    const c =
      localStorage.getItem("consignaciones");

    if (p) setProductos(JSON.parse(p));
    if (v) setVentas(JSON.parse(v));
    if (f) setFiados(JSON.parse(f));
    if (c) setConsignaciones(JSON.parse(c));

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
          stock: 6,
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

  useEffect(() => {

    localStorage.setItem(
      "fiados",
      JSON.stringify(fiados)
    );

  }, [fiados]);

  useEffect(() => {

    localStorage.setItem(
      "consignaciones",
      JSON.stringify(consignaciones)
    );

  }, [consignaciones]);

  // ======================================================
  // TOTAL
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

  // ======================================================
  // AGREGAR AL TICKET
  // ======================================================

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

  // ======================================================
  // FINALIZAR VENTA
  // ======================================================

  function finalizarVenta(
    metodo: string
  ) {

    if (ticket.length === 0) {
      alert("No hay productos");
      return;
    }

    // ======================================================
    // FIADO
    // ======================================================

    if (metodo === "Fiado") {

      const nombre =
        prompt("Nombre cliente");

      const whatsapp =
        prompt("WhatsApp");

      const vencimiento =
        prompt(
          "Fecha vencimiento YYYY-MM-DD"
        );

      const nuevoFiado = {
        id: Date.now(),
        nombre,
        whatsapp,
        vencimiento,
        total: totalTicket,
        fecha:
          new Date().toLocaleString(),
        productos: ticket,
      };

      setFiados([
        nuevoFiado,
        ...fiados,
      ]);

    } else {

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

    }

    // DESCONTAR STOCK

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

    alert("Venta guardada");
  }

  // ======================================================
  // WHATSAPP
  // ======================================================

  function enviarWhatsApp() {

    if (!telefonoCliente) {
      alert("Ingresar teléfono");
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

Gracias por su compra ❤️`;

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

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 p-4">

      {/* HEADER */}

      <div className="bg-white rounded-3xl p-5 shadow-2xl mb-4 flex flex-wrap gap-3 items-center justify-between">

        <div>

          <h1 className="text-5xl font-black text-slate-800">
            NEGOCIO FÁCIL
          </h1>

          <p className="text-gray-500 mt-1">
            Sistema POS Profesional
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={() =>
              setVista("caja")
            }
            className={`px-5 py-3 rounded-2xl font-bold ${
              vista === "caja"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100"
            }`}
          >
            Caja
          </button>

          <button
            onClick={() =>
              setVista("stock")
            }
            className={`px-5 py-3 rounded-2xl font-bold ${
              vista === "stock"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100"
            }`}
          >
            Stock
          </button>

          <button
            onClick={() =>
              setVista("ventas")
            }
            className={`px-5 py-3 rounded-2xl font-bold ${
              vista === "ventas"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100"
            }`}
          >
            Ventas
          </button>

          <button
            onClick={() =>
              setVista(
                "consignacion"
              )
            }
            className={`px-5 py-3 rounded-2xl font-bold ${
              vista ===
              "consignacion"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100"
            }`}
          >
            Consignación
          </button>

        </div>

      </div>

      {/* ======================================================
      CAJA
      ====================================================== */}

      {vista === "caja" && (

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* PRODUCTOS */}

          <div className="xl:col-span-2 bg-white rounded-3xl p-5 shadow-2xl">

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">

              {productos.map(
                (producto) => (

                  <button
                    key={producto.id}
                    onClick={() =>
                      agregarAlTicket(
                        producto
                      )
                    }
                    className="bg-white border rounded-3xl p-4 text-left shadow-lg hover:scale-105 transition-all"
                  >

                    <div className="flex justify-between">

                      <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                        {
                          producto.categoria
                        }
                      </span>

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full text-white ${
                          producto.stock <=
                          3
                            ? "bg-red-500"
                            : producto.stock <=
                              6
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      >
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

            <div className="space-y-3 mt-6 max-h-[350px] overflow-auto">

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
                      x
                      {
                        item.cantidad
                      }
                    </p>

                  </div>

                  <div>

                    <p className="text-2xl font-black">
                      $
                      {item.precio *
                        item.cantidad}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            {/* TOTAL */}

            <div className="bg-slate-800 rounded-3xl p-5 mt-6 flex justify-between items-center">

              <span className="text-xl text-slate-400">
                TOTAL
              </span>

              <span className="text-5xl font-black text-emerald-400">
                ${totalTicket}
              </span>

            </div>

            {/* EFECTIVO */}

            <div className="bg-slate-800 rounded-3xl p-5 mt-6">

              <input
                type="number"
                placeholder="Dinero recibido"
                value={
                  montoRecibido
                }
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

            <div className="grid grid-cols-2 gap-3 mt-6">

              <button
                onClick={() =>
                  finalizarVenta(
                    "Efectivo"
                  )
                }
                className="bg-emerald-500 p-5 rounded-3xl text-xl font-black"
              >
                Efectivo
              </button>

              <button
                onClick={() =>
                  finalizarVenta(
                    "Transferencia"
                  )
                }
                className="bg-indigo-500 p-5 rounded-3xl text-xl font-black"
              >
                Transferencia
              </button>

              <button
                onClick={() =>
                  finalizarVenta(
                    "QR"
                  )
                }
                className="bg-cyan-500 p-5 rounded-3xl text-xl font-black"
              >
                QR
              </button>

              <button
                onClick={() =>
                  finalizarVenta(
                    "Fiado"
                  )
                }
                className="bg-yellow-400 text-black p-5 rounded-3xl text-xl font-black"
              >
                Fiado
              </button>

            </div>

            {/* QR */}

            <div className="bg-white rounded-3xl p-5 mt-6">

              <img
                src={qr}
                alt="QR"
                className="w-full rounded-2xl"
              />

            </div>

            {/* WHATSAPP */}

            <div className="mt-6">

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
                className="w-full bg-green-500 p-5 rounded-3xl mt-3 text-xl font-black"
              >
                Enviar Ticket WhatsApp
              </button>

            </div>

            {/* CAJA */}

            <div className="bg-slate-800 rounded-3xl p-5 mt-6">

              <p className="text-slate-400">
                Caja diaria
              </p>

              <p className="text-5xl font-black text-emerald-400 mt-3">
                ${totalCaja}
              </p>

            </div>

          </div>

        </div>

      )}

      {/* ======================================================
      STOCK
      ====================================================== */}

      {vista === "stock" && (

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
              className="bg-indigo-600 text-white px-6 py-4 rounded-2xl text-xl font-black"
            >
              + Producto
            </button>

          </div>

          <div className="space-y-3 mt-6">

            {productos.map(
              (producto) => (

                <div
                  key={producto.id}
                  className="bg-slate-100 rounded-3xl p-5 flex justify-between"
                >

                  <div>

                    <h3 className="text-2xl font-black">
                      {
                        producto.nombre
                      }
                    </h3>

                    <p className="text-gray-500">
                      {
                        producto.categoria
                      }
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-3xl font-black text-indigo-600">
                      $
                      {
                        producto.precio
                      }
                    </p>

                    <p className="font-bold">
                      Stock:
                      {
                        producto.stock
                      }
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      )}

      {/* ======================================================
      VENTAS
      ====================================================== */}

      {vista === "ventas" && (

        <div className="space-y-4">

          {ventas.map((venta) => (

            <div
              key={venta.id}
              className="bg-white rounded-3xl p-5 shadow-2xl"
            >

              <div className="flex justify-between">

                <div>

                  <h3 className="text-2xl font-black">
                    {venta.metodo}
                  </h3>

                  <p className="text-gray-500">
                    {venta.fecha}
                  </p>

                </div>

                <div>

                  <p className="text-4xl font-black text-indigo-600">
                    $
                    {venta.total}
                  </p>

                </div>

              </div>

              <div className="mt-5 border-t pt-4 space-y-2">

                {venta.productos.map(
                  (
                    prod: any,
                    i: number
                  ) => (

                    <div
                      key={i}
                      className="flex justify-between"
                    >

                      <span>
                        {
                          prod.nombre
                        }{" "}
                        x
                        {
                          prod.cantidad
                        }
                      </span>

                      <span>
                        $
                        {prod.precio *
                          prod.cantidad}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}