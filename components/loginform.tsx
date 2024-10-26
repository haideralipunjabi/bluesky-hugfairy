"use client";
export default function LoginForm() {
  return (
    <button onClick={() => {
      // client.signIn(
      //   'haider.bsky.social'
      // )
    }}>
      Test
    </button>
    // <form
    //   onSubmit={ }
    //   className="flex flex-col justify-center gap-y-2"
    // >
    //   <div className="flex flex-col">
    //     <label className="md:text-l text-sm lg:text-xl" htmlFor="identifier">
    //       Handle:
    //     </label>
    //     <input
    //       className="md:text-l rounded border-none p-2 text-sm text-black lg:text-xl"
    //       type="text"
    //       name="identifier"
    //       id="identifier"
    //     />
    //   </div>
    //   <div className="flex flex-col">
    //     <label className="md:text-l text-sm lg:text-xl" htmlFor="password">
    //       Password:{" "}
    //     </label>
    //     <input
    //       className="md:text-l rounded border-none p-2 text-sm text-black lg:text-xl"
    //       name="password"
    //       id="password"
    //       type="password"
    //     />
    //   </div>
    //   {error && (
    //     <ErrorAlert>
    //       {error.error}:{error.message}
    //     </ErrorAlert>
    //   )}
    //   <input
    //     className="w-full rounded bg-accent-primary p-2 hover:cursor-pointer hover:bg-accent-secondary	"
    //     type="submit"
    //     value="Login"
    //   />
    // </form>
  );
}
