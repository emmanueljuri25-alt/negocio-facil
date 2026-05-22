import {
  useEffect,
  useMemo,
  useState,
} from "react";

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

  type ItemTicket = {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
  };

  type Venta = {
    id: number;
    fecha: string;
    metodo: string;
    total: number;
    productos: ItemTicket[];
  };

  // ======================================================
  // STATES
  // ======================================================

  const [vista, setVista] =
    useState<
      "caja" |
      "stock" |
      "ventas"
    >("caja");

  const [productos, setProductos] =
    useState<Producto[]>([]);

  const [ticket, setTicket] =
    useState<ItemTicket[]>([]);

  const [ventas, setVentas] =
    useState<Venta[]>([]);

  const [busqueda, setBusqueda] =
    useState("");

  const [telefonoCliente, setTelefonoCliente] =
    useState("");

  const [montoRecibido, setMontoRecibido] =
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
    } else {

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

    if (v) {
      setVentas(JSON.parse(v));
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

  const totalTicket =
    ticket.reduce(
      (acc, item) =>
        acc +
        item.precio *
          item.cantidad,
      0
    );

  const totalCaja =
    ventas.reduce(
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

    setMostrarNuevo(false);

    setNuevoNombre("");
    setNuevoPrecio("");
    setNuevoStock("");
    setNuevoCategoria("");
  }

  // ======================================================
  // TICKET
  // ======================================================

  function agregarAlTicket(
    producto: Producto
  ) {

    if (producto.stock <= 0) {
      alert("Sin stock");
      return;
    }

    const existe = ticket.find(
      (t: ItemTicket) =>
        t.id === producto.id
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
  // FINALIZAR
  // ======================================================

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
            (t: ItemTicket) =>
              t.id === p.id
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

    alert("Venta realizada");
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
      ticket.map(
        (p) =>
          `${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}`
      ).join("\n");

    const mensaje =
`🧾 NEGOCIO FÁCIL

${detalle}

TOTAL: $${totalTicket}`;

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

    <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top_left,_#1e1b4b,_transparent_25%),radial-gradient(circle_at_bottom_right,_#0f172a,_transparent_35%),#020617]">

      {/* HEADER */}

      <div className="sticky top-0 z-50 backdrop-blur-2xl bg-black/30 border-b border-cyan-500/20 shadow-[0_0_40px_rgba(0,255,255,0.15)] p-4">

        <div className="flex flex-wrap gap-4 justify-between items-center">

          <div>

            <h1 className="text-5xl font-black tracking-widest bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,255,0.8)]">
              NEGOCIO FÁCIL
            </h1>

            <p className="text-cyan-300 mt-1 tracking-[4px] uppercase text-sm">
              Cyberpunk POS System
            </p>

          </div>

          <div className="flex gap-3 flex-wrap">

            <button
              onClick={() =>
                setVista("caja")
              }
              className={`px-6 py-3 rounded-2xl font-black transition-all duration-300 ${
                vista === "caja"
                  ? "bg-gradient-to-r from-cyan-500 to-fuchsia-500 shadow-[0_0_25px_rgba(0,255,255,0.7)] scale-105"
                  : "bg-white/5 border border-cyan-500/20 hover:bg-cyan-500/10"
              }`}
            >
              Caja
            </button>

            <button
              onClick={() =>
                setVista("stock")
              }
              className={`px-6 py-3 rounded-2xl font-black transition-all duration-300 ${
                vista === "stock"
                  ? "bg-gradient-to-r from-cyan-500 to-fuchsia-500 shadow-[0_0_25px_rgba(0,255,255,0.7)] scale-105"
                  : "bg-white/5 border border-cyan-500/20 hover:bg-cyan-500/10"
              }`}
            >
              Stock
            </button>

            <button
              onClick={() =>
                setVista("ventas")
              }
              className={`px-6 py-3 rounded-2xl font-black transition-all duration-300 ${
                vista === "ventas"
                  ? "bg-gradient-to-r from-cyan-500 to-fuchsia-500 shadow-[0_0_25px_rgba(0,255,255,0.7)] scale-105"
                  : "bg-white/5 border border-cyan-500/20 hover:bg-cyan-500/10"
              }`}
            >
              Ventas
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}