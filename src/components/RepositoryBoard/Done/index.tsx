import EmptyState from "~/components/shared/empty-state";
import { getDone } from "../action";
import Pagination from "~/components/sections/pagination";
import { formatDistanceToNow } from "date-fns";
import { IntentType } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Icons from "~/components/shared/icons";

const Done = async ({
  p,
  b,
  total,
  repoId,
}: {
  p: number;
  b: string;
  total: number;
  repoId: string;
}) => {
  const data = await getDone(repoId, p);
  if (!data || !data?.intents?.length) {
    return <EmptyState title="No issues completed yet" />;
  }
  const { intents, take, page } = data;

  const totalPages = Math.ceil(total / take);

  return (
    <>
      <div className="max-h-[calc(100vh-279px)] overflow-scroll ">
        <div className="min-h-[calc(100vh-279px)] pt-3">
          <div className=" flex flex-col gap-3">
            {intents?.map((intent) => (
              <div
                key={intent?.id}
                className="flex flex-col items-start rounded-lg border p-4 hover:bg-accent"
              >
                <div className="flex w-full flex-col">
                  <div className="mb-1 flex items-center">
                    <div className="mb-0.5 flex flex-col">
                      <div className="text-xs text-muted-foreground">
                        #{intent?.issue?.issueNumber} {" • "} completed{" "}
                        {formatDistanceToNow(new Date(intent?.updatedAt), {
                          addSuffix: true,
                          includeSeconds: true,
                        })}
                      </div>
                      <span className=" text-xl font-semibold">
                        {intent?.issue?.title}
                      </span>
                    </div>
                    <div className="ml-auto font-mono font-semibold tracking-wide">
                      {intent?.type === IntentType.paid ? (
                        `$${intent?.price?.toFixed(2)}`
                      ) : (
                        <span className="font-normal tracking-normal">
                          open-source
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {intent?.issue?.topics?.length ? (
                  <div className=" my-1 flex flex-wrap gap-1">
                    {intent?.issue?.topics?.map((t, i) => (
                      <span
                        key={i}
                        className=" rounded bg-accent px-2 py-0.5 text-sm font-medium text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  ""
                )}
                <div className="mt-2 flex items-center gap-1.5">
                  <Avatar className="h-6 w-6 border border-black">
                    <AvatarImage
                      src={intent?.request?.user?.picture as string}
                      title={intent?.request?.user?.username as string}
                    />
                    <AvatarFallback>
                      <Icons.spinner className=" animate-spin" />
                    </AvatarFallback>
                  </Avatar>
                  <span className=" font-semibold">
                    {intent?.request?.user?.username}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        more={`?b=${b}`}
        justify="start"
      />
    </>
  );
};

export default Done;
