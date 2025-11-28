import { Request, Response } from "express";
import prisma from "../config/db";

/**
 * @desc Create a new team
 * @route POST /api/v1/teams
 * @access Private (Requires auth)
 */
export const createTeam = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const userId = req.user!.id;

        if (!name) {
            return res.status(400).json({ message: "Team name is required." });
        }

        const newTeam = await prisma.$transaction(async tx => {
            const team = await tx.team.create({
                data: {
                    name,
                },
            });
            await tx.teamMembership.create({
                data: {
                    userId: userId,
                    teamId: team.id,
                    role: 'admin',
                },
            });

            return team;
        });

        return res.status(201).json(newTeam);
    } catch(error: any) {
        if (error.code == 'P2002' && error.meta?.target.includes('name')) {
            return res.status(409).json({ message: "Team with this name already exists." });
        }
        console.error(`Error creating team: ${error}`);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

/**
 * @desc Get a single team's details by its ID
 * @route GET /api/v1/teams/:teamId
 * @access Private (Must be a member of the team)
 */
export const getTeamById = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params;
        const userId = req.user!.id;

        const team = await prisma.team.findFirst({
            where: {
                id: teamId,
                members: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                            },
                        },
                    },
                },
            },
        });
        if (!team) {
            return res.status(404).json({ message: "Team not found or you are not a member of this team." });
        }
        return res.status(200).json(team);
    } catch (error) {
        console.error(`Error getting team by id: ${error}`);
        return res.status(500).json({ message: "Internal server error." });
    }
}

/**
 * @desc Get all teams the current user is a member of
 * @route GET /api/v1/teams
 * @access Private
 */
export const getMyTeams = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const teams = await prisma.team.findMany({
            where: {
                members: {
                    some: {
                        userId: userId,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                _count: {
                    select: {
                        members: true,
                    },
                },
            },
        });
        return res.status(200).json(teams);
    } catch (error) {
        console.error(`Error getting user\'s teams: ${error}`);
        return res.status(500).json({ message: "Internal server error." });
    }
}