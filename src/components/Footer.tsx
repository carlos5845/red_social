import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 pt-16 pb-8 bg-black">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
            </div>
            SYNC
          </Link>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Diseñado en California.
            <br />
            Construido para el mundo.
          </p>
        </div>

        <FooterColumn
          title="Producto"
          links={["Características", "Integraciones", "Precios", "Changelog"]}
        />
        <FooterColumn
          title="Empresa"
          links={["Sobre Nosotros", "Blog", "Carreras", "Marca"]}
        />
        <FooterColumn
          title="Legal"
          links={["Privacidad", "Términos", "Cookies", "Licencias"]}
        />
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">
        {title}
      </h4>
      {links.map((l) => (
        <a
          key={l}
          className="text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer"
        >
          {l}
        </a>
      ))}
    </div>
  );
}
