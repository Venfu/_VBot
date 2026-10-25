import express from "express";
export const app = express();

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

export const init: (port: number | unknown) => Promise<IExpress> = async (
  port: number | unknown = 3000,
) => {
  app.get("/", (req: any, res: any) => {
    res.send("Hello World!");
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

  return iExpress;
};
