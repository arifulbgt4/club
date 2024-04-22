import { headers } from "next/headers";
import { type NextRequest } from "next/server";
import { buffer } from "node:stream/consumers";

export async function POST(req: NextRequest) {
  //@ts-expect-error Argument of type 'ReadableStream<any>' is not assignable to parameter of type 'ReadableStream | Readable | AsyncIterable<any>'
  const body = await buffer(req.body);

  console.log("body: ", req.body);

  return new Response(null, { status: 200 });
}
