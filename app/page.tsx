// Fase 2 — componentes de seção serão implementados aqui
export default function HomePage() {
  return (
    <main>
      <section
        id="hero"
        className="flex min-h-screen items-center justify-center"
      >
        <div className="text-center">
          <h1
            className="text-4xl font-bold md:text-6xl text-glow-green font-heading"
          >
            MARKTRACKING
          </h1>
          <p className="mt-4 text-lg font-body text-slate-200">
            Performance Solutions
          </p>
        </div>
      </section>
    </main>
  );
}
