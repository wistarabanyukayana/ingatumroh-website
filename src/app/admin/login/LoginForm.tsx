"use client";

import { useActionState } from "react";

import { login } from "@/actions/auth";
import {
  Field,
  inputClass,
  StatusMessage,
  SubmitButton,
} from "@/components/admin/ui";

export function LoginForm() {
  const [state, action] = useActionState(login, null);

  return (
    <form action={action} className="space-y-4">
      <StatusMessage state={state} />
      <Field label="Email" name="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </Field>
      <Field label="Kata sandi" name="password">
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </Field>
      <SubmitButton>Masuk</SubmitButton>
    </form>
  );
}
