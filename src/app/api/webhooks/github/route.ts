import { IssueState, IssueStatus } from "@prisma/client";
import { headers } from "next/headers";
import { type NextRequest } from "next/server";
import db from "~/lib/db";

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

  console.log("first: ", eventType);
  console.log("first: ", data);

  try {
    switch (eventType) {
      case "github_app_authorization":
        if (action === "revoked") {
          await db.user.update({
            where: {
              githubId: sender.id,
            },
            data: {
              active: false,
            },
          });
        }

        break;
      case "installation":
        if (action === "deleted") {
          if (eventData.account.type === "User") {
            await db.user.update({
              where: {
                githubId: sender.id,
              },
              data: {
                accessToken: null,
                installId: null,
                active: false,
              },
            });
          }

          if (eventData.account.type === "Organization") {
            const org = await db.organization.findFirst({
              where: { name: eventData.account.login },
            });
            await db.organization.update({
              where: { id: org?.id, name: eventData.account.login },
              data: {
                token: null,
                installId: null,
                active: false,
              },
            });
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
            await db.intent.update({
              where: {
                id: intent?.id,
              },
              data: {
                active: false,
                success: true,
                issue: {
                  update: {
                    state: undefined,
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
          }
          if (!eventData?.merged) {
            await db.intent.update({
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
            await db.intent.create({
              data: {
                type: intent?.type,
                price: intent?.price,
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
                },
              },
            },
          });
          if (!issue || !issue?.intent?.length) break;
          const intent = issue?.intent[0];

          if (
            (reviewData.state === "changes_requested" ||
              reviewData.state === "commented") &&
            issue?.state === IssueState.inreview
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

            await db.intent.update({
              where: {
                id: intent?.id,
              },
              data: {
                active: false,
                success: true,
                issue: {
                  update: {
                    state: undefined,
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
      default:
        console.log("Alert! Comming Unknown github webhook event.");
    }
  } catch (error) {
    console.log(error);
  }

  return new Response(null, { status: 200 });
}
