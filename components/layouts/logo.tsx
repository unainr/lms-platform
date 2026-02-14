import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 invert-25 ">
      <Image
        src="/next.svg" // or your public path
        alt="nextjs Logo"
        width={120}
        height={50}
        priority
      />
    </Link>
  );
};

export default Logo;