export default function Loading() {
  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="h-8 w-48 bg-slate-100 rounded animate-pulse mb-2" />
      <div className="h-6 w-32 bg-slate-100 rounded animate-pulse mb-6" />
      <div className="flex gap-4 mb-6">
        <div className="h-9 w-48 bg-slate-100 rounded-lg animate-pulse" />
        <div className="h-9 w-28 bg-slate-100 rounded-lg animate-pulse" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
