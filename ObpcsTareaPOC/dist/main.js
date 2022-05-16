"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chaincode_1 = require("./lib/chaincode");
const ObpcsTareaPOC_controller_1 = require("./src/ObpcsTareaPOC.controller");
chaincode_1.default({
    chainCodeName: 'ObpcsTareaPOC',
    chainCode: ObpcsTareaPOC_controller_1.ObpcsTareaPOCController,
});
//# sourceMappingURL=main.js.map