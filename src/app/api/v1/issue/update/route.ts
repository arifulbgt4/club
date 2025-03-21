import { IntentType } from "@prisma/client";
import { siteConfig } from "~/config/site";
import db from "~/lib/db";
import { redirectError } from "~/lib/utils";
import { octokit, validateRequest } from "~/server/auth";

export async function PUT(req: Request) {
  const body = await req.json();
  try {
    const { user, session } = await validateRequest();
    if (!session || !body?.issueNumber || !body?.type) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (
      body?.type === IntentType.paid &&
      body?.price < siteConfig().minimumAmount
    ) {
      return new Response(
        `Price required minimum $${siteConfig().minimumAmount}`,
        { status: 401 }
      );
    }

    if (body?.topics?.length > 10 || !body?.topics?.length) {
      return new Response("An issue can have a maximum of 9 topics", {
        status: 401,
      });
    }

    const repo = await db.repository.findUnique({
      where: { id: body.repoId, userId: user?.id },
      include: { provider: true },
    });

    if (!repo) {
      return new Response("Unauthorized", { status: 401 });
    }

    const octo = await octokit();
    const issue = await octo.request(
      "GET /repos/{owner}/{repo}/issues/{issue_number}",
      {
        owner: repo?.provider?.name,
        repo: repo?.name,
        issue_number: Number(body?.issueNumber),
      }
    );

    const update = await db.issue.update({
      where: {
        id: String(issue?.data?.id),
        userId: user?.id,
      },
      data: {
        title: issue?.data?.title,
        topics: [...body?.topics],
      },
      include: {
        intent: {
          where: { active: true },
        },
      },
    });

    if (
      body?.type !== update.intent[0]?.type ||
      body?.price !== update.intent[0]?.price
    ) {
      await db.request.deleteMany({ where: { issueId: update?.id } });
      await db.intent.updateMany({
        where: {
          active: true,
          issueId: update?.id,
        },
        data: {
          type: body.type as IntentType,
          price: body?.price ?? null,
        },
      });
    }

    return new Response(JSON.stringify(update), { status: 200 });
  } catch (error) {
    redirectError(error);
    return new Response(null, {
      status: 500,
    });
  }
}
