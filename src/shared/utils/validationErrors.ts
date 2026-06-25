export type CreateRejectValue = {
  msg: string;
  data: Record<string, string> | null;
};

export type ValidationErrors = Record<string, string>;

export interface SubmitErrorState {
  general: string[];
  validation: ValidationErrors;
}

export type UnwrapResult<TResult> =
  | { ok: true; result: TResult; errors: SubmitErrorState }
  | { ok: false; result: null; errors: SubmitErrorState };

export const toRejectValue = (e: unknown): CreateRejectValue => {
  const msg = e instanceof Error ? e.message : "Error desconocido";
  const cause =
    e instanceof Error ? (e as { cause?: unknown }).cause : undefined;
  const d = (cause as { response?: { data?: { data?: unknown } } })?.response
    ?.data;
  return { msg, data: (d?.data as Record<string, string> | null) ?? null };
};

export const extractError = (
  e: unknown,
): { msg: string; general: string[]; validation: ValidationErrors } => {
  if (
    e &&
    typeof e === "object" &&
    "msg" in e &&
    typeof (e as { msg?: unknown }).msg === "string"
  ) {
    const obj = e as CreateRejectValue;
    const fes: ValidationErrors = {};
    const gen: string[] = [];
    if (obj.data && typeof obj.data === "object") {
      for (const [k, v] of Object.entries(obj.data)) {
        if (typeof v === "string") fes[k] = v;
        else gen.push(`${k}: ${v}`);
      }
    }
    if (gen.length === 0 && Object.keys(fes).length === 0) gen.push(obj.msg);
    return { msg: obj.msg, general: gen, validation: fes };
  }
  const msg = e instanceof Error ? e.message : "Error desconocido";
  return { msg, general: [msg], validation: {} };
};

export const unwrapMutation = async <TArg, TResult>(
  arg: TArg,
  mutate: (arg: TArg) => Promise<TResult>,
): Promise<UnwrapResult<TResult>> => {
  try {
    return {
      ok: true,
      result: await mutate(arg),
      errors: { general: [], validation: {} },
    };
  } catch (e) {
    const p = extractError(e);
    return {
      ok: false,
      result: null,
      errors: { general: p.general, validation: p.validation },
    };
  }
};
