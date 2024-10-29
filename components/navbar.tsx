import Image from "next/image";
import logo from "public/logo_512px.png";
export default function Navbar() {
  return (
    <nav className="flex h-20 items-center justify-center bg-background-secondary shadow-2xl">
      <div className="flex flex-row items-center">
        <Image className="h-16 w-auto" src={logo} alt="Hugfairy Logo" />
        <h1 className="text-bold text-3xl text-foreground-primary">Hugfairy</h1>
      </div>
    </nav>
  );
}
