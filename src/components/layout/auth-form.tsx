"use client";
import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import Icons from "../shared/icons";

export default function AuthForm() {
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  return (
    <div className={cn("mt-4 flex flex-col gap-4")}>
      {isGithubLoading ? (
        <Button className=" w-full cursor-not-allowed" variant="outline">
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        </Button>
      ) : (
        <Link
          href="/api/auth/login/github"
          className={cn(buttonVariants({ variant: "outline" }))}
          onClick={() => setIsGithubLoading(true)}
        >
          Continue with <Icons.gitHub className="ml-2 h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
