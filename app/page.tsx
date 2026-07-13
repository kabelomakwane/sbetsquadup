export default function Home() {
  return (
    <main
      className="flex flex-1 flex-col items-center justify-center gap-4"
      style={{
        background:
          "linear-gradient(180deg, var(--color-brand-blue), var(--color-brand-blue-end))",
      }}
    >
      <h1 className="font-display text-cap-trim text-3xl font-black uppercase italic text-white">
        Squad Up
      </h1>
      <p className="font-body text-white-75">Coming soon.</p>
    </main>
  );
}
