export function Button({ children, variant = 'primary', className = '', as: Tag = 'button', ...props }) {
  const base = 'inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-sm transition-all duration-200 active:scale-95 cursor-pointer';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-primary hover:bg-red-50',
    whatsapp: 'bg-brand-whatsapp text-white hover:bg-green-600',
  };
  return (
    <Tag className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
