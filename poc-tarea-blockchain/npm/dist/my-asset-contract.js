"use strict";
/*
 * SPDX-License-Identifier: Apache-2.0
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyAssetContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const my_asset_1 = require("./my-asset");
let MyAssetContract = class MyAssetContract extends fabric_contract_api_1.Contract {
    async myAssetExists(ctx, myAssetId) {
        const data = await ctx.stub.getState(myAssetId);
        return (!!data && data.length > 0);
    }
    async createMyAsset(ctx, myAssetId, value) {
        const exists = await this.myAssetExists(ctx, myAssetId);
        if (exists) {
            throw new Error(`The my asset ${myAssetId} already exists`);
        }
        const myAsset = new my_asset_1.MyAsset();
        myAsset.value = value;
        const buffer = Buffer.from(JSON.stringify(myAsset));
        await ctx.stub.putState(myAssetId, buffer);
    }
    async readMyAsset(ctx, myAssetId) {
        const exists = await this.myAssetExists(ctx, myAssetId);
        if (!exists) {
            throw new Error(`The my asset ${myAssetId} does not exist`);
        }
        const data = await ctx.stub.getState(myAssetId);
        const myAsset = JSON.parse(data.toString());
        return myAsset;
    }
    async updateMyAsset(ctx, myAssetId, newValue) {
        const exists = await this.myAssetExists(ctx, myAssetId);
        if (!exists) {
            throw new Error(`The my asset ${myAssetId} does not exist`);
        }
        const myAsset = new my_asset_1.MyAsset();
        myAsset.value = newValue;
        const buffer = Buffer.from(JSON.stringify(myAsset));
        await ctx.stub.putState(myAssetId, buffer);
    }
    async deleteMyAsset(ctx, myAssetId) {
        const exists = await this.myAssetExists(ctx, myAssetId);
        if (!exists) {
            throw new Error(`The my asset ${myAssetId} does not exist`);
        }
        await ctx.stub.deleteState(myAssetId);
    }
    async queryAllAssets(ctx) {
        const startKey = '000';
        const endKey = '999';
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString());
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString());
                }
                catch (err) {
                    console.log(err);
                    Record = res.value.value.toString();
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
};
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], MyAssetContract.prototype, "myAssetExists", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], MyAssetContract.prototype, "createMyAsset", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('MyAsset'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], MyAssetContract.prototype, "readMyAsset", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], MyAssetContract.prototype, "updateMyAsset", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], MyAssetContract.prototype, "deleteMyAsset", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], MyAssetContract.prototype, "queryAllAssets", null);
MyAssetContract = __decorate([
    fabric_contract_api_1.Info({ title: 'MyAssetContract', description: 'My Smart Contract' })
], MyAssetContract);
exports.MyAssetContract = MyAssetContract;
//# sourceMappingURL=my-asset-contract.js.map