'use client'
import React from "react";
import Link from 'next/link';

const contextCards = [
  {
    title: "Problema actual",
    description:
      "Muchos estudiantes dependen del transporte publico y no tienen una forma clara de saber en donde viene la unidad o cuanto falta para que llegue.",
  },
  {
    title: "Enfoque del proyecto",
    description:
      "La propuesta integra seguimiento operativo y visualizacion GIS para mostrar rutas, paradas y tiempos estimados dentro de una sola experiencia.",
  },
  {
    title: "Impacto esperado",
    description:
      "Reducir la incertidumbre en los traslados y ayudar a que la comunidad estudiantil tome mejores decisiones sobre su movilidad diaria.",
  },
];

export default function Home() {
  const [showText, setShowText] = React.useState(false);
  const text = "BusTracker";

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    },2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="flex flex-col flex-1 items-center justify-center  font-(--font-geist-sans)">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 -z-10 h-full min-h-screen w-full object-cover opacity-20"
      >
        <source src="/autobus.mp4" type="video/mp4" />
        Tu navegador no soporta el video de fondo.
      </video>
      <main className="flex w-full flex-1 flex-col items-center px-6 py-12">
        <div className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-8 sm:flex-row sm:gap-6">
          <div className="flex w-full flex-col items-center justify-center gap-6 text-center sm:text-left">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Bienvenido a{" "}
              {showText && (
                <span className="inline-block">
                  {text.split("").map((letter, index) => (
                    <span
                      key={index}
                      id={index === 0 ? "efect_text_bus" : undefined}
                      className="letter-appear"
                      style={{
                        animationDelay: `${index * 0.5}s`,
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </span>
              )}
            </h1>
            <p className="max-w-2xl text-center text-lg leading-8 text-zinc-200">
              Visualiza rutas, paradas y el seguimiento del transporte publico del Instituto
              Tecnologico de Altamira desde una interfaz clara y accesible.
            </p>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-6">
            <div className="flex h-40 w-full items-center justify-center rounded-3xl border border-white/10 bg-black/25 shadow-md backdrop-blur-sm">
              <Link href="/mapa" className="rounded-full border border-rose-400/40 px-8 py-4 text-2xl font-bold font-mono text-rose-400 transition hover:bg-rose-500/10">
                Ver mapa de rutas
              </Link>
            </div>
          </div>
        </div>
        <section className="relative z-10 mx-auto mt-8 flex w-full max-w-6xl flex-col gap-8 rounded-4xl border border-white/10 bg-black/30 p-8 backdrop-blur-md">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-200">
              Contexto del proyecto
            </span>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Una solucion pensada para la movilidad estudiantil del ITA
            </h2>
            <p className="text-base leading-8 text-zinc-200">
              Este prototipo nace porque una parte importante de los estudiantes del Instituto
              Tecnologico de Altamira depende del transporte publico para llegar al campus. La
              falta de informacion sobre recorridos, ubicacion actual y tiempos de llegada genera
              incertidumbre, esperas largas y decisiones poco precisas durante el traslado.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {contextCards.map((card) => (
              <article
                key={card.title}
                className="rounded-3xl border border-white/10 bg-white/6 p-6 shadow-lg shadow-black/10"
              >
                <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-300">{card.description}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-6">
              <h3 className="text-2xl font-semibold text-white">Objetivo general</h3>
              <p className="mt-4 text-sm leading-8 text-zinc-300">
                Analizar el seguimiento y funcionamiento de las rutas utilizadas por los
                estudiantes mediante herramientas GIS, para desarrollar una aplicacion que permita
                visualizar el recorrido de las unidades y estimar sus tiempos de llegada a las
                paradas.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-fuchsia-500/10 p-6">
              <h3 className="text-2xl font-semibold text-white">Por que importa</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-200">
                <li>Menos incertidumbre al esperar el autobus.</li>
                <li>Mejor planificacion para llegar a clases.</li>
                <li>Informacion visual y util para la toma de decisiones.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
