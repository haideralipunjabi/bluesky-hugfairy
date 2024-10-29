export default function LoginForm() {
  return (
    <form
      action="/login"
      method="GET"
      className="flex flex-col items-center justify-center gap-y-2"
    >
      <div className="flex flex-col">
        <input
          className="text-l rounded border-none p-2 text-black md:text-xl lg:text-2xl"
          type="text"
          name="identifier"
          placeholder="Username"
          id="identifier"
        />
      </div>
      <input
        className="w-full rounded bg-accent-primary p-2 text-center text-foreground-primary hover:cursor-pointer hover:bg-accent-secondary"
        type="submit"
        value="Login"
      />
    </form>
  );
}
