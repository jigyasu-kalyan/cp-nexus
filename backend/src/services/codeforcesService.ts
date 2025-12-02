import { PrismaClient, Submission, Platform } from '@prisma/client';
import prisma from '../config/db';

const CODEFORCES_BASE_URL = 'https://codeforces.com/api';

// Helper to handle fetch and error/JSON checks cleanly
async function fetchCodeforcesData(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.status !== 'OK') {
        throw new Error(`Codeforces API failure: ${data.comment || 'Unknown error'}`);
    }
    return data.result;
}

/**
 * Fetches and processes Codeforces submissions and rating history for a given handle.
 * NOTE: This is a synchronous, blocking operation. Use judiciously.
 * @param userId The CP-Nexus User ID.
 * @param handle The Codeforces handle.
 */
export async function syncCodeforcesData(userId: string, handle: string) {
    const [submissionsData, ratingUpdates] = await Promise.all([
        fetchCodeforcesData(`${CODEFORCES_BASE_URL}/user.status?handle=${handle}`),
        fetchCodeforcesData(`${CODEFORCES_BASE_URL}/user.rating?handle=${handle}`)
    ]);
    const newSubmissions = submissionsData
        .filter((sub: any) => sub.verdict === 'OK') // Keep only accepted solutions
        .map((sub: any) => ({
            userId: userId,
            platform: Platform.CODEFORCES,
            problemName: sub.problem.name,
            problemUrl: `https://codeforces.com/problemset/problem/${sub.contestId}/${sub.problem.index}`,
            problemRating: sub.problem.rating,
            tags: sub.problem.tags || [],
            verdict: 'ACCEPTED',
            submittedAt: new Date(sub.creationTimeSeconds * 1000),
        }));
    const latestRating = ratingUpdates.length > 0 ? ratingUpdates[ratingUpdates.length - 1].newRating : null;
    await prisma.$transaction(async (tx) => {
        console.log(`[SYNC] Processing ${newSubmissions.length} submissions for ${handle}`);
        const insertedCount = await tx.submission.createMany({
            data: newSubmissions as any[],
            skipDuplicates: true,
        });
        console.log(`[SYNC] Inserted/Skipped: ${insertedCount.count}`);

        await tx.platformProfile.update({
            where: {
                userId_platform: {
                    userId: userId,
                    platform: Platform.CODEFORCES,
                },
            },
            data: {
                rating: latestRating,
                lastSync: new Date(),
            },
        });

        console.log(`Successfully bulk inserted/skipped ${insertedCount.count} submissions.`);
    });
    return {
        submissionsCount: newSubmissions.length,
        rating: latestRating,
    };
}