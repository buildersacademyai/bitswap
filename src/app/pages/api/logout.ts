import { withSessionRoute } from "@/utils/session";
import type { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(async (req: NextApiRequest, res: NextApiResponse) => {
  req.session.destroy();
  res.redirect("/");
});
