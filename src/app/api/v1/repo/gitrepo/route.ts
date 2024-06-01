import { NextResponse } from "next/server";
import { app } from "~/lib/octokit";
import { validateRequest } from "~/server/auth";

export async function GET(req: Request) {
  try {
    const { user } = await validateRequest();
    const octo = await app.getInstallationOctokit(Number(user?.installId));
    const repo = await octo.request("GET /installation/repositories", {
      per_page: 100,
      page: 1,
      headers: {
        authorization: `token ${user?.accessToken}`,
      },
    });

    if (repo.data.total_count <= 100) {
      return repo.data.repositories;
    }
    const getval = [...repo.data.repositories];
    for (
      let index = 1;
      index < Math.ceil(repo.data.total_count / 100);
      index++
    ) {
      const a = await octo.request("GET /installation/repositories", {
        per_page: 100,
        page: 1 + index,
        headers: {
          authorization: `token ${user?.accessToken}`,
        },
      });
      getval.push(...a.data.repositories);
    }
    return NextResponse.json(getval.reverse());
  } catch (error) {
    console.log(error);
    return new Response(null, { status: 500 });
  }
}
