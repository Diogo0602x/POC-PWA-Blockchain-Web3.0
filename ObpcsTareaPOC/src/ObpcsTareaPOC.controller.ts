/**
 *
 * Copyright (c) 2021, Oracle and/or its affiliates. All rights reserved.
 *
 */
import * as yup from 'yup';
import { Validator } from '../lib/decorators';
import { OchainController } from '../lib/ochain-controller';
import { Patient } from './ObpcsTareaPOC.model';
import { Organization } from './ObpcsTareaPOC.model';
import { Observation } from './ObpcsTareaPOC.model';
import { Context } from '../lib/ochain-transaction-context';
import { TextDecoder } from 'util';

export class ObpcsTareaPOCController extends OchainController {

    private Ctx: Context;

    constructor(ctx: Context) {
        super(ctx.Stub);
        this.Ctx = ctx;
    }

    @Validator()
    public async init() {
        return;
    }
    
    public readonly TRANSIENT_FHIR_JSON = 'fhirJson'; 

    //-----------------------------------------------------------------------------
    //Patient
    //-----------------------------------------------------------------------------
    // OR('OBPTarea.member')
    public readonly PATIENT_PDC = 'patientPDC'; 

    @Validator(Patient)
    public async createPatient(asset: Patient) {
        let fhirJson: string;

        try {
            fhirJson = this.getTransientMapKey(this.TRANSIENT_FHIR_JSON) + "";
            this.Ctx.Stub.putPrivateData(this.PATIENT_PDC, asset.patientId, Buffer.from(fhirJson));
        } catch (error) {
            console.log("[txId: " + this.getTransactionId() + "] ERROR :: createPatient | error: " + error.message);
            fhirJson = null;
        }

        asset.fhirJson = null;
        const rtn = await this.Ctx.Model.save(asset);
        rtn.fhirJson = fhirJson;

        return rtn;
    }
    
    @Validator(yup.string())
    public async getPatientById(id: string) {
        const asset = await this.Ctx.Model.get(id, Patient);
        if (asset) {
            try {
                const fhirJson = await this.Ctx.Stub.getPrivateData(this.PATIENT_PDC, id);
                if (fhirJson) {
                    const decoder = new TextDecoder();
                    asset.fhirJson = decoder.decode(fhirJson);
                }
            } catch (error) {
                console.log("[txId: " + this.getTransactionId() + "] ERROR :: getPatientById | id: " + id + " | error: " + error.message);
            }
        }
        return asset;
    }

    @Validator(Patient)
    public async updatePatient(asset: Patient) {
        let fhirJson: string;

        try {
            fhirJson = this.getTransientMapKey(this.TRANSIENT_FHIR_JSON) + "";
            this.Ctx.Stub.putPrivateData(this.PATIENT_PDC, asset.patientId, Buffer.from(fhirJson));
        } catch (error) {
            console.log("[txId: " + this.getTransactionId() + "] ERROR :: updatePatient | error: " + error.message);
            fhirJson = null;
        }

        asset.fhirJson = null;
        const rtn = await this.Ctx.Model.update(asset);
        rtn.fhirJson = fhirJson;

        return rtn;
    }
    
    @Validator(yup.string())
    public async deletePatient(id: string) {
        const result = await this.Ctx.Model.delete(id);

        try {
            this.Ctx.Stub.deletePrivateData(this.PATIENT_PDC, id)
        } catch (error) {
            console.log("[txId: " + this.getTransactionId() + "] ERROR :: deletePatient | error: " + error.message);
        }

        return result;
    }
    
    @Validator(yup.string())
    public async getPatientHistoryById(id: string) {
        const result = await this.Ctx.Model.history(id);
        return result;
    }
    
