import type { Ref } from "react";

export type FormFieldRenderProps<T> = {
  field: {
    value: T;
    onChange: (...event: unknown[]) => void;
    onBlur: () => void;
    name: string;
    ref: Ref<HTMLElement>;
  };
};
