"use client";
import { useState } from "react";
import { ErrorAlert, SuccessAlert } from "./alert";
export default function HugsForm({ name }: { name?: string }) {
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setError(undefined);
    setSuccess(undefined);
    const data = {
      identifier: event.currentTarget.identifier.value,
      anonymous: event.currentTarget.anonymous.checked,
    };
    const response = await fetch("/hug", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(response);
    if (response.status != 200) {
      setError((await response.json())["error"]);
    } else {
      setSuccess((await response.json())["success"]);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-y-2"
      >
        <div className="flex flex-col">
          <label className="md:text-l text-sm lg:text-xl" htmlFor="identifier">
            Enter BlueSky user to hug:{" "}
          </label>
          <input
            className="text-l rounded border-none p-2 text-black md:text-xl lg:text-2xl"
            type="text"
            name="identifier"
            id="identifier"
          />
        </div>
        <div className="flex items-center justify-center">
          <input
            className="mx-2"
            name="anonymous"
            id="anonymous"
            type="checkbox"
          />
          <label htmlFor="anonymous" className="md:text-l text-sm lg:text-xl">
            Hug Anonymously
          </label>
        </div>

        {error && <ErrorAlert>{error}</ErrorAlert>}
        {success && <SuccessAlert>{success}</SuccessAlert>}
        <input
          className="w-full rounded bg-accent-primary p-2 hover:cursor-pointer hover:bg-accent-secondary	"
          type="submit"
          value="Hug"
        />
        {name && (
          <>
            <span>
              Logged in as {name}.(<a href="/logout">Logout?</a>)
            </span>
          </>
        )}
      </form>
    </>
  );
}
