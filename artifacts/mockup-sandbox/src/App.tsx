import { useEffect, useMemo, useState } from "react";

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

  type TicketItem = {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    manual?: boolean;
  };

  type Venta = {
    id: number;
    fecha: string;
    metodo: string;
    total: number;
    productos: TicketItem[];
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
    useState<TicketItem[]>([]);

  const [ventas, setVentas] =
    useState<Venta[]>([]);

  const [telefonoCliente, setTelefonoCliente] =
    useState("");

  const [montoRecibido, setMontoRecibido] =
    useState("");

  const [busqueda, setBusqueda] =
    useState("");

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
        {
          id: 3,
          nombre: "Papas Lays",
          precio: 2800,
          stock: 2,
          categoria: "Snacks",
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
  // FILTROS
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

  const totalProductosVendidos =
    ventas.reduce(
      (acc, venta) =>
        acc +
        venta.productos.reduce(
          (
            a: number,
            p: TicketItem
          ) =>
            a + p.cantidad,
          0
        ),
      0
    );

  const cambio =
    Number(montoRecibido || 0) -
    totalTicket;

  // ======================================================
  // FUNCIONES
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

  function eliminarProducto(id: number) {

    const confirmar =
      confirm("Eliminar producto?");

    if (!confirmar) return;

    setProductos(
      productos.filter(
        (p) => p.id !== id
      )
    );

  }

  function sumarStock(id: number) {

    setProductos(
      productos.map((p) =>
        p.id === id
          ? {
              ...p,
              stock: p.stock + 1,
            }
          : p
      )
    );

  }

  function restarStock(id: number) {

    setProductos(
      productos.map((p) =>
        p.id === id &&
        p.stock > 0
          ? {
              ...p,
              stock: p.stock - 1,
            }
          : p
      )
    );

  }

  function agregarAlTicket(
    producto: Producto
  ) {

    if (producto.stock <= 0) {
      alert("Producto agotado");
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

  function agregarProductoManual() {

    if (
      !productoManual ||
      !precioManual
    ) return;

    const nuevo: TicketItem = {
      id: Date.now(),
      nombre: productoManual,
      precio: Number(precioManual),
      cantidad: 1,
      manual: true,
    };

    setTicket([
      ...ticket,
      nuevo,
    ]);

    setProductoManual("");
    setPrecioManual("");

  }

  function nuevaVenta() {

    setTicket([]);
    setMontoRecibido("");
    setTelefonoCliente("");

  }

  function finalizarVenta(
    metodo: string
  ) {

    if (ticket.length === 0) {
      alert("No hay productos");
      return;
    }

    const venta: Venta = {
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

Gracias ❤️`;

    const url =
      `https://wa.me/54${numero}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");

  }

  const qr =
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TOTAL:${totalTicket}`;

  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="min-h-screen bg-[#050816] text-white flex overflow-hidden">

      {/* SIDEBAR */}

      <div className="w-[260px] bg-white/5 border-r border-white/10 backdrop-blur-2xl p-6 hidden lg:flex flex-col justify-between">

        <div>

          <div className="mb-10">

            <h1 className="text-4xl font-black bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
              NEGOCIO
            </h1>

            <h2 className="text-4xl font-black text-white -mt-2">
              FÁCIL
            </h2>

            <p className="text-gray-400 mt-2">
              Premium POS
            </p>

          </div>

          <div className="space-y-4">

            <button
              onClick={() =>
                setVista("caja")
              }
              className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all ${
                vista === "caja"
                  ? "bg-gradient-to-r from-fuchsia-600 to-cyan-500 shadow-2xl"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              🛒 Caja
            </button>

            <button
              onClick={() =>
                setVista("stock")
              }
              className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all ${
                vista === "stock"
                  ? "bg-gradient-to-r from-fuchsia-600 to-cyan-500 shadow-2xl"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              📦 Stock
            </button>

            <button
              onClick={() =>
                setVista("ventas")
              }
              className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all ${
                vista === "ventas"
                  ? "bg-gradient-to-r from-fuchsia-600 to-cyan-500 shadow-2xl"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              💰 Ventas
            </button>

          </div>

        </div>

        <div className="space-y-4">

          <div className="bg-white/5 rounded-3xl p-5 border border-white/10">

            <p className="text-gray-400 text-sm">
              Caja diaria
            </p>

            <h3 className="text-4xl font-black text-emerald-400 mt-2">
              ${totalCaja}
            </h3>

          </div>

          <div className="bg-white/5 rounded-3xl p-5 border border-white/10">

            <p className="text-gray-400 text-sm">
              Productos vendidos
            </p>

            <h3 className="text-4xl font-black text-cyan-400 mt-2">
              {totalProductosVendidos}
            </h3>

          </div>

        </div>

      </div>

      {/* MAIN */}

      <div className="flex-1 overflow-auto">

        {/* MOBILE NAV */}

        <div className="lg:hidden p-4 flex gap-3">

          <button
            onClick={() =>
              setVista("caja")
            }
            className="bg-fuchsia-600 px-4 py-3 rounded-2xl font-bold"
          >
            Caja
          </button>

          <button
            onClick={() =>
              setVista("stock")
            }
            className="bg-cyan-600 px-4 py-3 rounded-2xl font-bold"
          >
            Stock
          </button>

          <button
            onClick={() =>
              setVista("ventas")
            }
            className="bg-emerald-600 px-4 py-3 rounded-2xl font-bold"
          >
            Ventas
          </button>

        </div>

        {/* CAJA */}

        {vista === "caja" && (

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 p-5">

            {/* PRODUCTOS */}

            <div className="xl:col-span-2">

              <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-5 mb-5">

                <input
                  placeholder="Buscar producto..."
                  value={busqueda}
                  onChange={(e) =>
                    setBusqueda(
                      e.target.value
                    )
                  }
                  className="w-full bg-[#0f172a] border border-white/10 rounded-2xl p-5 text-xl outline-none"
                />

              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">

                {productosFiltrados.map(
                  (producto) => (

                    <button
                      key={producto.id}
                      disabled={
                        producto.stock <= 0
                      }
                      onClick={() =>
                        agregarAlTicket(
                          producto
                        )
                      }
                      className={`rounded-3xl p-5 text-left border transition-all duration-300 ${
                        producto.stock <= 0
                          ? "bg-gray-700/30 opacity-50 border-white/5"
                          : "bg-white/5 border-white/10 hover:scale-105 hover:border-fuchsia-500/40 hover:bg-white/10"
                      }`}
                    >

                      <div className="flex justify-between items-center">

                        <span className="bg-fuchsia-500/20 text-fuchsia-300 text-xs font-bold px-3 py-1 rounded-full">
                          {
                            producto.categoria
                          }
                        </span>

                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          producto.stock <= 3
                            ? "bg-red-500"
                            : "bg-emerald-500"
                        }`}>
                          {
                            producto.stock <= 0
                              ? "AGOTADO"
                              : producto.stock
                          }
                        </span>

                      </div>

                      <div className="mt-6">

                        <h3 className="font-black text-xl">
                          {
                            producto.nombre
                          }
                        </h3>

                        <p className="text-4xl font-black mt-4 bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
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

            <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-5 h-fit sticky top-5">

              <div className="flex justify-between items-center">

                <h2 className="text-4xl font-black">
                  Ticket
                </h2>

                <button
                  onClick={nuevaVenta}
                  className="bg-red-500 px-4 py-2 rounded-2xl font-bold"
                >
                  Nueva
                </button>

              </div>

              {/* ITEMS */}

              <div className="space-y-3 mt-5 max-h-[320px] overflow-auto">

                {ticket.map((item) => (

                  <div
                    key={item.id}
                    className="bg-[#111827] rounded-2xl p-4 flex justify-between"
                  >

                    <div>

                      <h3 className="font-bold">
                        {item.nombre}
                      </h3>

                      <p className="text-gray-400">
                        x{item.cantidad}
                      </p>

                    </div>

                    <p className="text-2xl font-black text-cyan-400">
                      $
                      {item.precio *
                        item.cantidad}
                    </p>

                  </div>

                ))}

              </div>

              {/* TOTAL */}

              <div className="bg-[#111827] rounded-3xl p-5 mt-5">

                <div className="flex justify-between items-center">

                  <span className="text-gray-400">
                    TOTAL
                  </span>

                  <span className="text-5xl font-black text-emerald-400">
                    ${totalTicket}
                  </span>

                </div>

              </div>

              {/* EFECTIVO */}

              <div className="bg-[#111827] rounded-3xl p-5 mt-5">

                <input
                  type="number"
                  placeholder="Dinero recibido"
                  value={montoRecibido}
                  onChange={(e) =>
                    setMontoRecibido(
                      e.target.value
                    )
                  }
                  className="w-full bg-black/30 p-4 rounded-2xl text-2xl font-black outline-none"
                />

                <div className="flex justify-between mt-5">

                  <span className="text-gray-400">
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
                  className="bg-fuchsia-600 p-5 rounded-3xl font-black"
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
                  className="w-full bg-[#111827] p-4 rounded-2xl outline-none"
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

      </div>

    </div>
  );
}