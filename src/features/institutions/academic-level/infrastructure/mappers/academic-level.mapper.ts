import type { AcademicLevelT } from "../../domain/entities/academic-level.types";

export class AcademicLevelMapper {
  static toDomain(raw: Record<string, unknown>): AcademicLevelT {
    return {
      id: raw.id as number,
      name: raw.name as string,
      is_active: raw.is_active as boolean,
    };
  }

  static toPersistence(domain: Partial<AcademicLevelT>): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    if (domain.name !== undefined) data.name = domain.name;
    if (domain.is_active !== undefined) data.is_active = domain.is_active;
    return data;
  }
}
