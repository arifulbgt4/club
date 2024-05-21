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

  try {
    switch (eventType) {
      case "github_app_authorization":
        if (action === "revoked") {
          await db.user.update({
            where: {
              githubId: sender.id,
            },
            data: {
              activate: false,
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
                active: false,
              },
            });
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
