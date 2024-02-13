import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
