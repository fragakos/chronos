import { Button } from "@/components/ui/button";
import { CheckSquare, Square } from "lucide-react";

interface SelectAllButtonProps {
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  selectAllLabel: string;
  deselectAllLabel: string;
  className?: string;
}

export const SelectAllButton = ({
  isAllSelected,
  onToggleSelectAll,
  selectAllLabel,
  deselectAllLabel,
  className,
}: SelectAllButtonProps) => {
  return (
    <div className={`flex justify-start mb-4 ${className || ""}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleSelectAll}
        aria-label={isAllSelected ? deselectAllLabel : selectAllLabel}
      >
        {isAllSelected ? (
          <CheckSquare className="h-4 w-4" />
        ) : (
          <Square className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
