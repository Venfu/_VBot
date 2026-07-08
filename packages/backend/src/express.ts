import express from "express";
const app = express();
const port = 3000;

export interface IExpress {
  addConfig: () => void;
  addFragment: () => void;
  addApi: () => void;
}

const addConfig = () => {
  console.log("addConfig Called");
};
const addFragment = () => {
  console.log("addFragment Called");
};
const addApi = () => {
  console.log("addApi Called");
};

const iExpress: IExpress = {
  addConfig: addConfig,
  addFragment: addFragment,
  addApi: addApi,
};

export const init: () => Promise<IExpress> = async () => {
  app.get("/", (req: any, res: any) => {
    res.send("Hello World!");
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

  return iExpress;
};
