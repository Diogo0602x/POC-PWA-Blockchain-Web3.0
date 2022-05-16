/*
 * SPDX-License-Identifier: Apache-2.0
 */

import crypto = require('crypto');
import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { MyPrivateAsset } from './my-private-asset';

async function getCollectionName(ctx: Context): Promise<string> {
    const mspid: string = ctx.clientIdentity.getMSPID();
    const collectionName: string = `_implicit_org_${mspid}`;
    return collectionName;
}

@Info({title: 'MyPrivateAssetContract', description: 'My Private Data Smart Contract' })
export class MyPrivateAssetContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async meusExames(ctx: Context, myPrivateAssetId: string): Promise<boolean> {
        const collectionName: string = await getCollectionName(ctx);
        const data: Uint8Array = await ctx.stub.getPrivateDataHash(collectionName, myPrivateAssetId);
        return (!!data && data.length > 0);
    }

    @Transaction()
    public async criarExames(ctx: Context, myPrivateAssetId: string): Promise<void> {
        const exists: boolean = await this.meusExames(ctx, myPrivateAssetId);
        if (exists) {
            throw new Error(`The asset my private asset ${myPrivateAssetId} already exists`);
        }

        const privateAsset: MyPrivateAsset = new MyPrivateAsset();

        const transientData: Map<string, Uint8Array> = ctx.stub.getTransient();
        if (transientData.size === 0 || !transientData.has('privateValue')) {
            throw new Error('The privateValue key was not specified in transient data. Please try again.');
        }
        privateAsset.privateValue = transientData.get('privateValue').toString();

        const collectionName: string = await getCollectionName(ctx);
        await ctx.stub.putPrivateData(collectionName, myPrivateAssetId, Buffer.from(JSON.stringify(privateAsset)));
    }

    @Transaction(false)
    @Returns('MyPrivateAsset')
    public async lerExames(ctx: Context, myPrivateAssetId: string): Promise<string> {
        const exists: boolean = await this.meusExames(ctx, myPrivateAssetId);
        if (!exists) {
            throw new Error(`The asset my private asset ${myPrivateAssetId} does not exist`);
        }

        let privateDataString: string;

        const collectionName: string = await getCollectionName(ctx);
        const privateData: Uint8Array = await ctx.stub.getPrivateData(collectionName, myPrivateAssetId);

        privateDataString = JSON.parse(privateData.toString());
        return privateDataString;
    }

    @Transaction()
    public async atualizarExames(ctx: Context, myPrivateAssetId: string): Promise<void> {
        const exists: boolean = await this.meusExames(ctx, myPrivateAssetId);
        if (!exists) {
            throw new Error(`The asset my private asset ${myPrivateAssetId} does not exist`);
        }

        const privateAsset: MyPrivateAsset = new MyPrivateAsset();

        const transientData: Map<string, Uint8Array> = ctx.stub.getTransient();
        if (transientData.size === 0 || !transientData.has('privateValue')) {
            throw new Error('The privateValue key was not specified in transient data. Please try again.');
        }
        privateAsset.privateValue = transientData.get('privateValue').toString();

        const collectionName: string = await getCollectionName(ctx);
        await ctx.stub.putPrivateData(collectionName, myPrivateAssetId, Buffer.from(JSON.stringify(privateAsset)));
    }

    @Transaction()
    public async deletarExames(ctx: Context, myPrivateAssetId: string): Promise<void> {
        const exists: boolean = await this.meusExames(ctx, myPrivateAssetId);
        if (!exists) {
            throw new Error(`The asset my private asset ${myPrivateAssetId} does not exist`);
        }

        const collectionName: string = await getCollectionName(ctx);
        await ctx.stub.deletePrivateData(collectionName, myPrivateAssetId);
    }

    @Transaction()
    public async verificarMeusExames(ctx: Context, mspid: string, myPrivateAssetId: string, objectToVerify: MyPrivateAsset): Promise<boolean> {
        // Convert user provided object into a hash
        const hashToVerify: string = crypto.createHash('sha256').update(JSON.stringify(objectToVerify)).digest('hex');
        const pdHashBytes: Uint8Array = await ctx.stub.getPrivateDataHash(`_implicit_org_${mspid}`, myPrivateAssetId);
        if (pdHashBytes.length === 0) {
            throw new Error(`No private data hash with the Key: ${myPrivateAssetId}`);
        }

        const actualHash: string = Buffer.from(pdHashBytes).toString('hex');

        // Compare the hash calculated (from object provided) and the hash stored on public ledger
        if (hashToVerify === actualHash) {
            return true;
        } else {
            return false;
        }
    }

}
