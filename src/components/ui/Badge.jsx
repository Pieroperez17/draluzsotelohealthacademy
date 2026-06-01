export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-brand-lightgray text-brand-text',
    primary: 'bg-red-50 text-primary',
    success: 'bg-green-50 text-green-700',
    info: 'bg-blue-50 text-blue-700',
    realizado: 'bg-green-50 text-green-700 border border-green-200',
    por_realizar: 'bg-blue-50 text-blue-700 border border-blue-200',
  };
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
}
