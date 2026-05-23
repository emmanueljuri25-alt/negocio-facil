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
      confirm(
        "Eliminar producto?"
      );

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

  // ======================================================
  // QR
  // ======================================================

  const qr =
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TOTAL:${totalTicket}`;

  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="min-h-screen bg-[#0b1120] text-white overflow-hidden relative">

      {/* EFECTOS FONDO */}

      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-fuchsia-600/30 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/30 blur-[120px] rounded-full" />

      {/* HEADER */}

      <div className="sticky top-0 z-50 backdrop-blur-2xl bg-white/10 border-b border-white/10 shadow-2xl">

        <div className="p-4 flex flex-wrap gap-4 items-center justify-between">

          <div>

            <h1 className="text-5xl font-black bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
              NEGOCIO FÁCIL
            </h1>

            <p className="text-gray-300">
              Premium POS
            </p>

          </div>

          {/* DASHBOARD */}

          <div className="flex flex-wrap gap-3">

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl min-w-[160px]">

              <p className="text-sm text-gray-300">
                Caja diaria
              </p>

              <h3 className="text-3xl font-black text-emerald-400">
                ${totalCaja}
              </h3>

            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl min-w-[160px]">

              <p className="text-sm text-gray-300">
                Ventas
              </p>

              <h3 className="text-3xl font-black text-cyan-400">
                {ventas.length}
              </h3>

            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl min-w-[160px]">

              <p className="text-sm text-gray-300">
                Productos vendidos
              </p>

              <h3 className="text-3xl font-black text-fuchsia-400">
                {totalProductosVendidos}
              </h3>

            </div>

          </div>

        </div>

      </div>

      {/* NAV */}

      <div className="p-4 flex flex-wrap gap-3 relative z-10">

        <button
          onClick={() =>
            setVista("caja")
          }
          className={`px-6 py-4 rounded-2xl font-black transition-all duration-300 ${
            vista === "caja"
              ? "bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white shadow-2xl"
              : "bg-white/10 border border-white/10"
          }`}
        >
          Caja
        </button>

        <button
          onClick={() =>
            setVista("stock")
          }
          className={`px-6 py-4 rounded-2xl font-black transition-all duration-300 ${
            vista === "stock"
              ? "bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white shadow-2xl"
              : "bg-white/10 border border-white/10"
          }`}
        >
          Stock
        </button>

        <button
          onClick={() =>
            setVista("ventas")
          }
          className={`px-6 py-4 rounded-2xl font-black transition-all duration-300 ${
            vista === "ventas"
              ? "bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white shadow-2xl"
              : "bg-white/10 border border-white/10"
          }`}
        >
          Ventas
        </button>

      </div>

      {/* CAJA */}

      {vista === "caja" && (

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 p-4 relative z-10">

          {/* PRODUCTOS */}

          <div className="xl:col-span-2">

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl mb-5">

              <input
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(
                    e.target.value
                  )
                }
                className="w-full bg-white/10 border border-white/10 text-white placeholder:text-gray-400 rounded-2xl p-5 text-xl outline-none focus:border-fuchsia-500"
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
                    className={`rounded-3xl p-5 text-left transition-all duration-300 border ${
                      producto.stock <= 0
                        ? "bg-gray-500/20 opacity-50 border-white/5"
                        : "bg-white/10 backdrop-blur-xl border-white/10 hover:scale-[1.03] hover:border-fuchsia-500/40 hover:shadow-fuchsia-500/20 hover:shadow-2xl"
                    }`}
                  >

                    <div className="flex justify-between">

                      <span className="bg-fuchsia-500/20 text-fuchsia-300 text-xs font-bold px-3 py-1 rounded-full">
                        {
                          producto.categoria
                        }
                      </span>

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full text-white ${
                          producto.stock <= 3
                            ? "bg-red-500"
                            : "bg-emerald-500"
                        }`}
                      >
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

                      <p className="text-4xl font-black bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent mt-3">
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

          <div className="bg-black/40 backdrop-blur-2xl border border-white/10 text-white rounded-3xl p-5 shadow-[0_0_60px_rgba(168,85,247,0.25)] sticky top-28 h-fit">

            <div className="flex justify-between items-center">

              <h2 className="text-4xl font-black">
                Ticket
              </h2>

              <button
                onClick={nuevaVenta}
                className="bg-red-500 hover:bg-red-400 transition-all px-4 py-2 rounded-2xl font-bold"
              >
                Nueva
              </button>

            </div>

            {/* MANUAL */}

            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 mt-5">

              <h3 className="font-bold mb-3">
                Producto manual
              </h3>

              <input
                placeholder="Producto"
                value={productoManual}
                onChange={(e) =>
                  setProductoManual(
                    e.target.value
                  )
                }
                className="w-full bg-white/10 border border-white/10 text-white placeholder:text-gray-400 p-4 rounded-2xl mb-3 outline-none"
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
                className="w-full bg-white/10 border border-white/10 text-white placeholder:text-gray-400 p-4 rounded-2xl outline-none"
              />

              <button
                onClick={
                  agregarProductoManual
                }
                className="w-full bg-gradient-to-r from-fuchsia-600 to-cyan-500 p-4 rounded-2xl mt-3 font-black hover:scale-[1.02] transition-all"
              >
                Agregar
              </button>

            </div>

            {/* ITEMS */}

            <div className="space-y-3 mt-5 max-h-[300px] overflow-auto">

              {ticket.map((item) => (

                <div
                  key={item.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between"
                >

                  <div>

                    <h3 className="font-bold">
                      {item.nombre}
                    </h3>

                    <p className="text-gray-400">
                      x{item.cantidad}
                    </p>

                  </div>

                  <p className="text-2xl font-black text-cyan-300">
                    $
                    {item.precio *
                      item.cantidad}
                  </p>

                </div>

              ))}

            </div>

            {/* TOTAL */}

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mt-5">

              <div className="flex justify-between items-center">

                <span className="text-gray-400">
                  TOTAL
                </span>

                <span className="text-6xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  ${totalTicket}
                </span>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}