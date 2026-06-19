export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-112 w-md rounded-full bg-teal-500/10 blur-[120px]" />
    </div>
  );
}
