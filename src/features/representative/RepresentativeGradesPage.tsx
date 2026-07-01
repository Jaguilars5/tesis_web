import StudentGradesPage from "@features/student/StudentGradesPage";
import { RepresentadoSelector } from "./components/RepresentadoSelector";
import { useRepresentados } from "./useRepresentados";

export default function RepresentativeGradesPage() {
  const { representados, selectedStudentId, setSelectedStudentId, loading, error } =
    useRepresentados();

  return (
    <div className="space-y-4">
      <RepresentadoSelector
        title="Calificaciones"
        description="Consulta las notas de tus representados por período, materia y actividad"
        representados={representados}
        selectedStudentId={selectedStudentId}
        onSelect={setSelectedStudentId}
        loading={loading}
        error={error}
      />

      {selectedStudentId != null && (
        <StudentGradesPage key={selectedStudentId} studentId={selectedStudentId} embedded />
      )}
    </div>
  );
}
