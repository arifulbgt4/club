import { Power } from "lucide-react";
import { logout } from "~/server/auth";
import { Button } from "../ui/button";

export default function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logout} className={className}>
      <Button
        type="submit"
        size="sm"
        variant="ghost"
        className="w-full justify-start"
      >
        <Power className="mr-2 h-4 w-4 text-destructive" />
        <span>Log out</span>
      </Button>
    </form>
  );
}
