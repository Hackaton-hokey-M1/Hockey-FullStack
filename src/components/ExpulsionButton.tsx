import { X } from "lucide-react";

export default function ExpulsionButton() {
  return (
    <button
      className="flex justify-center items-center w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-lg focus:outline-none"
    >
      <X size={24} />
    </button>
  );
}