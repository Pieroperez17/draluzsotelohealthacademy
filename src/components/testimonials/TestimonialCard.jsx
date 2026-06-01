import { Quote } from 'lucide-react';

export function TestimonialCard({ testimonial }) {
  const initials = testimonial.author_name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('');

  return (
    <article className="card p-6 flex flex-col gap-4">
      <Quote size={32} className="text-primary/20 flex-shrink-0" />
      <p className="text-brand-text text-sm leading-relaxed italic flex-1">
        "{testimonial.testimonial_text}"
      </p>
      <div className="flex items-center gap-3 border-t border-brand-gray pt-4">
        {testimonial.image_url ? (
          <img
            src={testimonial.image_url}
            alt={testimonial.author_name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold text-sm">{initials}</span>
          </div>
        )}
        <div>
          <p className="font-semibold text-brand-dark text-sm">{testimonial.author_name}</p>
          {testimonial.role && (
            <p className="text-brand-midgray text-xs">{testimonial.role}</p>
          )}
        </div>
      </div>
    </article>
  );
}
