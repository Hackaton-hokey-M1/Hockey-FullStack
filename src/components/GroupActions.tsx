"use client";

import { Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

interface GroupActionsProps {
  onCreateGroup?: () => void;
  onJoinGroup?: () => void;
}

export default function GroupActions({
  onCreateGroup,
  onJoinGroup,
}: GroupActionsProps) {
  const handleCreateGroup = () => {
    if (onCreateGroup) {
      onCreateGroup();
    } else {
      // TODO: Implémenter la logique de création de groupe
      console.log("Créer un groupe de pari");
    }
  };

  const handleJoinGroup = () => {
    if (onJoinGroup) {
      onJoinGroup();
    } else {
      // TODO: Implémenter la logique pour rejoindre un groupe
      console.log("Rejoindre un groupe");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <Button
        onClick={handleCreateGroup}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        size="lg"
      >
        <Plus className="w-5 h-5" />
        <span>Créer un groupe</span>
      </Button>

      <Button
        onClick={handleJoinGroup}
        variant="outline"
        className="flex items-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        size="lg"
      >
        <Users className="w-5 h-5" />
        <span>Rejoindre un groupe</span>
      </Button>
    </div>
  );
}
