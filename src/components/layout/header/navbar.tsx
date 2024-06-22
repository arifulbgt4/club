"use client";

import { type User, type Session } from "lucia";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Icons from "~/components/shared/icons";
import LogoutButton from "~/components/shared/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { cn } from "~/lib/utils";
export default function Navbar({
  session,
  user,
  headerText,
}: {
  user: User;
  session: Session;
  headerText: {
    changelog: string;
    about: string;
    login: string;
    dashboard: string;
    [key: string]: string;
  };
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  return (
    <nav className="flex h-full items-center justify-between">
      <Link href="/" className="flex items-center text-2xl font-bold">
        <Image
          src="/logo.png"
          alt="Otask logo"
          width="24"
          height="24"
          className=" rounded-sm object-contain"
        />
        <p className="text-xl font-bold  italic">Task</p>
      </Link>
      <div className="hidden items-center gap-12 lg:flex 2xl:gap-16">
        <div className="space-x-4 text-center text-sm leading-loose text-muted-foreground md:text-left">
          <Link
            href="/changelog"
            className="font-semibold hover:underline hover:underline-offset-4"
          >
            {headerText.changelog}
          </Link>
          <Link
            href="/about"
            className="font-semibold hover:underline hover:underline-offset-4"
          >
            {headerText.about}
          </Link>
        </div>
        <div className="flex items-center gap-x-2">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.picture} alt="@shadcn" />
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">shadcn</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      m@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className=" cursor-pointer"
                    onClick={() => router.push("/repo")}
                  >
                    {/* <Icons.projectPlus className="mr-2 h-4 w-4" /> */}
                    <span>Repository</span>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className=" cursor-pointer"
                    onClick={() => router.push("/task")}
                  >
                    {/* <Icons.projectPlus className="mr-2 h-4 w-4" /> */}
                    <span>Task</span>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className=" cursor-pointer"
                    onClick={() => router.push("/billing")}
                  >
                    {/* <Icons.projectPlus className="mr-2 h-4 w-4" /> */}
                    <span>Billing</span>
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className=" cursor-pointer"
                    onClick={() => router.push("/settings")}
                  >
                    {/* <Icons.projectPlus className="mr-2 h-4 w-4" /> */}
                    <span>Settings</span>
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem> */}
                <LogoutButton className=" flex-1" />
                {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
                {/* </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // <Link
            //   href=""
            //   className={cn(
            //     buttonVariants({ variant: "outline" }),
            //     "bg-secondary"
            //   )}
            //   onClick={() => setIsModalOpen(false)}
            // >
            //   {headerText.dashboard}
            // </Link>
            <Link href="/login" className={buttonVariants()}>
              {headerText.login}
            </Link>
          )}
        </div>
      </div>
      <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
        <SheetTrigger className="lg:hidden">
          <span className="sr-only">Open Menu</span>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent>
          <div className="flex flex-col items-center space-y-10 py-10">
            <div className="space-y-4 text-center text-sm leading-loose text-muted-foreground">
              <Link
                href="/changelog"
                className="block font-semibold hover:underline hover:underline-offset-4"
                onClick={() => setIsModalOpen(false)}
              >
                {headerText.changelog}
              </Link>
              <Link
                href="/about"
                className="block font-semibold hover:underline hover:underline-offset-4"
                onClick={() => setIsModalOpen(false)}
              >
                {headerText.about}
              </Link>
              {session ? (
                <>
                  <Link
                    href=""
                    className="block font-semibold hover:underline hover:underline-offset-4"
                    onClick={() => setIsModalOpen(false)}
                  >
                    {headerText.dashboard}
                  </Link>
                  <LogoutButton className=" !mt-20" />
                </>
              ) : (
                <Link
                  href="/login"
                  className={buttonVariants()}
                  onClick={() => setIsModalOpen(false)}
                >
                  {headerText.login}
                </Link>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
