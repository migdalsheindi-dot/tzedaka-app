import { Ionicons } from '@expo/vector-icons';
import { formatARS } from './currency';

export type ImpactIcon = keyof typeof Ionicons.glyphMap;

export type ImpactTier = {
  id: string;
  threshold: number;
  icon: ImpactIcon;
  title: string;
  description: (total: number) => string;
};

/**
 * Montos e impacto ilustrativos — ajustar con los valores reales de la
 * organización antes de publicar la app.
 */
export const IMPACT_TIERS: ImpactTier[] = [
  {
    id: 'primeros-pasos',
    threshold: 0,
    icon: 'sparkles',
    title: 'Cada moneda cuenta',
    description: () => 'Empezá tu alcancía de tzedaká: cada donación suma, por chica que sea.',
  },
  {
    id: 'porcion-comida',
    threshold: 1000,
    icon: 'restaurant',
    title: 'Una porción de comida',
    description: (total) => `Con ${formatARS(total)} donados, ayudaste a cubrir una porción de comida para quien la necesita.`,
  },
  {
    id: 'cena-shabbat',
    threshold: 5000,
    icon: 'flame',
    title: 'Una cena de Shabbat',
    description: (total) => `Con ${formatARS(total)} donados, ayudaste a invitar a alguien a una cena de Shabbat.`,
  },
  {
    id: 'canasta-semanal',
    threshold: 15000,
    icon: 'basket',
    title: 'Una canasta semanal',
    description: (total) => `Con ${formatARS(total)} donados, contribuiste a una canasta de alimentos para una familia durante una semana.`,
  },
  {
    id: 'apoyo-mensual',
    threshold: 40000,
    icon: 'people',
    title: 'Apoyo sostenido',
    description: (total) => `Con ${formatARS(total)} donados, tu constancia ya genera un apoyo mensual real para la comunidad.`,
  },
  {
    id: 'pilar-comunitario',
    threshold: 100000,
    icon: 'star',
    title: 'Pilar de la comunidad',
    description: (total) => `Con ${formatARS(total)} donados, sos un pilar de tzedaká para tu comunidad. ¡Todá rabá!`,
  },
];

export function getCurrentTier(total: number): ImpactTier {
  let current = IMPACT_TIERS[0];
  for (const tier of IMPACT_TIERS) {
    if (total >= tier.threshold) {
      current = tier;
    }
  }
  return current;
}

export function getNextTier(total: number): ImpactTier | null {
  return IMPACT_TIERS.find((tier) => tier.threshold > total) ?? null;
}
