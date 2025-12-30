import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 pt-16 pb-8 bg-black">
      <div className=" w-full border-t border-white/5 bg-background-dark py-4 z-20">
        <div className="layout-container px-6 md:px-12 flex justify-between items-center text-xs text-neutral-600">
          <span>© 2024 Platinum Social Inc.</span>
          <div className="flex gap-6">
            <a className="hover:text-white transition-colors" href="#">
              Privacidad
            </a>
            <a className="hover:text-white transition-colors" href="#">
              Términos
            </a>
            <a className="hover:text-white transition-colors" href="#">
              Contacto
            </a>
          </div>
        </div>
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
