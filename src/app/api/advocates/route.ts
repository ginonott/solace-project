import { ilike, or } from "drizzle-orm";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { NextApiRequest } from "next";

export async function GET(req: NextApiRequest) {
  let searchTerm: string | null = null;
  const url = new URL(req.url!);

  if (url.searchParams.has('search')) {
    searchTerm = url.searchParams.get('search');
    if (Array.isArray(searchTerm)) {
      return Response.json({error: 'search must be a string'}, {status: 400});
    }
  }

  let data;
  if (searchTerm) {
    data = await db.select().from(advocates).where(or(
      ilike(advocates.firstName, `%${searchTerm}%`),
      ilike(advocates.lastName, `%${searchTerm}%`),
      ilike(advocates.city, `%${searchTerm}%`),
      ilike(advocates.degree, `%${searchTerm}%`),
      // TODO: support specialities, yoe, and phone numbers
    ));
  } else {
    data = await db.select().from(advocates)
  }

  return Response.json({ data });
}
