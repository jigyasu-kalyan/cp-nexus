import { PrismaClient, Submission, Platform } from '@prisma/client';
import prisma from '../config/db';
import axios from 'axios';

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

        // 1. Get Profile ID
        const profile = await tx.platformProfile.findUnique({
            where: {
                userId_platform: {
                    userId: userId,
                    platform: Platform.CODEFORCES,
                },
            },
        });

        if (!profile) {
            throw new Error(`Profile not found for user ${userId} and platform CODEFORCES`);
        }

        // 2. Insert Submissions
        const insertedCount = await tx.submission.createMany({
            data: newSubmissions as any[],
            skipDuplicates: true,
        });
        console.log(`[SYNC] Inserted/Skipped Submissions: ${insertedCount.count}`);

        // 3. Insert Rating History
        if (ratingUpdates.length > 0) {
            const ratingHistoryData = ratingUpdates.map((update: any) => ({
                profileId: profile.id,
                rating: update.newRating,
                contestId: update.contestId,
                contestName: update.contestName,
                rank: update.rank,
                date: new Date(update.ratingUpdateTimeSeconds * 1000),
            }));

            const insertedRatings = await tx.ratingHistory.createMany({
                data: ratingHistoryData,
                skipDuplicates: true,
            });
            console.log(`[SYNC] Inserted/Skipped Ratings: ${insertedRatings.count}`);
        }

        // 4. Update Profile Stats
        await tx.platformProfile.update({
            where: { id: profile.id },
            data: {
                rating: latestRating,
                lastSync: new Date(),
            },
        });

        console.log(`Successfully synced data for ${handle}`);
    });

    return {
        submissionsCount: newSubmissions.length,
        rating: latestRating,
    };
}

class CodeforcesService {
    async getUpcomingContests() {
        try {
            const response = await axios.get('https://codeforces.com/api/contest.list?gym=false');
            if (response.data.status !== 'OK') {
                throw new Error('Failed to fetch contests from Codeforces');
            }

            const contests = response.data.result
                .filter((contest: any) => contest.phase === 'BEFORE')
                .sort((a: any, b: any) => a.startTimeSeconds - b.startTimeSeconds);

            return contests;
        } catch (error) {
            console.error('Error fetching upcoming contests:', error);
            throw error;
        }
    }
}

export const codeforcesService = new CodeforcesService();