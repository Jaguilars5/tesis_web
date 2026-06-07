import type { RequestStatusT } from "@shared/types/commonTypes";
import type { InterdisciplinaryProjectT } from "../domain/entities/interdisciplinary-project.types";

export interface InterdisciplinaryProjectStateT {
  interdisciplinaryProjects: InterdisciplinaryProjectT[];
  status: RequestStatusT;
  error: string | null;
}
