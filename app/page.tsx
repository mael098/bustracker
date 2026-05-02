import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center  font-(--font-geist-sans)">
      <video
        autoPlay
        loop
        muted
        className="fixed inset-0 w-full h-full object-cover opacity-20 -z-10"
      >
        <source src="/autobus.mp4" type="video/mp4" className=""/>
        Tu navegador no soporta el video de fondo.
      </video>
      <main className="flex flex-1 w-full flex-col items-center justify-center px-6 text-center">
        {/* Logo / Icono */}
        <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="w-10 h-10 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 6v6m8-6v6M3 10h18M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm3 10v1m6-1v1"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          BusTracker <span className="text-blue-400">ITA</span>
        </h1>
        <p className="mt-4 max-w-md text-base text-zinc-400 leading-7">
          Seguimiento en tiempo real del transporte público del{" "}
          <span className="text-zinc-200">Instituto Tecnológico de Altamira</span>.
          Consulta la ubicación de las unidades, las paradas y el tiempo
          estimado de llegada.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/mapa"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13V7m0 13l6-3m-6-10l6-3m0 0 5.447 2.724A1 1 0 0 1 21 7.618v10.764a1 1 0 0 1-1.447.894L15 17m0-10v10"
              />
            </svg>
            Ver Mapa en Tiempo Real
          </Link>
        </div>

        {/* Feature cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
          {[
            {
              icon: "📍",
              title: "Ubicación en vivo",
              desc: "Visualiza dónde están las unidades en este momento.",
            },
            {
              icon: "🕐",
              title: "Tiempo estimado",
              desc: "Calcula cuánto falta para que el camión llegue a tu parada.",
            },
            {
              icon: "🗺️",
              title: "Rutas y paradas",
              desc: "Consulta el recorrido completo y las paradas de cada ruta.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-left"
            >
              <span className="text-2xl">{f.icon}</span>
              <h3 className="mt-3 text-sm font-semibold text-white">{f.title}</h3>
              <p className="mt-1 text-xs text-zinc-400 leading-5">{f.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-xs text-zinc-600">
          Instituto Tecnológico de Altamira · Altamira, Tamaulipas, México
        </p>
      </main>
    </div>
  );
}
