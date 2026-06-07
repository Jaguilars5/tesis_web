import type { EvaluationBlockT } from "../../domain/entities/evaluation-block.types";

export const formatEvaluationBlockName = (item: EvaluationBlockT): string => item.name;
