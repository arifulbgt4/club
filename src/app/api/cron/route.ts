import db from "~/lib/db";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    console.log("Cron job start");
    console.log("Cron job end");
    await db.user.create({
      data: {
        name: "cron",
      },
    });
    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
