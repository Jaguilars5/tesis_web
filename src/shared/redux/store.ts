import authReducer from "@features/auth/reducers/auth.reducer";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import {
  academicPeriodsReducer,
  interdisciplinaryProjectReducer,
  periodTypeReducer,
  subjectAcademicConfigReducer,
  subjectOfferingReducer,
  subjectProjectReducer,
  subjectsReducer,
  teacherSubjectSectionsReducer,
} from "@features/academic";

import { academicGradeReducer } from "@features/institutions/academic-grade";
import { academicLevelReducer } from "@features/institutions/academic-level";
import { academicSubnivelReducer } from "@features/institutions/academic-subnivel";
import { schoolYearReducer } from "@features/institutions/school-year";
import { sectionReducer } from "@features/institutions/section";
import {
  activityTypesReducer,
  blockComponentsReducer,
  componentIndicatorsReducer,
  evaluationBlocksReducer,
  evaluationTypesReducer,
  gradeHistoryReducer,
  gradeTypesReducer,
  periodGradeSummariesReducer,
  projectNotesReducer,
  promotionStatusesReducer,
  qualitativeScalesReducer,
  recoveryProcessesReducer,
  recoveryProcessTypesReducer,
  studentNotesReducer,
} from "@features/grading";
import { representativeReducer, studentReducer } from "@features/students";

const academicReducer = combineReducers({
  subjectAcademicConfigs: subjectAcademicConfigReducer,
  subjects: subjectsReducer,
  academicPeriods: academicPeriodsReducer,
  teacherSubjectSections: teacherSubjectSectionsReducer,
  subjectOfferings: subjectOfferingReducer,
  interdisciplinaryProjects: interdisciplinaryProjectReducer,
  subjectProjects: subjectProjectReducer,
  periodTypes: periodTypeReducer,
});

const institutionsReducer = combineReducers({
  schoolYear: schoolYearReducer,
  academicGrade: academicGradeReducer,
  academicSubnivel: academicSubnivelReducer,
  section: sectionReducer,
  academicLevel: academicLevelReducer,
});

const gradingReducer = combineReducers({
  gradeTypes: gradeTypesReducer,
  qualitativeScales: qualitativeScalesReducer,
  evaluationBlocks: evaluationBlocksReducer,
  blockComponents: blockComponentsReducer,
  componentIndicators: componentIndicatorsReducer,
  gradeHistory: gradeHistoryReducer,
  evaluationTypes: evaluationTypesReducer,
  studentNotes: studentNotesReducer,
  periodGradeSummaries: periodGradeSummariesReducer,
  recoveryProcesses: recoveryProcessesReducer,
  activityTypes: activityTypesReducer,
  promotionStatuses: promotionStatusesReducer,
  recoveryProcessTypes: recoveryProcessTypesReducer,
  projectNotes: projectNotesReducer,
});

const studentsReducer = combineReducers({
  student: studentReducer,
  representative: representativeReducer,
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    institutions: institutionsReducer,
    academic: academicReducer,
    grading: gradingReducer,
    students: studentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
