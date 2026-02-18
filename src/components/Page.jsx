export default function Page({ title, description }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold page-title mb-2">{title}</h1>
      {description && <p className="page-description">{description}</p>}
    </div>
  )
}
