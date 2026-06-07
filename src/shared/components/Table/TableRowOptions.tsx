import { Edit, Eye, Trash } from "lucide-react";

type options = "edit" | "delete" | "view";
interface TableRowOptionsProps {
  onEdit: () => void;
  onDelete?: () => void;
  onView?: () => void;
  activeOption: options[];
}
export const TableRowOptions: React.FC<TableRowOptionsProps> = ({
  onEdit,
  onDelete,
  onView,
  activeOption,
}) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      {activeOption.includes("view") && (
        <button
          className="rounded-full bg-indigo-100 p-2 text-xs text-indigo-500 hover:bg-indigo-500 hover:text-white"
          onClick={onView}
        >
          <Eye />
        </button>
      )}
      {activeOption.includes("edit") && (
        <button
          className="rounded-full bg-green-100 p-2 text-xs text-green-500 hover:bg-green-500 hover:text-white"
          onClick={onEdit}
        >
          <Edit />
        </button>
      )}
      {activeOption.includes("delete") && (
        <button
          className="rounded-full bg-red-100 p-2 text-xs text-red-500 hover:bg-red-500 hover:text-white"
          onClick={onDelete}
        >
          <Trash />
        </button>
      )}
    </div>
  );
};
