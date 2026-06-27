import { useMemo } from "react";

const BLOCK_TYPE_OPTIONS = [
  { label: "Formativa", value: "FORMATIVA" },
  { label: "Sumativa", value: "SUMATIVA" },
  { label: "Proyecto", value: "PROJECT" },
];

export const useBlockTypeOptions = () => {
  const options = useMemo(() => BLOCK_TYPE_OPTIONS, []);
  return { blockTypeOptions: options };
};
