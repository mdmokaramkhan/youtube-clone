export default function Page({ title, description }) {
  return (
    <div className="p-4">
      <h1 className="text-base font-semibold page-title mb-1.5">{title}</h1>
      {description && <p className="page-description text-sm">{description}</p>}
    </div>
  )
}
