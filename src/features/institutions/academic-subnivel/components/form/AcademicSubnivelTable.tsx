import { useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { CustomTable } from "@shared/components/Table";
import { Badge } from "@shared/components/Badge";
import { useAcademicSubnivelController } from "../../presentation/hooks/useAcademicSubnivelController";
import type { AcademicSubnivelT } from "../../domain/entities/academic-subnivel.types";

interface AcademicSubnivelTableProps {
  onEdit: (subnivel: AcademicSubnivelT) => void;
}

export const AcademicSubnivelTable = ({ onEdit }: AcademicSubnivelTableProps) => {
  const { academicSubnivels, isLoading, loadAcademicSubnivels } = useAcademicSubnivelController();

  useEffect(() => {
    loadAcademicSubnivels();
  }, [loadAcademicSubnivels]);

  const columns = [
    { key: "code" as keyof AcademicSubnivelT, header: "Código" },
    { key: "name" as keyof AcademicSubnivelT, header: "Nombre" },
    { key: "academic_level_name" as keyof AcademicSubnivelT, header: "Nivel Académico" },
    { key: "order" as keyof AcademicSubnivelT, header: "Orden" },
    {
      key: "is_active" as keyof AcademicSubnivelT,
      header: "Activo",
      render: (data: AcademicSubnivelT) => (
        <Badge variant={data.is_active ? "default" : "outline"}>
          {data.is_active ? "Sí" : "No"}
        </Badge>
      ),
    },
  ];

  const rowActions = (row: AcademicSubnivelT) => (
    <div className="flex gap-2">
      <button onClick={() => onEdit(row)} title="Editar">
        <Pencil className="size-4" />
      </button>
      <button onClick={() => onEdit(row)} title="Eliminar">
        <Trash2 className="size-4" />
      </button>
    </div>
  );

  return (
    <CustomTable
      columns={columns}
      data={academicSubnivels}
      isLoading={isLoading}
      rowActions={rowActions}
    />
  );
};
