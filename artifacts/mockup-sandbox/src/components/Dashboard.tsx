type Props = {
  ventas: any[];
  productos: any[];
};

export default function Dashboard({
  ventas,
  productos,
}: Props) {

  const totalCaja = ventas.reduce(
    (acc, v) => acc + v.total,
    0
  );

  const productosBajos =
    productos.filter(
      (p) => p.stock <= 3
    );

  return (

    <div className="p-4 space-y-5">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <p className="text-gray-500">
            Caja del día
          </p>

          <h2 className="text-5xl font-black text-emerald-500 mt-2">
            ${totalCaja}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <p className="text-gray-500">
            Ventas realizadas
          </p>

          <h2 className="text-5xl font-black text-indigo-500 mt-2">
            {ventas.length}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <p className="text-gray-500">
            Productos
          </p>

          <h2 className="text-5xl font-black text-pink-500 mt-2">
            {productos.length}
          </h2>
        </div>

      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl">

        <h2 className="text-3xl font-black mb-5">
          Stock bajo
        </h2>

        <div className="space-y-3">

          {productosBajos.length === 0 && (
            <p>
              No hay productos bajos
            </p>
          )}

          {productosBajos.map((p) => (

            <div
              key={p.id}
              className="bg-red-50 border border-red-200 rounded-2xl p-4 flex justify-between"
            >

              <div>
                <h3 className="font-black">
                  {p.nombre}
                </h3>

                <p className="text-gray-500">
                  {p.categoria}
                </p>
              </div>

              <div className="text-red-500 font-black text-2xl">
                {p.stock}
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}