    @Validator(yup.string(), yup.string())
    public async getPatientByRange(startId: string, endId: string) {
        const result = await this.Ctx.Model.getByRange(startId, endId, Patient);

        if (result) {
            let pdcSuccess = true;
            for (let i = 0; i < result.length; i++ ) {
                let item = result[i];
                if (pdcSuccess) {
                    try {
                        const fhirJson = await this.Ctx.Stub.getPrivateData(this.PATIENT_PDC, item.patientId);
                        if (fhirJson) {
                            const decoder = new TextDecoder();
                            item.fhirJson = decoder.decode(fhirJson);
                        }
                    } catch (error) {
                        console.info("[txId: " + this.getTransactionId() + "] INFO :: getPatientByRange | Falha ao acessar a PDC: '" + this.PATIENT_PDC + "'.");
                        pdcSuccess = false;
                    }
                }
            }
        }

        return result;
    }


    //-----------------------------------------------------------------------------
    //Organization
    //-----------------------------------------------------------------------------
    // OR('OBPTarea.member')
    public readonly ORGANIZATION_PDC = 'organizationPDC'; 

    @Validator(Organization)
    public async createOrganization(asset: Organization) {
        let fhirJson: string;

        try {
            fhirJson = this.getTransientMapKey(this.TRANSIENT_FHIR_JSON) + "";
            this.Ctx.Stub.putPrivateData(this.ORGANIZATION_PDC, asset.organizationId, Buffer.from(fhirJson));
        } catch (error) {
            console.log("[txId: " + this.getTransactionId() + "] ERROR :: createOrganization | error: " + error.message);
            fhirJson = null;
        }
        asset.fhirJson = null;
        const rtn = await this.Ctx.Model.save(asset);
        rtn.fhirJson = fhirJson;

        return rtn;
    }
    
    @Validator(yup.string())
    public async getOrganizationById(id: string) {
        const asset = await this.Ctx.Model.get(id, Organization);
        if (asset) {
            try {
                const fhirJson = await this.Ctx.Stub.getPrivateData(this.ORGANIZATION_PDC, id);
                if (fhirJson) {
                    const decoder = new TextDecoder();
                    asset.fhirJson = decoder.decode(fhirJson);
                }
            } catch (error) {
                console.log("[txId: " + this.getTransactionId() + "] ERROR :: getOrganizationById | id: " + id + " | error: " + error.message);
            }
        }
       return asset;
    }
    
    @Validator(Organization)
    public async updateOrganization(asset: Organization) {
        let fhirJson: string;
 
         try {
             fhirJson = this.getTransientMapKey(this.TRANSIENT_FHIR_JSON) + "";
             this.Ctx.Stub.putPrivateData(this.ORGANIZATION_PDC, asset.organizationId, Buffer.from(fhirJson));
         } catch (error) {
             console.log("[txId: " + this.getTransactionId() + "] ERROR :: updateOrganization | error: " + error.message);
             fhirJson = null;
         }
 
         const rtn = await this.Ctx.Model.update(asset);
         rtn.fhirJson = fhirJson;
 
         return rtn;
    }
    
    @Validator(yup.string())
    public async deleteOrganization(id: string) {
        const result = await this.Ctx.Model.delete(id);

        try {
            this.Ctx.Stub.deletePrivateData(this.ORGANIZATION_PDC, id)
        } catch (error) {
            console.log("[txId: " + this.getTransactionId() + "] ERROR :: deleteOrganization | error: " + error.message);
        }

        return result;
    }
    
    @Validator(yup.string())
    public async getOrganizationHistoryById(id: string) {
        const result = await this.Ctx.Model.history(id);
        return result;
    }
    
    @Validator(yup.string(), yup.string())
    public async getOrganizationByRange(startId: string, endId: string) {
        const result = await this.Ctx.Model.getByRange(startId, endId, Organization);

        if (result) {
            let pdcSuccess = true;
            for (let i = 0; i < result.length; i++ ) {
                let item = result[i];
                if (pdcSuccess) {
                    try {
                        const fhirJson = await this.Ctx.Stub.getPrivateData(this.ORGANIZATION_PDC, item.organizationId);
                        if (fhirJson) {
                            const decoder = new TextDecoder();
                            item.fhirJson = decoder.decode(fhirJson);
                        }
                    } catch (error) {
                        console.info("[txId: " + this.getTransactionId() + "] INFO :: getOrganizationByRange | Falha ao acessar a PDC: '" + this.ORGANIZATION_PDC + "'.");
                        pdcSuccess = false;
                    }
                }
            }
        }

        return result;
    }


