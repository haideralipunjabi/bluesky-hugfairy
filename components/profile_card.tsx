import Link from "next/link";
import Image from "next/image";

export default function ProfileCard({
  subscriber,
}: {
  subscriber: Subscriber;
}) {
  return (
    <div className="flex max-w-96 flex-col gap-y-2 rounded border border-accent-primary p-4 drop-shadow">
      <div className="flex flex-row gap-x-2">
        <Image
          className="rounded-full"
          src={subscriber.avatar}
          alt="Profile Image"
          width={48}
          height={48}
        />
        <div>
          <h3 className="text-lg">{subscriber.name}</h3>
          <h4>{subscriber.handle}</h4>
        </div>
      </div>
      <div className="grow">
        <p className="line-clamp-4">{subscriber.description}</p>
      </div>
      <Link
        href={`https://bsky.app/profile/${subscriber.handle}`}
        target="_blank"
      >
        <button className="w-full rounded bg-accent-primary p-2 text-center text-foreground-primary hover:cursor-pointer hover:bg-accent-secondary">
          View Profile
        </button>
      </Link>
    </div>
  );
}

export function DummyCard() {
  return (
    <div className="flex max-w-96 flex-col gap-y-2 rounded border border-accent-primary p-4 drop-shadow">
      <div className="flex flex-row gap-x-2">
        <div>
          <h3 className="text-lg">Want to be here?</h3>
        </div>
      </div>
      <div className="grow">
        <p className="line-clamp-4">
          Get your profile featured for just $59.99 per month.
        </p>
      </div>
      <Link
        href={"https://haideralipunjabi.gumroad.com/l/ntlwk"}
        target="_blank"
      >
        <button className="w-full rounded bg-accent-primary p-2 text-center text-foreground-primary hover:cursor-pointer hover:bg-accent-secondary">
          Buy spot!
        </button>
      </Link>
    </div>
  );
}
