import express from "express";
const app = express();
const port = 3000;

export const init = async () => {
  app.get("/", (req: any, res: any) => {
    res.send("Hello World!");
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

