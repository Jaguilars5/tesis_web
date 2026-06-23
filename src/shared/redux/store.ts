import {
  academicPeriodsReducer,
  classScheduleReducer,
  periodTypeReducer,
  subjectAcademicConfigReducer,
  subjectOfferingReducer,
  subjectsReducer,
  teacherSubjectSectionsReducer,
} from "@features/academic";
import {
  analyticsReducer,
  earlyAlertReducer,
  riskScoreReducer,
  scoringConfigReducer,
} from "@features/analytics";
import authReducer from "@features/auth/auth.slice";
import {
  permissionReducer,
  roleReducer,
  userReducer,
} from "@features/iam";
import {
  activityTypesReducer,
  blockComponentsReducer,
  evaluationBlocksReducer,
  evaluativeActivityReducer,
  gradeHistoryReducer,
  periodGradeSummariesReducer,
  qualitativeScalesReducer,
  qualitativeScaleSublevelReducer,
  studentNotesReducer,
} from "@features/grading";
import {
  attendanceReducer, attendanceStatusReducer, absenceTypeReducer } from "@features/attendance";
import {
  behaviorEvaluationReducer, conductIncidentReducer, incidentTypeReducer, severityReducer } from "@features/behavior";
import { academicGradeReducer } from "@features/institutions/academic-grade";
import { academicLevelReducer } from "@features/institutions/academic-level";
import { academicSubLevelReducer } from "@features/institutions/academic-sublevel";
import { schoolYearReducer } from "@features/institutions/school-year";
import { sectionReducer } from "@features/institutions/section";
import {
  enrollmentsReducer,
  kinshipReducer,
  representativeReducer,
  specialNeedsTypeReducer,
  studentReducer,
} from "@features/students";
import { teacherReducer } from "@features/teacher";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const academicReducer = combineReducers({
  subjectAcademicConfigs: subjectAcademicConfigReducer,
  subjects: subjectsReducer,
  academicPeriods: academicPeriodsReducer,
  teacherSubjectSections: teacherSubjectSectionsReducer,
  subjectOfferings: subjectOfferingReducer,
  classSchedules: classScheduleReducer,
  periodTypes: periodTypeReducer,
});

const institutionsReducer = combineReducers({
  schoolYear: schoolYearReducer,
  academicGrade: academicGradeReducer,
  academicSubLevel: academicSubLevelReducer,
  section: sectionReducer,
  academicLevel: academicLevelReducer,
});

const gradingReducer = combineReducers({
  qualitativeScales: qualitativeScalesReducer,
  evaluationBlocks: evaluationBlocksReducer,
  blockComponents: blockComponentsReducer,
  gradeHistory: gradeHistoryReducer,
  studentNotes: studentNotesReducer,
  periodGradeSummaries: periodGradeSummariesReducer,
  activityTypes: activityTypesReducer,
  evaluativeActivities: evaluativeActivityReducer,
  qualitativeScaleSublevels: qualitativeScaleSublevelReducer,
});

const studentsReducer = combineReducers({
  student: studentReducer,
  representative: representativeReducer,
  kinship: kinshipReducer,
  enrollments: enrollmentsReducer,
  specialNeedsTypes: specialNeedsTypeReducer,
});

const attendanceCombinedReducer = combineReducers({
  attendances: attendanceReducer,
  attendanceStatuses: attendanceStatusReducer,
  absenceTypes: absenceTypeReducer,
});

const behaviorReducer = combineReducers({
  behaviorEvaluations: behaviorEvaluationReducer,
  incidentTypes: incidentTypeReducer,
  severities: severityReducer,
  conductIncidents: conductIncidentReducer,
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    institutions: institutionsReducer,
    academic: academicReducer,
    grading: gradingReducer,
    students: studentsReducer,
    analytics: combineReducers({
      dashboard: analyticsReducer,
      riskScores: riskScoreReducer,
      scoringConfig: scoringConfigReducer,
      earlyAlerts: earlyAlertReducer,
    }),
    attendance: attendanceCombinedReducer,
    behavior: behaviorReducer,
    teacher: teacherReducer,
    iam: combineReducers({
      permissions: permissionReducer,
      roles: roleReducer,
      users: userReducer,
    }),
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
