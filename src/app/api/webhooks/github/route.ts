import { IssueState, IssueStatus } from "@prisma/client";
import { headers } from "next/headers";
import { type NextRequest } from "next/server";
import db from "~/lib/db";
import { acceptPullRequest, addRemoveCollaborator } from "~/lib/githubWebhooks";

export async function POST(req: NextRequest) {
  // * webhooks event type
  // * Example: installation, issue
  const eventType: string = headers().get("x-github-event") as string;
  // * webhooks data of the above ☝️ event data & action
  // * action ex: create, delete
  // * data ex: id, sender, requester ...
  const data = await req.json();
  // console.log("data: ", data);
  // * ☝️ create, delete
  const action = data.action;
  // * ☝️ id, sender, requester ...
  const eventData = data[eventType];
  const sender = data.sender;

  console.log("eventType: ", eventType);
  console.log("data: ", data);

  try {
    switch (eventType) {
      case "github_app_authorization":
        if (action === "revoked") {
          await db.user.update({
            where: {
              githubId: String(sender.id),
            },
            data: {
              active: false,
            },
          });
        }
        break;
      case "installation":
        if (action === "deleted") {
          try {
            await db.provider.update({
              where: { installationId: Number(eventData?.id) },
              data: {
                active: false,
              },
            });
          } catch (error) {
            new Response("Provider not found", { status: 401 });
          }
        }
        break;
      case "pull_request":
        if (action === "closed") {
          const issue = await db.issue.findFirst({
            where: {
              state: {
                not: {
                  in: [IssueState.published, IssueState.draft],
                },
              },
              repository: {
                fullName: data?.repository?.full_name,
              },
              intent: {
                some: {
                  pr_number: data?.pull_request?.number,
                },
              },
            },
            include: {
              repository: true,
              intent: {
                include: {
                  request: true,
                },
              },
            },
          });
          if (!issue || !issue?.intent?.length) break;
          const intent = issue?.intent[0];
          const queue = await db.intent.findMany({
            where: {
              issue: { status: IssueStatus.queue },
              request: {
                userId: intent?.request?.userId,
              },
            },
            orderBy: { updatedAt: "asc" },
          });
          if (eventData?.merged) {
            await acceptPullRequest(intent);
          }
          if (!eventData?.merged) {
            const completedIntent = await db.intent.update({
              where: {
                id: intent?.id,
              },
              data: {
                active: false,
                success: false,
                issue: {
                  update: {
                    state: IssueState.draft,
                    status: IssueStatus.default,
                  },
                },
                request: {
                  update: {
                    user: {
                      update: {
                        available: true,
                      },
                    },
                  },
                },
              },
            });
            await db.request.update({
              where: { id: completedIntent?.requestId as string },
              data: {
                issueId: null,
              },
            });

            await db.intent.create({
              data: {
                type: intent?.type,
                // * Always set price null when move to draft
                price: null,
                issue: {
                  connect: {
                    id: issue?.id,
                  },
                },
              },
            });
          }

          if (!!queue?.length) {
            await db.intent.update({
              where: {
                id: queue[0]?.id,
                active: true,
              },
              data: {
                issue: {
                  update: {
                    status: IssueStatus.default,
                  },
                },
                request: {
                  update: {
                    user: {
                      update: {
                        available: false,
                      },
                    },
                  },
                },
              },
            });
          }
        }
        break;
      case "pull_request_review":
        if (action === "submitted") {
          const reviewData = data?.review;
          const issue = await db.issue.findFirst({
            where: {
              repository: {
                fullName: data?.repository?.full_name,
              },
              intent: {
                some: {
                  pr_number: data?.pull_request?.number,
                },
              },
              state: {
                in: [
                  IssueState.inreview,
                  IssueState.inprogress,
                  IssueState.reassign,
                ],
              },
            },
            include: {
              repository: true,
              intent: {
                include: {
                  request: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          available: true,
                        },
                      },
                    },
                  },
                  issue: true,
                },
              },
            },
          });
          if (!issue || !issue?.intent?.length) break;
          const intent = issue?.intent[0];

          if (
            (reviewData.state === "changes_requested" ||
              reviewData.state === "commented") &&
            issue?.state === IssueState.inreview &&
            data?.pull_request?.state !== "closed"
          ) {
            const userIsAvailable = intent?.request?.user?.available;
            await db.intent.update({
              where: {
                id: intent?.id,
                issueId: issue?.id,
              },
              data: {
                issue: {
                  update: {
                    state: IssueState.reassign,
                    ...(!userIsAvailable && { status: IssueStatus.queue }),
                  },
                },
                request: {
                  update: {
                    user: {
                      update: {
                        ...(userIsAvailable && { available: false }),
                      },
                    },
                  },
                },
              },
            });
            break;
          }
          if (reviewData.state === "approved") {
            const queue = await db.intent.findMany({
              where: {
                issue: { status: IssueStatus.queue },
                request: {
                  userId: intent?.request?.userId,
                },
              },
              orderBy: { updatedAt: "asc" },
            });

            await acceptPullRequest(intent);

            if (!!queue?.length) {
              await db.intent.update({
                where: {
                  id: queue[0]?.id,
                  active: true,
                },
                data: {
                  issue: {
                    update: {
                      status: IssueStatus.default,
                    },
                  },
                  request: {
                    update: {
                      user: {
                        update: {
                          available: false,
                        },
                      },
                    },
                  },
                },
              });
            }
            break;
          }
        }
        break;
      case "member":
        const repoId = data?.repository?.id;
        const memberGithubId = data?.member?.id;
        const memberUsername = data?.member?.login;
        const senderGithubId = data?.sender?.id;
        const senderGithubUsername = data?.sender?.login;

        await addRemoveCollaborator(
          action,
          repoId,
          memberGithubId,
          memberUsername,
          senderGithubId,
          senderGithubUsername
        );

        break;
      case "installation_repositories":
        if (data?.action === "removed") {
          const repositories_removed = data?.repositories_removed[0];
          await db.repository.update({
            where: {
              id: String(repositories_removed?.id),
              active: true,
              fullName: repositories_removed?.full_name,
            },
            data: {
              active: false,
              delete: true,
            },
          });
        }
        break;
      default:
        console.log("Alert! Comming Unknown github webhook event.");
    }
  } catch (error) {
    console.log(error);
  }

  return new Response(null, { status: 200 });
}
