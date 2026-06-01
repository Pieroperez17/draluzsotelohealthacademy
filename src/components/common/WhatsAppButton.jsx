import { MessageCircle } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/51989019135?text=Hola,%20me%20interesa%20información%20sobre%20los%20cursos%20de%20la%20Academia.';

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-brand-whatsapp rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors duration-200 whatsapp-pulse"
    >
      <MessageCircle size={28} className="text-white" fill="white" />
    </a>
  );
}