    //-----------------------------------------------------------------------------
    //Observation
    //-----------------------------------------------------------------------------
    // OR('OBPTarea.member')
    public readonly OBSERVATION_PDC = 'observationPDC'; 

    @Validator(Observation)
    public async createObservation(asset: Observation) {
        let fhirJson: string;

        try {
            fhirJson = this.getTransientMapKey(this.TRANSIENT_FHIR_JSON) + "";
            this.Ctx.Stub.putPrivateData(this.OBSERVATION_PDC, asset.observationId, Buffer.from(fhirJson));
        } catch (error) {
            console.log("[txId: " + this.getTransactionId() + "] ERROR :: createObservation | error: " + error.message);
            fhirJson = null;
        }

        const rtn = await this.Ctx.Model.save(asset);
        rtn.fhirJson = fhirJson;

        return rtn;
    }
    
    @Validator(yup.string())
    public async getObservationById(id: string) {
        const asset = await this.Ctx.Model.get(id, Observation);
        if (asset) {
            try {
                const fhirJson = await this.Ctx.Stub.getPrivateData(this.OBSERVATION_PDC, id);
                if (fhirJson) {
                    const decoder = new TextDecoder();
                    asset.fhirJson = decoder.decode(fhirJson);
                }
            } catch (error) {
                console.log("[txId: " + this.getTransactionId() + "] ERROR :: getObservationById | id: " + id + " | error: " + error.message);
            }
        }
       return asset;
    }
    
    @Validator(Observation)
    public async updateObservation(asset: Observation) {
        let fhirJson: string;
 
        try {
            fhirJson = this.getTransientMapKey(this.TRANSIENT_FHIR_JSON) + "";
            this.Ctx.Stub.putPrivateData(this.OBSERVATION_PDC, asset.observationId, Buffer.from(fhirJson));
        } catch (error) {
            console.log("[txId: " + this.getTransactionId() + "] ERROR :: updateObservation | error: " + error.message);
            fhirJson = null;
        }

        const rtn = await this.Ctx.Model.update(asset);
        rtn.fhirJson = fhirJson;

       return rtn;
    }
    
    @Validator(yup.string())
    public async deleteObservation(id: string) {
        const result = await this.Ctx.Model.delete(id);

        try {
            this.Ctx.Stub.deletePrivateData(this.OBSERVATION_PDC, id)
        } catch (error) {
            console.log("[txId: " + this.getTransactionId() + "] ERROR :: deleteObservation | error: " + error.message);
        }

        return result;
    }
    
    @Validator(yup.string())
    public async getObservationHistoryById(id: string) {
        const result = await this.Ctx.Model.history(id);
        return result;
    }
    
    @Validator(yup.string(), yup.string())
    public async getObservationByRange(startId: string, endId: string) {
        const result = await this.Ctx.Model.getByRange(startId, endId, Observation);

        if (result) {
            let pdcSuccess = true;
            for (let i = 0; i < result.length; i++ ) {
                let item = result[i];
                if (pdcSuccess) {
                    try {
                        const fhirJson = await this.Ctx.Stub.getPrivateData(this.OBSERVATION_PDC, item.observationId);
                        if (fhirJson) {
                            const decoder = new TextDecoder();
                            item.fhirJson = decoder.decode(fhirJson);
                        }
                    } catch (error) {
                        console.info("[txId: " + this.getTransactionId() + "] INFO :: getObservationByRange | Falha ao acessar a PDC: '" + this.OBSERVATION_PDC + "'.");
                        pdcSuccess = false;
                    }
                }
            }
        }

        return result;
    }

    //-----------------------------------------------------------------------------
    
    /**
     * 
     * BDB sql rich queries can be executed in OBP CS/EE.
     * This method can be invoked only when connected to remote OBP CS/EE network.
     * 
     */
    @Validator(yup.string())
    public async executeQuery(query: string) {
        const result = await this.query(query);
        return result;
    }
}

