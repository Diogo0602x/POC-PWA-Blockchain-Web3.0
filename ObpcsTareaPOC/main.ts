/**
 *
 * Copyright (c) 2021, Oracle and/or its affiliates. All rights reserved.
 *
 */
import ChaincodeSDK from './lib/chaincode';
import { ObpcsTareaPOCController } from './src/ObpcsTareaPOC.controller';

ChaincodeSDK({
    chainCodeName: 'ObpcsTareaPOC',
    chainCode: ObpcsTareaPOCController,
});
