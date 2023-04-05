"use client";
import { useState } from "react";
import { setCookies } from "../utils/cookies";
import { ErrorAlert } from "./alert";

export default function LoginForm() {
  const AUTH_URL = "https://bsky.social/xrpc/com.atproto.server.createSession";
  const [error, setError] = useState<ErrorResponse>();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(undefined);
    const data = {
      identifier: event.currentTarget.identifier.value,
      password: event.currentTarget.password.value,
    };
    const response = await fetch(AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.status != 200) {
      setError(await response.json());
    } else {
      setCookies(await response.json());
      window.location.reload();
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center gap-y-2"
    >
      <div className="flex flex-col">
        <label className="md:text-l text-sm lg:text-xl" htmlFor="identifier">
          Handle:
        </label>
        <input
          className="md:text-l rounded border-none p-2 text-sm text-black lg:text-xl"
          type="text"
          name="identifier"
          id="identifier"
        />
      </div>
      <div className="flex flex-col">
        <label className="md:text-l text-sm lg:text-xl" htmlFor="password">
          Password:{" "}
        </label>
        <input
          className="md:text-l rounded border-none p-2 text-sm text-black lg:text-xl"
          name="password"
          id="password"
          type="password"
        />
      </div>
      {error && (
        <ErrorAlert>
          {error.error}:{error.message}
        </ErrorAlert>
      )}
      <input
        className="w-full rounded bg-accent-primary p-2 hover:cursor-pointer hover:bg-accent-secondary	"
        type="submit"
        value="Login"
      />
    </form>
  );
}
