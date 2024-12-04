import subscribers from "data/subscriberData.json";
import ProfileCard, { DummyCard } from "./profile_card";
export default function FeaturedProfiles() {
  return (
    <>
      <h3 className="text-l my-2 md:text-xl lg:text-2xl">Featured Profiles</h3>
      <div className="grid grid-cols-1 gap-3	lg:grid-cols-3">
        {subscribers.map((subscriber) => (
          <ProfileCard subscriber={subscriber} />
        ))}
        <DummyCard />
      </div>
    </>
  );
}
