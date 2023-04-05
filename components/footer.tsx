export default function Footer() {
  return (
    <footer className="h-100 md:text-l fixed bottom-0 mb-2 w-screen bg-background-secondary px-6 text-center text-sm text-foreground-primary lg:text-xl">
      Made by{" "}
      <a
        href="https://haideralipunjabi.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Haider Ali Punjabi
      </a>{" "}
      (
      <a
        href="https://bsky.app/profile/haider.bsky.social"
        target="_blank"
        rel="noopener noreferrer"
      >
        haider.bsky.social
      </a>
      ) | Source code on{" "}
      <a
        href="https://github.com/haideralipunjabi/bluesky-hugfairy"
        target="_blank"
        rel="noopener noreferrer"
      >
        Github
      </a>
    </footer>
  );
}
