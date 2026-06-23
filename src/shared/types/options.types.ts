export interface Option {
  label: string;
  value: string;
}

export interface State {
  enrollmentOptions: Option[];
  subjectOfferingOptions: Option[];
  academicPeriodOptions: Option[];
  qualitativeScaleOptions: Option[];
  loading: boolean;
}

export type Action =
  | { type: "loading" }
  | {
      type: "success";
      enrollments: Option[];
      subjectOfferings: Option[];
      academicPeriods: Option[];
      qualitativeScales: Option[];
    }
  | { type: "error" };
