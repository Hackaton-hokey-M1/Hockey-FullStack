import {MatchGroupToolbar} from "@/components/MatchGroupToolbar";
import MatchHeader from "@/components/MatchHeader";
import PublicGroupList from "@/components/PublicGroupList";
import type { Match } from "@/types/match";

const mockMatch: Match = {
    id: "2",
    homeTeam: { id: "lyon", name: "Lyon Blades", shortName: "LYO" },
    awayTeam: { id: "grenoble", name: "Grenoble Bears", shortName: "GRE" },
    homeScore: 0,
    awayScore: 0,
    date: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    status: "scheduled",
    tournament: { id: "t1", name: "Lyon Hockey League" },
    venue: "Patinoire Charlemagne",
    round: "Saison régulière",
};

export default async function MatchPage() {
    const match = mockMatch;

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 space-y-6">
            <MatchHeader match={match} />
            <MatchGroupToolbar match={match} />
            <PublicGroupList matchId={match.id} />
        </div>
    );
}
