import { NextResponse } from "next/server";
import { app } from "~/lib/octokit";
import { validateRequest } from "~/server/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repo = searchParams.get("repo");
  try {
    const { user } = await validateRequest();
    const octo = await app.getInstallationOctokit(Number(user?.installId));

    const issues = await octo.request("GET /repos/{owner}/{repo}/issues", {
      owner: user?.username as string,
      repo: repo as string,
      state: "open",
      sort: "updated",
      headers: {
        authorization: `token ${user?.accessToken}`,
      },
    });
    return NextResponse.json(issues);
  } catch (error) {
    console.log(error);
    return new Response(null, { status: 500 });
  }
}
