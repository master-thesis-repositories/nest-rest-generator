"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = exports.index = void 0;
const package_json_1 = require("../../../package.json");
exports.index = {
    binaryName: "appie",
    version: package_json_1.version,
};
const version = () => {
    return `${exports.index.binaryName} v${exports.index.version}`;
};
exports.version = version;
