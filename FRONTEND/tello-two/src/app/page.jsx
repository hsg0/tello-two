import Link from "next/link";
import { Orbitron, Space_Grotesk } from "next/font/google";

const display = Orbitron({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const body = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function Home() {
  return (
    <main
      className={`${body.className} relative flex min-h-screen flex-col overflow-hidden text-white`}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[#05070A]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 70% 40%, rgba(34, 211, 238, 0.18), transparent 55%),
            radial-gradient(ellipse 50% 40% at 15% 80%, rgba(14, 116, 144, 0.22), transparent 50%),
            linear-gradient(180deg, #05070A 0%, #0A1218 50%, #05070A 100%)
          `,
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 75%)",
        }}
      />

      <div
        aria-hidden
        className="tello-orbit pointer-events-none absolute -right-24 top-1/4 h-[28rem] w-[28rem] rounded-full border border-cyan-400/20"
      />
      <div
        aria-hidden
        className="tello-orbit-reverse pointer-events-none absolute -right-8 top-[28%] h-72 w-72 rounded-full border border-cyan-300/10"
      />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
        <div className="max-w-3xl">
          <p
            className={`${display.className} tello-fade-up mb-4 text-sm tracking-[0.35em] text-cyan-300`}
          >
            TELLO
          </p>

          <h1
            className={`${display.className} tello-fade-up-delay-1 text-4xl font-bold leading-tight tracking-wide text-white sm:text-6xl lg:text-7xl`}
          >
            Command
            <br />
            Center
          </h1>

          <p className="tello-fade-up-delay-2 mt-6 max-w-md text-base leading-relaxed text-white/65 sm:text-lg">
            Assign your session, link a drone, and fly from the browser.
          </p>

          <div className="tello-fade-up-delay-3 mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg bg-cyan-400 px-8 py-3 text-sm font-semibold tracking-wide text-black transition hover:bg-cyan-300"
            >
              Enter Dashboard
            </Link>
            <span className="text-xs tracking-widest text-white/40 uppercase">
              Web drone controller
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
