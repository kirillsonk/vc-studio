import { routeRequest } from "../../../../server/node-runtime";

// The node.ts page extension is enabled only by NEXT_STANDALONE=1.
// Static Sites builds do not discover this server route.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = (request: Request) => routeRequest(request);
export const POST = GET;
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
export const OPTIONS = GET;
export const HEAD = GET;
