type Props = {
  ventas: any[];
  productos: any[];
};

export default function Dashboard({
  ventas,
  productos,
}: Props) {

  // =========================================
  // TOTALES
  // =========================================

  const totalVentas = ventas.reduce(
    (acc, v) => acc + v.total,
    0
  );

  const cantidadVentas =
    ventas.length;

  const stockCritico =
    productos.filter(
      (p) => p.stock <= 3
    );

  const productosVendidos =
    ventas.flatMap(
      (v) => v.productos
    );

  const ranking: Record<
    string,
    number
  > = {};

  productosVendidos.forEach(
    (p: any) => {

      if (!ranking[p.nombre]) {
        ranking[p.nombre] = 0;
      }

      ranking[p.nombre] +=
        p.cantidad;

    }
  );

  const topProductos =
    Object.entries(ranking)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

  // =========================================
  // UI
  // =========================================

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-[35px] p-8 text-white shadow-2xl">

        <h1 className="text-5xl font-black">
          Dashboard
        </h1>

        <p className="mt-3 text-indigo-100 text-lg">
          Resumen general del negocio
        </p>

      </div>

      {/* TARJETAS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* TOTAL */}

        <div className="bg-white rounded-[30px] p-6 shadow-2xl border border-slate-100">

          <p className="text-slate-400 font-semibold">
            Caja diaria
          </p>

          <h2 className="text-5xl font-black text-emerald-500 mt-3">
            ${totalVentas}
          </h2>

        </div>

        {/* VENTAS */}

        <div className="bg-white rounded-[30px] p-6 shadow-2xl border border-slate-100">

          <p className="text-slate-400 font-semibold">
            Ventas realizadas
          </p>

          <h2 className="text-5xl font-black text-indigo-600 mt-3">
            {cantidadVentas}
          </h2>

        </div>

        {/* PRODUCTOS */}

        <div className="bg-white rounded-[30px] p-6 shadow-2xl border border-slate-100">

          <p className="text-slate-400 font-semibold">
            Productos cargados
          </p>

          <h2 className="text-5xl font-black text-cyan-500 mt-3">
            {productos.length}
          </h2>

        </div>

        {/* ALERTAS */}

        <div className="bg-white rounded-[30px] p-6 shadow-2xl border border-slate-100">

          <p className="text-slate-400 font-semibold">
            Stock crítico
          </p>

          <h2 className="text-5xl font-black text-red-500 mt-3">
            {stockCritico.length}
          </h2>

        </div>

      </div>

      {/* PRODUCTOS MÁS VENDIDOS */}

      <div className="bg-white rounded-[35px] p-6 shadow-2xl">

        <div className="flex items-center justify-between">

          <h2 className="text-3xl font-black text-slate-800">
            Productos más vendidos
          </h2>

          <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold">
            TOP 5
          </span>

        </div>

        <div className="space-y-4 mt-6">

          {topProductos.length === 0 && (

            <div className="bg-slate-100 rounded-2xl p-6 text-center text-slate-500">

              Aún no hay ventas registradas

            </div>

          )}

          {topProductos.map(
            ([nombre, cantidad], i) => (

              <div
                key={nombre}
                className="bg-slate-50 rounded-3xl p-5 flex items-center justify-between"
              >

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-black">

                    {i + 1}

                  </div>

                  <div>

                    <h3 className="text-xl font-black text-slate-800">
                      {nombre}
                    </h3>

                    <p className="text-slate-500">
                      Producto vendido
                    </p>

                  </div>

                </div>

                <div>

                  <p className="text-3xl font-black text-indigo-600">
                    {cantidad}
                  </p>

                </div>

              </div>

            )
          )}

        </div>

      </div>

      {/* STOCK CRÍTICO */}

      <div className="bg-white rounded-[35px] p-6 shadow-2xl">

        <div className="flex items-center justify-between">

          <h2 className="text-3xl font-black text-slate-800">
            Alertas de stock
          </h2>

          <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold">
            Atención
          </span>

        </div>

        <div className="space-y-4 mt-6">

          {stockCritico.length === 0 && (

            <div className="bg-emerald-100 text-emerald-700 rounded-2xl p-6 text-center font-bold">

              No hay productos críticos

            </div>

          )}

          {stockCritico.map(
            (p) => (

              <div
                key={p.id}
                className="bg-red-50 border border-red-100 rounded-3xl p-5 flex justify-between items-center"
              >

                <div>

                  <h3 className="text-xl font-black text-red-700">
                    {p.nombre}
                  </h3>

                  <p className="text-red-400">
                    Stock bajo
                  </p>

                </div>

                <div className="bg-red-500 text-white px-5 py-3 rounded-2xl text-2xl font-black">

                  {p.stock}

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>

  );
}