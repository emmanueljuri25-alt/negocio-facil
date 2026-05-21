type Props = {
  onLogin: () => void;
};

export default function Login({
  onLogin,
}: Props) {

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">

        <h1 className="text-4xl font-black text-center">
          NEGOCIO FÁCIL
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Iniciar sesión
        </p>

        <input
          placeholder="Usuario"
          className="w-full border p-4 rounded-2xl mt-6"
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border p-4 rounded-2xl mt-4"
        />

        <button
          onClick={onLogin}
          className="w-full bg-indigo-600 text-white p-4 rounded-2xl mt-6 font-black"
        >
          INGRESAR
        </button>

      </div>

    </div>

  );

}
