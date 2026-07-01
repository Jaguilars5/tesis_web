import StudentAttendancePage from "@features/student/StudentAttendancePage";
import { RepresentadoSelector } from "./components/RepresentadoSelector";
import { useRepresentados } from "./useRepresentados";

export default function RepresentativeAttendancePage() {
  const { representados, selectedStudentId, setSelectedStudentId, loading, error } =
    useRepresentados();

  return (
    <div className="space-y-4">
      <RepresentadoSelector
        title="Asistencia"
        description="Consulta el registro de asistencia de tus representados"
        representados={representados}
        selectedStudentId={selectedStudentId}
        onSelect={setSelectedStudentId}
        loading={loading}
        error={error}
      />

      {selectedStudentId != null && (
        <StudentAttendancePage
          key={selectedStudentId}
          studentId={selectedStudentId}
          embedded
        />
      )}
    </div>
  );
}
