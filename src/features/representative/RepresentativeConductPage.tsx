import StudentConductPage from "@features/student/StudentConductPage";
import { RepresentadoSelector } from "./components/RepresentadoSelector";
import { useRepresentados } from "./useRepresentados";

export default function RepresentativeConductPage() {
  const { representados, selectedStudentId, setSelectedStudentId, loading, error } =
    useRepresentados();

  return (
    <div className="space-y-4">
      <RepresentadoSelector
        title="Conducta"
        description="Consulta la evaluación de conducta e incidentes de tus representados"
        representados={representados}
        selectedStudentId={selectedStudentId}
        onSelect={setSelectedStudentId}
        loading={loading}
        error={error}
      />

      {selectedStudentId != null && (
        <StudentConductPage key={selectedStudentId} studentId={selectedStudentId} embedded />
      )}
    </div>
  );
}
