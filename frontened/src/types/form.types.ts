import type { Ref } from "react";

export type FormFieldRenderProps<T> = {
  field: {
    value: T;
    onChange: (...event: any[]) => void;
    onBlur: () => void;
    name: string;
    ref: Ref<any>;
  };
};
