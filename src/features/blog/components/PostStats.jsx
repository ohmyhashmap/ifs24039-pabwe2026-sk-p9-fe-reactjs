export default function PostStats({ total = 0, published = 0, draft = 0 }) {
  const items = [
    { label: 'Total Artikel', value: total },
    { label: 'Terbit', value: published },
    { label: 'Draf', value: draft },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300">{item.label}</p>
          <p className="text-3xl font-bold text-[var(--color-accent)]">{item.value}</p>
        </div>
      ))}
    </div>
  )
}
