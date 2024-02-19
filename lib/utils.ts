import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 *
 * Add a minimum delay to a function for a better user experience.
 *
 * @param fn
 * @param delay
 */
export async function minimumDelay(fn: () => Promise<void>, delay: number = 200): Promise<void> {
  // Run the provided function
  const actionPromise = fn();

  // Create a delay promise
  const delayPromise = new Promise<void>((resolve) => setTimeout(resolve, delay));

  // Wait for both the action and the delay to complete
  await Promise.all([actionPromise, delayPromise]);
}

export function fileSizeFromBytes(bytes: number, decimals: number = 2): string {
  if (bytes < 0) return 'Invalid size'; // Error handling for negative bytes
  if (bytes === 0) return '0 Bytes';
  const k = 1000; // Change to 1024 if you prefer using binary units
  const dm = decimals < 0 ? 0 : decimals; // Ensure decimals is non-negative
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  if (i === 0) return `${bytes} ${sizes[i]}`; // Bytes don't need decimal precision
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
