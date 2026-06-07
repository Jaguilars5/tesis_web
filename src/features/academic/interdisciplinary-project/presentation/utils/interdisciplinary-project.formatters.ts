import type { InterdisciplinaryProjectT } from "../../domain/entities/interdisciplinary-project.types";

export const formatInterdisciplinaryProjectTitle = (item: InterdisciplinaryProjectT): string => item.title;

export const formatDateRange = (item: InterdisciplinaryProjectT): string =>
  `${item.start_date} - ${item.delivery_date}`;
