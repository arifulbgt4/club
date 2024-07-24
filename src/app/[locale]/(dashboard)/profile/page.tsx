import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { octokit, validateRequest } from "~/server/auth";
import { Button } from "~/components/ui/button";
import Markdown from "~/components/sections/Markdown";

export default async function ProfilePage() {
  const { user } = await validateRequest();
  const octo = await octokit();
  const { data } = await octo.request("GET /users/{username}", {
    username: user?.username as string,
  });

  const readme = async () => {
    try {
      const res = await octo.request("GET /repos/{owner}/{repo}/readme", {
        owner: user?.username as string,
        repo: user?.username as string,
        headers: {
          accept: "application/vnd.github.html+json",
        },
      });
      return res?.data;
    } catch (error) {
      return null;
    }
  };

  const readMe = await readme();

  return (
    <div className="container flex max-w-[900px] flex-1 flex-col items-center justify-center px-5 pb-10">
      <Avatar className=" mb-4 h-36  w-36 border-4">
        <AvatarImage src={data?.avatar_url} />
      </Avatar>
      <span className=" text-2xl ">{data?.name}</span>
      <span className=" mb-4  text-sm font-semibold text-muted-foreground">
        @{data?.login}
      </span>
      <div className="mb-1 flex">
        <Badge variant="secondary">{data?.followers} Followers</Badge>
        <Badge variant="secondary" className="ml-2">
          {data?.following} Following
        </Badge>
      </div>

      <div className="max-w-[600px] p-3 text-center">
        <span>{data?.bio || "No bio"}</span>
      </div>

      <div className="mt-3">
        {readMe ? (
          <Markdown body={readMe} />
        ) : (
          <div className="flex flex-col">
            <span className=" my-3 text-sm">
              Not founded{" "}
              <span className=" text-lg font-medium italic">
                {data?.login}/README.md
              </span>{" "}
              on your github profile
            </span>
            <div className="flex  justify-center">
              <Button variant="secondary">Create README.md </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
