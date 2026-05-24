export default function App() {
return ( <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 p-6">


  <div className="max-w-7xl mx-auto">

    <div className="bg-white rounded-[30px] shadow-2xl p-8">

      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-5xl font-black text-slate-800">
            NEGOCIO FÁCIL
          </h1>

          <p className="text-slate-500 text-xl mt-2">
            Premium POS
          </p>
        </div>

        <div className="flex gap-4">

          <div className="bg-emerald-100 px-6 py-4 rounded-3xl">
            <p className="text-sm text-emerald-700">
              Caja diaria
            </p>

            <h2 className="text-3xl font-black text-emerald-600">
              $128.500
            </h2>
          </div>

          <div className="bg-indigo-100 px-6 py-4 rounded-3xl">
            <p className="text-sm text-indigo-700">
              Ventas
            </p>

            <h2 className="text-3xl font-black text-indigo-600">
              24
            </h2>
          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">

          <input
            placeholder="Buscar productos..."
            className="w-full bg-slate-100 rounded-3xl p-6 text-2xl outline-none mb-6"
          />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">

            {[1,2,3,4,5,6].map((item) => (

              <div
                key={item}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-lg hover:scale-105 transition-all cursor-pointer"
              >

                <div className="flex justify-between mb-6">

                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                    Bebidas
                  </span>

                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    15
                  </span>

                </div>

                <h3 className="text-2xl font-black text-slate-800">
                  Coca Cola
                </h3>

                <p className="text-5xl font-black text-indigo-600 mt-4">
                  $3500
                </p>

              </div>

            ))}

          </div>

        </div>

        <div className="bg-slate-900 rounded-[30px] p-6 text-white shadow-2xl">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-4xl font-black">
              Ticket
            </h2>

            <button className="bg-red-500 px-4 py-2 rounded-2xl font-bold">
              Nueva
            </button>

          </div>

          <div className="space-y-4">

            {[1,2,3].map((item) => (

              <div
                key={item}
                className="bg-slate-800 rounded-3xl p-4 flex justify-between"
              >

                <div>
                  <h3 className="font-bold text-xl">
                    Coca Cola
                  </h3>

                  <p className="text-slate-400">
                    x2
                  </p>
                </div>

                <p className="text-3xl font-black">
                  $7000
                </p>

              </div>

            ))}

          </div>

          <div className="bg-slate-800 rounded-3xl p-6 mt-6">

            <div className="flex justify-between items-center">

              <span className="text-slate-400 text-xl">
                TOTAL
              </span>

              <span className="text-5xl font-black text-emerald-400">
                $14.000
              </span>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">

            <button className="bg-emerald-500 p-5 rounded-3xl text-xl font-black">
              Efectivo
            </button>

            <button className="bg-indigo-500 p-5 rounded-3xl text-xl font-black">
              Transferencia
            </button>

            <button className="bg-cyan-500 p-5 rounded-3xl text-xl font-black">
              QR
            </button>

            <button className="bg-pink-500 p-5 rounded-3xl text-xl font-black">
              Imprimir
            </button>

          </div>

        </div>

      </div>

    </div>

  </div>

</div>

)
}