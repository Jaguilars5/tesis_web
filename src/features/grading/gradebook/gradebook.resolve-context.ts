import { academicPeriodService } from "@features/academic/academic-period/academic-period.service";
import { blockComponentService } from "@features/grading/block-components/block-components.service";
import { evaluationBlockService } from "@features/grading/evaluation-blocks/evaluation-blocks.service";

import { evaluativeActivityService } from "../evaluative-activities/evaluative-activities.service";

import type { GradingContextT, TakeByActivityResponseT } from "./gradebook.types";

type RosterPeriodT = TakeByActivityResponseT["academic_period"];
type RosterActivityT = TakeByActivityResponseT["evaluative_activity"];

function buildGradingContext(
  activity: { id: number; title: string; dueDate: string },
  period: {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    grades_locked?: boolean;
  },
): GradingContextT {
  return {
    activityId: activity.id,
    activityTitle: activity.title,
    dueDate: activity.dueDate,
    periodId: period.id,
    periodName: period.name,
    periodStartDate: period.start_date,
    periodEndDate: period.end_date,
    gradesLocked: period.grades_locked ?? false,
  };
}

export async function resolveGradingContext(
  evaluativeActivityId: number,
  rosterActivity?: RosterActivityT,
  rosterPeriod?: RosterPeriodT,
): Promise<GradingContextT> {
  if (
    rosterPeriod?.id &&
    rosterActivity?.due_date &&
    rosterActivity.id
  ) {
    return buildGradingContext(
      {
        id: rosterActivity.id,
        title: rosterActivity.title,
        dueDate: rosterActivity.due_date,
      },
      rosterPeriod,
    );
  }

  const activity = await evaluativeActivityService.get({
    id: evaluativeActivityId,
  });

  if (!activity.block_component) {
    throw new Error(
      "No se pudo determinar el período académico de la actividad.",
    );
  }

  const component = await blockComponentService.get({
    id: activity.block_component,
  });
  const block = await evaluationBlockService.get({
    id: component.evaluation_block,
  });
  const period = await academicPeriodService.get({
    id: block.academic_period,
  });

  return buildGradingContext(
    {
      id: activity.id,
      title: rosterActivity?.title ?? activity.title,
      dueDate: rosterActivity?.due_date ?? activity.due_date,
    },
    period,
  );
}
