import { withSessionRoute } from "@/utils/session";
import type { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { userSession } = req.body;
    req.session.user = userSession;
    await req.session.save();
    res.json({ message: "Authenticated" });
  } else if (req.method === "GET") {
    res.json({ user: req.session.user || null });
  } else {
    res.status(405).end();
  }
});
