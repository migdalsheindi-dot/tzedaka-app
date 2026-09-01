const arsFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export function formatARS(amount: number): string {
  return arsFormatter.format(amount);
}

export function parseARSInput(raw: string): number {
  const digitsOnly = raw.replace(/[^0-9]/g, '');
  return digitsOnly ? parseInt(digitsOnly, 10) : 0;
}
