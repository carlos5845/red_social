"use client";

import {
  Mail,
  ArrowRight,
  Home,
  Hash,
  Bell,
  MessageSquare,
  Heart,
  MessageCircle,
  Share2,
  ShieldCheck,
  Zap,
  Users,
  BarChart3,
  Code2,
  Quote,
} from "lucide-react";

export function Hero() {
  return (
    <div className="bg-black text-zinc-400 antialiased selection:bg-zinc-800 selection:text-white min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Hero */}
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Versión 2.0 disponible ahora
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-white leading-[1.1]">
            Conexiones reales,
            <br />
            <span className="text-gradient">sin el ruido digital.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed tracking-tight">
            Sync rediseña la interacción social. Sin algoritmos adictivos, sin
            publicidad intrusiva.
          </p>

          {/* Email Form */}
          <div className="max-w-sm mx-auto mt-10 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
            <form className="relative flex items-center bg-black rounded-full p-1 pl-4 border border-zinc-800">
              <Mail className="w-4 h-4 text-zinc-500 mr-3" />
              <input
                type="email"
                placeholder="tu@correo.com"
                required
                className="w-full bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none py-2"
              />
              <button className="bg-white text-black text-xs font-medium px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors flex items-center gap-1">
                Acceder <ArrowRight className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* FEATURES */}
      <section
        id="features"
        className="py-24 px-6 relative z-10 border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Reimaginando lo social
          </h2>
          <p className="text-zinc-500 text-lg max-w-xl">
            Herramientas poderosas para creatividad y privacidad.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Feature
              icon={<ShieldCheck />}
              title="Privacidad Radical"
              text="Encriptación de extremo a extremo por defecto."
            />
            <Feature
              icon={<Zap />}
              title="Velocidad Instantánea"
              text="Interacciones en menos de 50ms."
            />
            <Feature
              icon={<Users />}
              title="Círculos Curados"
              text="Comparte sin mezclar tus espacios."
            />

            <div className="glass-panel p-8 rounded-xl md:col-span-2">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Analytics para Creadores
                  </h3>
                  <p className="text-sm text-zinc-500">
                    Datos agregados sin comprometer privacidad.
                  </p>
                </div>

                <div className="w-full md:w-1/2 h-32 bg-zinc-900/50 rounded border border-white/5 flex items-end justify-between px-4 pb-4">
                  {/* fake bars */}
                  <div className="w-2 bg-zinc-700 h-1/3 rounded-t"></div>
                  <div className="w-2 bg-zinc-700 h-1/2 rounded-t"></div>
                  <div className="w-2 bg-indigo-500 h-3/4 rounded-t"></div>
                  <div className="w-2 bg-zinc-700 h-2/3 rounded-t"></div>
                  <div className="w-2 bg-zinc-700 h-1/2 rounded-t"></div>
                </div>
              </div>
            </div>

            <Feature
              center
              icon={<Code2 />}
              title="API Abierta"
              text="Construye bots y extensiones."
            />
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="py-24 border-t border-white/5 relative bg-zinc-900/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Quote className="w-8 h-8 text-zinc-700 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl text-white mb-6">
            "Por fin una plataforma que respeta mi tiempo e intelecto."
          </h2>

          <div className="flex items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-700"></div>
            <div className="text-left">
              <div className="text-sm text-white">Elena R.</div>
              <div className="text-xs text-zinc-500">Directora de Producto</div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom CSS */}
      <style jsx>{`
        .grid-bg {
          background-image: linear-gradient(
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px
            );
          background-size: 30px 30px;
          mask-image: radial-gradient(
            circle at center,
            black 40%,
            transparent 100%
          );
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .text-gradient {
          background: linear-gradient(to bottom right, #ffffff, #a1a1aa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}

/* Reusable Components */
function TrendItem({ tag, count }: any) {
  return (
    <div className="flex justify-between items-center group cursor-pointer">
      <span className="text-xs text-zinc-400 group-hover:text-indigo-400 transition-colors">
        {tag}
      </span>
      <span className="text-[10px] text-zinc-600">{count}</span>
    </div>
  );
}

function Feature({ icon, title, text, center }: any) {
  return (
    <div
      className={`glass-panel p-8 rounded-xl hover:bg-white/5 transition-colors ${
        center ? "text-center flex flex-col items-center" : ""
      }`}
    >
      <div
        className={`${
          center ? "mb-4" : "w-10 h-10 mb-6"
        } rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{text}</p>
    </div>
  );
}
