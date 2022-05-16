import { Context, Contract } from 'fabric-contract-api';
import { MyAsset } from './my-asset';
export declare class MyAssetContract extends Contract {
    myAssetExists(ctx: Context, myAssetId: string): Promise<boolean>;
    createMyAsset(ctx: Context, myAssetId: string, value: string): Promise<void>;
    readMyAsset(ctx: Context, myAssetId: string): Promise<MyAsset>;
    updateMyAsset(ctx: Context, myAssetId: string, newValue: string): Promise<void>;
    deleteMyAsset(ctx: Context, myAssetId: string): Promise<void>;
    queryAllAssets(ctx: Context): Promise<string>;
}
