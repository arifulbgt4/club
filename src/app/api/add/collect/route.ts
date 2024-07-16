export async function GET(req: Request) {
  try {
    console.log("Cron job start");
    console.log("Cron job end");
    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
