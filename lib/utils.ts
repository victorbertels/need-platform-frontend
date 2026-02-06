import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else if (d.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else if (d.getFullYear() === today.getFullYear()) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } else {
    return d.toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' });
  }
}

export function formatCurrency(amount: number, currency: string = 'EUR') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function getRatingColor(rating: number) {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 3.5) return 'text-yellow-600';
  if (rating >= 2.5) return 'text-orange-600';
  return 'text-red-600';
}

export function truncateText(text: string, length: number = 100) {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password: string) {
  return password.length >= 8;
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function truncatePasswordToBcryptLimit(password: string): string {
  // Bcrypt has a 72-byte limit, not character limit
  // UTF-8 characters can be multi-byte, so we need to be careful
  const encoder = new TextEncoder();
  let truncated = password;
  
  while (encoder.encode(truncated).length > 72) {
    truncated = truncated.slice(0, -1);
  }
  
  return truncated;
}
