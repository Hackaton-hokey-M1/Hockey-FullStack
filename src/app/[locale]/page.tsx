import GroupActions from "@/components/GroupActions";
import MatchList from "@/components/MatchList";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Dashboard Hockey
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Suivez tous les matchs de hockey en temps réel
              </p>
            </div>

            {/* Group Actions */}
            <GroupActions />
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡{" "}
              <span className="font-semibold">
                Créez ou rejoignez un groupe
              </span>{" "}
              pour parier avec vos amis sur les matchs !
            </p>
          </div>
        </div>

        {/* Match List */}
        <MatchList />
      </main>
    </div>
  );
}
