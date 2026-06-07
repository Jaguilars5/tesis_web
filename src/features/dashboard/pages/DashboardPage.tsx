import { UserRoleEnum } from "@features/auth";
import { useAppSelector } from "../../../shared/redux/hooks";
import { selectAuthUser } from "../../auth/reducers/auth.selectors";
import { CounselorDashboard } from "./dashboards/CounselorDashboard";
import { DirectorDashboard } from "./dashboards/DirectorDashboard";
import { RectorDashboard } from "./dashboards/RectorDashboard";
import { RepresentativeDashboard } from "./dashboards/RepresentativeDashboard";
import { StudentDashboard } from "./dashboards/StudentDashboard";
import { TeacherDashboard } from "./dashboards/TeacherDashboard";

export default function DashboardPage() {
  const user = useAppSelector(selectAuthUser);
  const role = user?.role;
  const userName = user?.names ?? "";

  switch (role) {
    case UserRoleEnum.STUDENT:
      return <StudentDashboard userName={userName} />;
    case UserRoleEnum.REPRESENTATIVE:
      return <RepresentativeDashboard userName={userName} />;
    case UserRoleEnum.TEACHER:
      return <TeacherDashboard userName={userName} />;
    case UserRoleEnum.DIRECTOR:
      return <DirectorDashboard />;
    case UserRoleEnum.RECTOR:
      return <RectorDashboard userName={userName} />;
    case UserRoleEnum.COUNSELOR:
      return <CounselorDashboard userName={userName} />;
    default:
      console.warn("Unknown user role:", role);
      return <div>Rol de usuario desconocido</div>;
  }
}
