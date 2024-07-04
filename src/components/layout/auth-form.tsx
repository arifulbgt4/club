"use client";
import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import Icons from "../shared/icons";

export default function AuthForm() {
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const handleClick = async () => {
    setIsGithubLoading(true);
    const res = await fetch("/api/auth/login/github");
    const url = await res.json();
    const width = 800;
    const height = 600;
    const left = window.screen.width / 2 - width / 3;
    const top = window.screen.height / 2 - height / 2;
    const newWindow = window.open(
      url,
      "GitHubAuth",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    if (!!newWindow) {
      newWindow.focus();
    } else {
      window.location.href = url;
    }
  };

  return (
    <div className={cn("mt-4 flex flex-col gap-4")}>
      {isGithubLoading ? (
        <Button className=" w-full cursor-not-allowed" variant="outline">
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        </Button>
      ) : (
        <Link
          href=""
          className={cn(
            buttonVariants({ variant: "outline" }),
            "hover:bg-accent-foreground hover:text-accent"
          )}
          onClick={handleClick}
        >
          Continue with <Icons.gitHub className="ml-2 h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
