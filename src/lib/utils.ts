import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses a CSV string into an array of objects (assumes first row is header).
 * Args:
 *   csv (string): The CSV content.
 * Returns:
 *   Array of objects, one per row.
 */
export function parseCSV(csv: string): any[] {
    const [headerLine, ...lines] = csv.split(/\r?\n/).filter(Boolean);
    const headers = headerLine.split(/[,;]/).map(h => h.trim());
    return lines.map(line => {
        const values = line.split(/[,;]/).map(v => v.trim());
        const obj: any = {};
        headers.forEach((h, i) => { obj[h] = values[i]; });
        return obj;
    });
}

/**
 * Returns the top 2 candidates from a dataset matching a genre.
 * Args:
 *   genre (string): The genre to match.
 *   dataset (array): The dataset to search.
 *   genreField (string): The field name for genre in the dataset.
 * Returns:
 *   Array of up to 2 candidate objects.
 */
export function getGenreCandidates(genre: string, dataset: any[], genreField: string): any[] {
    return dataset.filter(row => row[genreField]?.toLowerCase().includes(genre.toLowerCase())).slice(0, 2);
}

/**
 * Given a user prompt, candidates, and a similarity function, returns the best candidate.
 * Args:
 *   userPrompt (string): The user's prompt or persona.
 *   candidates (array): Array of candidate objects.
 *   getSimilarityScore (function): (userPrompt, candidate) => Promise<number>
 * Returns:
 *   The best candidate object (highest score).
 */
export async function getBestRagCandidate(userPrompt: string, candidates: any[], getSimilarityScore: (userPrompt: string, candidate: any) => Promise<number>): Promise<any | null> {
    if (candidates.length === 0) return null;
    let best = candidates[0];
    let bestScore = await getSimilarityScore(userPrompt, best);
    for (let i = 1; i < candidates.length; ++i) {
        const score = await getSimilarityScore(userPrompt, candidates[i]);
        if (score > bestScore) {
            best = candidates[i];
            bestScore = score;
        }
    }
    return best;
}
