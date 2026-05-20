import { useState, useEffect } from "react";

type Props = {
  onLogin: () => void;
};

export default function Login({
  onLogin,
}: Props) {

  const [usuario, setUsuario] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {

    const logueado =
      localStorage.getItem(
        "negociofacil-login"
      );

    if (logueado === "true") {
      onLogin();
    }

  }, []);

  function ingresar() {

    if (
      usuario === "admin" &&
      password === "1234"
    ) {

      localStorage.setItem(
        "negociofacil-login",
        "true"
      );

      onLogin();

    } else {

      setError(
        "Usuario o contraseña incorrectos"
      );

    }

  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[35px] p-8 shadow-2xl">

        {/* LOGO */}

        <div className="text-center">

          <div className="w-24 h-24 rounded-[30px] bg-indigo-600 mx-auto flex items-center justify-center shadow-2xl">

            <span className="text-5xl">
              🛒
            </span>

          </div>

          <h1 className="text-5xl font-black text-white mt-6">
            NEGOCIO FÁCIL
          </h1>

          <p className="text-slate-300 mt-3 text-lg">
            Premium POS System
          </p>

        </div>

        {/* FORM */}

        <div className="mt-10 space-y-5">

          <div>

            <label className="text-slate-300 text-sm">
              Usuario
            </label>

            <input
              value={usuario}
              onChange={(e) =>
                setUsuario(
                  e.target.value
                )
              }
              placeholder="Ingresar usuario"
              className="w-full mt-2 bg-white/10 border border-white/10 text-white p-5 rounded-2xl outline-none text-lg"
            />

          </div>

          <div>

            <label className="text-slate-300 text-sm">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Ingresar contraseña"
              className="w-full mt-2 bg-white/10 border border-white/10 text-white p-5 rounded-2xl outline-none text-lg"
            />

          </div>

          {error && (

            <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-2xl text-sm">

              {error}

            </div>

          )}

          <button
            onClick={ingresar}
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition-all p-5 rounded-2xl text-white font-black text-xl shadow-2xl"
          >
            INGRESAR
          </button>

        </div>

        {/* FOOTER */}

        <div className="mt-10 text-center">

          <p className="text-slate-400 text-sm">
            Sistema comercial moderno
          </p>

        </div>

      </div>

    </div>

  );
}