const Home = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

      <div className="rounded-2xl bg-slate-900 px-6 py-12 text-center text-white sm:px-10 lg:px-16 lg:py-20">

        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
          Welcome to
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-6xl">
          Mokamtola eFootball Tournament
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base lg:text-lg">
          Follow tournament fixtures, results,
          standings and participating teams
          from one place.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

          <a
            href="/fixtures"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Fixtures
          </a>

          <a
            href="/standings"
            className="rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View Standings
          </a>

        </div>

      </div>

    </section>
  );
};

export default Home;