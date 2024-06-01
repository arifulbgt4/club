import { NextResponse } from "next/server";
import { app } from "~/lib/octokit";
import { validateRequest } from "~/server/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const octo = await app.getInstallationOctokit(Number(user.installId));
    const perPage = 100;
    const initialResponse = await octo.request(
      "GET /installation/repositories",
      {
        per_page: perPage,
        page: 1,
        headers: {
          authorization: `token ${user.accessToken}`,
        },
      }
    );

    let repositories = initialResponse.data.repositories;
    const totalRepos = initialResponse.data.total_count;

    if (totalRepos > perPage) {
      const totalPages = Math.ceil(totalRepos / perPage);
      const fetchPromises = [];

      for (let page = 2; page <= totalPages; page++) {
        fetchPromises.push(
          octo.request("GET /installation/repositories", {
            per_page: perPage,
            page: page,
            headers: {
              authorization: `token ${user.accessToken}`,
            },
          })
        );
      }

      const responses = await Promise.all(fetchPromises);
      responses.forEach((response) => {
        repositories = repositories.concat(response.data.repositories);
      });
    }

    return NextResponse.json(repositories.reverse());
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
