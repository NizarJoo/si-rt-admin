import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Link
        href="/login"
        className={buttonVariants({ variant: "default" })}
      >
        Gas Login
      </Link>
    </div>
  );
}
