import {version as v} from "../../../package.json";


export const index = {
  binaryName: "appie",
  version: v,
};

export const version = () => {
  return `${index.binaryName} v${index.version}`;
}
