import type { RequestStatusT } from "@shared/types/commonTypes";
import type { BlockComponentT } from "../domain/entities/block-components.types";

export interface BlockComponentsStateT {
  blockComponents: BlockComponentT[];
  status: RequestStatusT;
  error: string | null;
}
