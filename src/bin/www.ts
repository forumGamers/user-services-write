import { config } from "dotenv";

config();

import app from "..";
import Broker from "../broker";

(async function () {
  try {
    const broker = new Broker();
    await broker.connect();
    await broker.declareExchangeAndQueue();

    const port = process.env.PORT ?? 3001;

    app.listen(port, () => console.log(`app listening on port ${port}`));
  } catch (err) {
    //send email
    throw err;
  }
})();
