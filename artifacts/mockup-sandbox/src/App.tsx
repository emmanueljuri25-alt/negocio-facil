import { useState } from "react";
import Login from "./components/Login";

import { useEffect, useMemo, useState } from "react";

export default function App() {

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
    "dashboard" | 
    "caja" |
    "stock" |
    "ventas"
  >("dashboard");

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
  // FILTRO PRODUCTOS
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
          (a: number, p: any) =>
            a + p.cantidad,
          0
        ),
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
  // ELIMINAR PRODUCTO
  // ======================================================

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

  // ======================================================
  // STOCK RAPIDO
  // ======================================================

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

  // ======================================================
  // AGREGAR AL TICKET
  // ======================================================

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

  // ======================================================
  // PRODUCTO MANUAL
  // ======================================================

  function agregarProductoManual() {

    if (
      !productoManual ||
      !precioManual
    ) return;

    const nuevo = {
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

    nuevaVenta();

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

      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">

        <div className="p-4 flex flex-wrap gap-4 items-center justify-between">

          <div>

            <h1 className="text-4xl font-black text-slate-800">
              NEGOCIO FÁCIL
            </h1>

            <p className="text-gray-500">
              Premium POS
            </p>

          </div>

          {/* DASHBOARD */}

          <div className="flex flex-wrap gap-3">

            <div className="bg-white rounded-2xl p-4 shadow-lg min-w-[140px]">

              <p className="text-sm text-gray-500">
                Caja diaria
              </p>

              <h3 className="text-2xl font-black text-emerald-500">
                ${totalCaja}
              </h3>

            </div>

            <div className="bg-white rounded-2xl p-4 shadow-lg min-w-[140px]">

              <p className="text-sm text-gray-500">
                Ventas
              </p>

              <h3 className="text-2xl font-black text-indigo-500">
                {ventas.length}
              </h3>

            </div>

            <div className="bg-white rounded-2xl p-4 shadow-lg min-w-[140px]">

              <p className="text-sm text-gray-500">
                Productos vendidos
              </p>

              <h3 className="text-2xl font-black text-pink-500">
                {totalProductosVendidos}
              </h3>

            </div>

          </div>

        </div>

      </div>

      {/* NAV */}

      <div className="p-4 flex flex-wrap gap-3">

        <button
          onClick={() =>
            setVista("dashboard")
          }
          className={`px-5 py-3 rounded-2xl font-bold ${
            vista === "dashboard"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100"
          }`}
        >
          Dashboard
        </button>
      

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

      {/* ======================================================
      CAJA
      ====================================================== */}

      {vista === "dashboard" && (

        <Dashboard
          ventas={ventas}
          productos={productos}
        />

      )}

      
      {vista === "caja" && (

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 p-4">

          {/* PRODUCTOS */}

          <div className="xl:col-span-2">

            {/* BUSCADOR */}

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

            {/* PRODUCTOS */}

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
                    className={`rounded-3xl p-4 text-left shadow-xl transition-all ${
                      producto.stock <= 0
                        ? "bg-gray-300 opacity-60"
                        : "bg-white hover:scale-105"
                    }`}
                  >

                    <div className="flex justify-between">

                      <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                        {
                          producto.categoria
                        }
                      </span>

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full text-white ${
                          producto.stock <= 3
                            ? "bg-red-500"
                            : "bg-green-500"
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

          <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-2xl sticky top-28 h-fit">

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

            {/* MANUAL */}

            <div className="bg-slate-800 rounded-3xl p-4 mt-5">

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

            <div className="bg-slate-800 rounded-3xl p-5 mt-5">

              <div className="flex justify-between">

                <span className="text-slate-400">
                  TOTAL
                </span>

                <span className="text-5xl font-black text-emerald-400">
                  ${totalTicket}
                </span>

              </div>

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
                className="bg-emerald-500 p-5 rounded-3xl font-black text-xl"
              >
                Efectivo
              </button>

              <button
                onClick={() =>
                  finalizarVenta(
                    "Transferencia"
                  )
                }
                className="bg-indigo-500 p-5 rounded-3xl font-black text-xl"
              >
                Transferencia
              </button>

              <button
                onClick={() =>
                  finalizarVenta(
                    "QR"
                  )
                }
                className="bg-cyan-500 p-5 rounded-3xl font-black text-xl"
              >
                QR
              </button>

              <button
                onClick={() =>
                  window.print()
                }
                className="bg-pink-500 p-5 rounded-3xl font-black text-xl"
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
                className="w-full bg-green-500 p-5 rounded-3xl mt-3 font-black text-xl"
              >
                Enviar WhatsApp
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ======================================================
      STOCK
      ====================================================== */}

      {vista === "stock" && (

        <div className="p-4">

          <div className="bg-white rounded-3xl p-6 shadow-2xl">

            <div className="flex justify-between items-center flex-wrap gap-4">

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

            <div className="space-y-4 mt-6">

              {productos.map(
                (producto) => (

                  <div
                    key={producto.id}
                    className="bg-slate-100 rounded-3xl p-5"
                  >

                    <div className="flex justify-between items-center flex-wrap gap-4">

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

                      <div className="flex gap-2 items-center">

                        <button
                          onClick={() =>
                            restarStock(
                              producto.id
                            )
                          }
                          className="bg-red-500 text-white w-10 h-10 rounded-xl font-black"
                        >
                          -
                        </button>

                        <div className="bg-white px-5 py-3 rounded-2xl font-black text-xl">
                          {
                            producto.stock
                          }
                        </div>

                        <button
                          onClick={() =>
                            sumarStock(
                              producto.id
                            )
                          }
                          className="bg-green-500 text-white w-10 h-10 rounded-xl font-black"
                        >
                          +
                        </button>

                      </div>

                      <div>

                        <p className="text-3xl font-black text-indigo-600">
                          $
                          {
                            producto.precio
                          }
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          eliminarProducto(
                            producto.id
                          )
                        }
                        className="bg-red-500 text-white px-5 py-3 rounded-2xl font-bold"
                      >
                        Eliminar
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      )}

      {/* ======================================================
      VENTAS
      ====================================================== */}

      {vista === "ventas" && (

        <div className="p-4 space-y-4">

          {ventas.map((venta) => (

            <div
              key={venta.id}
              className="bg-white rounded-3xl p-5 shadow-xl"
            >

              <div className="flex justify-between flex-wrap gap-4">

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

            </div>

          ))}

        </div>

      )}

      {/* ======================================================
      MODAL PRODUCTO
      ====================================================== */}

      {mostrarNuevo && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-3xl p-6 w-full max-w-md">

            <h2 className="text-3xl font-black mb-5">
              Nuevo producto
            </h2>

            <div className="space-y-4">

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

            <div className="grid grid-cols-2 gap-3 mt-6">

              <button
                onClick={() =>
                  setMostrarNuevo(
                    false
                  )
                }
                className="bg-gray-200 p-4 rounded-2xl font-bold"
              >
                Cancelar
              </button>

              <button
                onClick={
                  agregarProducto
                }
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