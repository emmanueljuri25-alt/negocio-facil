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

  type TicketItem = {
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

    const nuevo: Producto = {
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
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
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

    </div>
  );
}