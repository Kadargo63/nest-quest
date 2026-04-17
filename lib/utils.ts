export function currency(value: number | string | null | undefined) {
  const num = Number(value || 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
}

export function percent(value: number | string | null | undefined) {
  const num = Number(value || 0);
  return `${Math.round(num * 100)}%`;
}

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}
