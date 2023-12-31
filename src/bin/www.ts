import { config } from "dotenv";

config();

import app from "..";
import broker from "../broker";

(async function () {
  try {
    await broker.connect();
    await broker.declareExchangeAndQueue();

    const port = process.env.PORT ?? 3001;

    app.listen(port, () => console.log(`app listening on port ${port}`));
  } catch (err) {
    //send email
    throw err;
  }
})();
