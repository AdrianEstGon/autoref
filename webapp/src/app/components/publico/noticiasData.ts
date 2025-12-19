export type Noticia = {
  slug: string;
  titulo: string;
  fecha: string; // yyyy-mm-dd
  resumen: string;
  imagen?: string;
  contenido: string; // simple text/markdown-like
};

// Storage key para localStorage
const NOTICIAS_STORAGE_KEY = 'autoref_noticias';

// Noticias por defecto (se usan si no hay datos en localStorage)
const defaultNoticias: Noticia[] = [
  {
    slug: 'bienvenida-a-autoref',
    titulo: 'Bienvenida a AutoRef: resultados, clasificaciones y gestión en un solo sitio',
    fecha: '2025-12-19',
    resumen:
      'Estrenamos el nuevo portal público de AutoRef con una experiencia más clara para consultar competiciones, calendario y clasificación.',
    imagen: '/fondo4.jpeg',
    contenido:
      'AutoRef ya ofrece portal público con calendario, resultados y clasificación. En las próximas iteraciones añadiremos más filtros, accesos rápidos y mejoras de rendimiento.',
  },
  {
    slug: 'mejoras-disponibilidad-y-designaciones',
    titulo: 'Mejoras en disponibilidad y designaciones',
    fecha: '2025-12-18',
    resumen:
      'Optimizamos la carga del calendario de disponibilidad y añadimos flujos más claros para confirmar o rechazar designaciones con motivo.',
    imagen: '/fondo2.jpeg',
    contenido:
      'La disponibilidad ahora carga por mes en una sola llamada y puedes eliminar franjas desde el calendario. En designaciones, se registran motivos de rechazo y fechas de respuesta.',
  },
  {
    slug: 'facturacion-y-liquidaciones',
    titulo: 'Nuevo módulo de liquidaciones, órdenes de pago y facturación',
    fecha: '2025-12-18',
    resumen:
      'Añadimos liquidaciones por día/partido, exportación de remesas SEPA y facturas a clubes con estados.',
    imagen: '/fondo3.jpeg',
    contenido:
      'Los árbitros pueden crear y enviar liquidaciones. El comité aprueba/rechaza. Se generan órdenes de pago por periodo y se exporta SEPA. La federación puede emitir facturas e imprimirlas.',
  },
];

// Función para obtener noticias (lee desde localStorage o usa las por defecto)
export const getNoticias = (): Noticia[] => {
  try {
    const stored = localStorage.getItem(NOTICIAS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Primera vez: guardar las noticias por defecto
    localStorage.setItem(NOTICIAS_STORAGE_KEY, JSON.stringify(defaultNoticias));
    return defaultNoticias;
  } catch {
    return defaultNoticias;
  }
};

// Variable reactiva para compatibilidad con código existente
// (se recarga al inicio, pero para cambios dinámicos usar getNoticias())
export const noticias: Noticia[] = getNoticias();


