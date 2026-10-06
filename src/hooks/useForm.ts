import { useCallback, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FocusEvent, FormEvent } from 'react';

import type { FormErrors } from '../types/assignment';

export type FormValues = Record<string, string>;
export type Validator<T extends FormValues> = (values: T) => FormErrors<T>;
export type TouchedMap<T> = { [K in keyof T]?: boolean };

type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export interface FieldProps {
  name: string;
  value: string;
  onChange: (event: ChangeEvent<FieldElement>) => void;
  onBlur: (event: FocusEvent<FieldElement>) => void;
}

export interface UseFormResult<T extends FormValues> {
  values: T;
  errors: FormErrors<T>;
  touched: TouchedMap<T>;
  isValid: boolean;
  setField: <K extends keyof T>(name: K, value: T[K]) => void;
  register: (name: keyof T & string) => FieldProps;
  reset: (next?: Partial<T>) => void;
  handleSubmit: (onValid: (values: T) => void) => (event?: FormEvent) => void;
}

/** hook form dùng chung: tự lo values, lỗi, touched */
export function useForm<T extends FormValues>(
  initialValues: T,
  validate?: Validator<T>
): UseFormResult<T> {
  const initialRef = useRef<T>(initialValues);
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<TouchedMap<T>>({});
  const [submitted, setSubmitted] = useState(false);

  const allErrors = useMemo<FormErrors<T>>(
    () => (validate ? validate(values) : {}),
    [validate, values]
  );

  const isValid = useMemo(() => Object.values(allErrors).every((msg) => !msg), [allErrors]);

  // chỉ hiện lỗi khi đã rời ô nhập hoặc đã bấm submit
  const errors = useMemo<FormErrors<T>>(() => {
    if (submitted) return allErrors;
    const visible: FormErrors<T> = {};
    (Object.keys(allErrors) as Array<keyof T>).forEach((key) => {
      if (touched[key]) visible[key] = allErrors[key];
    });
    return visible;
  }, [allErrors, submitted, touched]);

  const setField = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const register = useCallback(
    (name: keyof T & string): FieldProps => ({
      name,
      value: values[name],
      onChange: (event) => {
        const next = event.target.value as T[typeof name];
        setValues((prev) => ({ ...prev, [name]: next }));
      },
      onBlur: () => setTouched((prev) => ({ ...prev, [name]: true })),
    }),
    [values]
  );

  const reset = useCallback((next?: Partial<T>) => {
    const base = { ...initialRef.current, ...next };
    initialRef.current = base;
    setValues(base);
    setTouched({});
    setSubmitted(false);
  }, []);

  const handleSubmit = useCallback(
    (onValid: (values: T) => void) => (event?: FormEvent) => {
      event?.preventDefault();
      setSubmitted(true);

      const current = validate ? validate(values) : {};
      if (Object.values(current).some(Boolean)) return;

      onValid(values);
    },
    [validate, values]
  );

  return { values, errors, touched, isValid, setField, register, reset, handleSubmit };
}
