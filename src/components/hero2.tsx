import React from "react";
import Link from "next/link";
import { signInWithGoogle } from "@/app/auth/actions";
import { Heart, MessageCircle, Share2 } from "lucide-react";
export default function PlatinumSocialHero() {
  return (
    <>
      {/* 
        Si quieres conservar EXACTO el theme del <script> original, copia esto a tailwind.config.js:

        darkMode: "class",
        theme: {
          extend: {
            colors: {
              primary: "#ffffff",
              "background-light": "#f6f8f6",
              "background-dark": "#050505",
              "lead-dark": "#1a1a1a",
              "lead-light": "#2a2a2a",
              platinum: "#e5e7eb",
            },
            fontFamily: {
              display: ["Manrope", "sans-serif"],
            },
            borderRadius: {
              DEFAULT: "1rem",
              lg: "2rem",
              xl: "3rem",
              full: "9999px",
            },
          },
        },
      */}

      {/* Asegúrate de cargar estas fuentes en tu layout/head:
          - Manrope
          - Material Symbols Outlined
      */}

      <div className="dark">
        <div className="bg-background-light dark:bg-background-dark font-display antialiased selection:bg-white selection:text-black">
          <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-white/5 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-white/5 blur-[150px] pointer-events-none"></div>

            <div className="layout-container flex h-full grow flex-col justify-center items-center z-10">
              <div className="w-full px-6 md:px-12 lg:px-24 xl:px-40 py-12 flex flex-1 justify-center items-center">
                <div className="layout-content-container flex flex-col w-full max-w-[1440px]">
                  <div className="@container">
                    <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
                      <div className="flex flex-col gap-8 flex-1 lg:max-w-[600px]">
                        <div className="flex flex-col gap-6 text-left">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-lead-dark/30 w-fit backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            <span className="text-xs font-medium tracking-wide uppercase text-platinum/70">
                              Acceso seguro
                            </span>
                          </div>

                          <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
                            El estándar{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-platinum to-neutral-500">
                              SYNC
                            </span>{" "}
                            para crear y compartir.
                          </h1>

                          <h2 className="text-neutral-400 text-lg md:text-xl font-light leading-relaxed max-w-xl">
                            Una red social curada para creadores y visionarios.
                            Crea publicaciones, sube imágenes y comparte tu
                            mundo. Inicia sesión para continuar.
                          </h2>
                        </div>

                        <div className="flex flex-col gap-4 mt-2 max-w-sm">
                          <form
                            action={async () => {
                              "use server";
                              await signInWithGoogle();
                            }}
                          >
                            <button
                              type="submit"
                              className="group flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-white px-8 text-black transition-all hover:bg-neutral-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                            >
                              <svg
                                className="h-6 w-6"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                  fill="#4285F4"
                                ></path>
                                <path
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                  fill="#34A853"
                                ></path>
                                <path
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                  fill="#FBBC05"
                                ></path>
                                <path
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                  fill="#EA4335"
                                ></path>
                              </svg>
                              <span className="text-base font-bold tracking-wide">
                                Iniciar sesión con Google
                              </span>
                            </button>
                          </form>

                          <div className="flex items-center gap-3">
                            <div className="h-px bg-white/10 flex-1"></div>
                            <Link
                              href="/login"
                              className="text-xs text-neutral-500 font-medium hover:text-white transition-colors"
                            >
                              o continúa con tu correo
                            </Link>
                            <div className="h-px bg-white/10 flex-1"></div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 opacity-70">
                          <div className="flex -space-x-3 grayscale opacity-80">
                            <img
                              alt="Avatar de usuario"
                              className="h-10 w-10 rounded-full ring-2 ring-black object-cover"
                              data-alt="User avatar profile"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt-bnTQ7WxvnGsRSS1ITeIwYMrbNlvCurqiGGlO_ZV-SOuEUVzODCvQXNM5sv07AVF2WnL-GlNub5Yvy-SDbWPj6oloXgeCeOH39xSoEQwP55eCWMMBb51UgMndmZdVkSmey-lCCXoKXTPy9WuceMD5x3P8sJXiZB8uqV5xT78qS9T0Bkf1DJG3HJaijBF_NfLMdyEPHRfZzpg7Oc53oKzpWwsOwKGxuVEaXseQXnZA4jAiScr0Jm3rjEJNY1ZbHJjw1ae_5ua3AU"
                            />
                            <img
                              alt="Avatar de usuario"
                              className="h-10 w-10 rounded-full ring-2 ring-black object-cover"
                              data-alt="User avatar profile"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4i6muE2ux53lGFzqtAo2hW-9ogBK7x9Pxj7Sl8X10AX6eYzGMpPa2B_T-h2JaZNGaazedsiNse07MTlJ5iavC5Oya8ZOH28Wdb2T9ZCpRhLa9wIye1gaT_OaCd74qTz_eCNwXMPQ6dbrt5Zpu2F0DJ3_IJPfv1WtOJ3j3Uk8kasA5JIURZIbIk2ccxbFZBCCQvoJH0qqibIYhtWYOYOQcBkB5Q3tlraai3xi-RC5b37x5NZ0CyrJdUR0jzsEKzIBHzUoMkAV_zW8"
                            />
                            <img
                              alt="Avatar de usuario"
                              className="h-10 w-10 rounded-full ring-2 ring-black object-cover"
                              data-alt="User avatar profile"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4sRF-h2pJ9P4FAnbSumBn3X_LqvwDNUFwjzeXYp2GT5tbaOeZTJ0B4oLRc_fuQDHz85K6yTnYqy_26tUnaiJDvg-PhpxpRxLosbSNiJ2JTfV5BOLFNkRbGveD0sYeRcf7J5T_iwp7prrUKS94FY-ITSkK6OCuAKO5DrFMGzDnoShkxvk4u-aa3mjz6Ta9RuDNMuuTdwJQfbVhpVuxWrP6gL3GnhwNC6GSakMWjzd1QnhyjVdjzI_LSdXWtLKGJIu3WkBZrvpbJ3w"
                            />
                            <div className="flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-black bg-lead-dark text-xs font-bold text-white">
                              +2k
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <div className="flex gap-0.5 text-neutral-400 text-sm">
                              <span className="material-symbols-outlined text-[16px] fill-current">
                                star
                              </span>
                              <span className="material-symbols-outlined text-[16px] fill-current">
                                star
                              </span>
                              <span className="material-symbols-outlined text-[16px] fill-current">
                                star
                              </span>
                              <span className="material-symbols-outlined text-[16px] fill-current">
                                star
                              </span>
                              <span className="material-symbols-outlined text-[16px] fill-current">
                                star
                              </span>
                            </div>
                            <span className="text-xs text-neutral-500 font-medium">
                              Elegida por creadores top
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="relative flex-1 w-full flex justify-center lg:justify-end">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-lead-dark via-transparent to-transparent rounded-full opacity-20 blur-3xl"></div>

                        <div className="relative w-full max-w-[600px] aspect-square rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#222] to-[#050505] shadow-2xl shadow-black ring-1 ring-white/10 group">
                          <div
                            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-overlay grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                            data-alt="Abstract metallic flowing liquid waves in dark tones"
                          ></div>

                          <div className="absolute bottom-8 left-8 right-8 p-6 bg-black/50 backdrop-blur-md border border-white/10 rounded-3xl shadow-lg flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 flex items-center justify-center text-white font-bold text-sm">
                                  JM
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-white text-sm font-bold">
                                    Julia Morris
                                  </span>
                                  <span className="text-neutral-400 text-xs">
                                    @juliamorris
                                  </span>
                                </div>
                              </div>

                              <button className="h-8 px-4 rounded-full bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors">
                                Seguir
                              </button>
                            </div>

                            <p className="text-neutral-200 text-sm leading-relaxed">
                              Acabo de publicar mi nuevo portafolio en la
                              plataforma. El estilo minimalista es justo lo que
                              buscaba. #diseño #futuro #posts #imagenes
                            </p>

                            <div className="flex gap-4 text-neutral-400">
                              <div className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
                                <Heart className="h-[18px] w-[18px] text-rose-500" />
                                <span className="text-xs">1.2k</span>
                              </div>

                              <div className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
                                <MessageCircle className="h-[18px] w-[18px] text-sky-400" />
                                <span className="text-xs">84</span>
                              </div>

                              <div className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer ml-auto">
                                <Share2 className="h-[18px] w-[18px] text-emerald-400" />
                              </div>
                            </div>
                          </div>

                          <div className="absolute top-8 right-8 h-16 w-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
