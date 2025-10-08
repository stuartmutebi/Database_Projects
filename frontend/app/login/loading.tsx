export default function Loading() {
  return (
    <div className="mx-auto max-w-md p-6">
      <div className="h-6 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-6 space-y-3">
        <div className="h-9 w-full animate-pulse rounded bg-muted" />
        <div className="h-9 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
