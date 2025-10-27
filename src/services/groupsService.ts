export type PublicGroup = {
    id: string;
    name: string;
    membersCount: number;
    matchId: string;
};

const demo: PublicGroup[] = [
    { id: "g_lyon",     name: "Fans Lyon",     membersCount: 8, matchId: "1" },
    { id: "g_grenoble", name: "Team Grenoble", membersCount: 5, matchId: "1" },
];

export const groupsService = {
    async listPublicByMatch(matchId: string): Promise<PublicGroup[]> {
        return demo.filter((g) => g.matchId === matchId);
    },
    async create(input: { name: string; visibility: "PUBLIC" | "PRIVATE"; matchId: string; tournamentId?: string }) {
        console.log("create group", input);
    },
    async join(groupId: string) {
        console.log("join group", groupId);
    },
};
