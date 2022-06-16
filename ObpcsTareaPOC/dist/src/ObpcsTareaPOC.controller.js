"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObpcsTareaPOCController = void 0;
const tslib_1 = require("tslib");
const yup = require("yup");
const decorators_1 = require("../lib/decorators");
const ochain_controller_1 = require("../lib/ochain-controller");
const ObpcsTareaPOC_model_1 = require("./ObpcsTareaPOC.model");
const ObpcsTareaPOC_model_2 = require("./ObpcsTareaPOC.model");
const ObpcsTareaPOC_model_3 = require("./ObpcsTareaPOC.model");
const util_1 = require("util");
let ObpcsTareaPOCController = (() => {
    class ObpcsTareaPOCController extends ochain_controller_1.OchainController {
        constructor(ctx) {
            super(ctx.Stub);
            this.TRANSIENT_FHIR_JSON = 'fhirJson';
            this.PATIENT_PDC = 'patientPDC';
            this.ORGANIZATION_PDC = 'organizationPDC';
            this.OBSERVATION_PDC = 'observationPDC';
            this.Ctx = ctx;
        }
        init() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return;
            });
        }
        createPatient(asset) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let fhirJson;
                try {
                    fhirJson = this.getTransientMapKey(this.TRANSIENT_FHIR_JSON) + "";
                    this.Ctx.Stub.putPrivateData(this.PATIENT_PDC, asset.patientId, Buffer.from(fhirJson));
                }
                catch (error) {
                    console.log("[txId: " + this.getTransactionId() + "] ERROR :: createPatient | error: " + error.message);
                    fhirJson = null;
                }
                asset.fhirJson = null;
                const rtn = yield this.Ctx.Model.save(asset);
                rtn.fhirJson = fhirJson;
                return rtn;
            });
        }
        getPatientById(id) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const asset = yield this.Ctx.Model.get(id, ObpcsTareaPOC_model_1.Patient);
                if (asset) {
                    try {
                        const fhirJson = yield this.Ctx.Stub.getPrivateData(this.PATIENT_PDC, id);
                        if (fhirJson) {
                            const decoder = new util_1.TextDecoder();
                            asset.fhirJson = decoder.decode(fhirJson);
                        }
                    }
                    catch (error) {
                        console.log("[txId: " + this.getTransactionId() + "] ERROR :: getPatientById | id: " + id + " | error: " + error.message);
                    }
                }
                return asset;
            });
        }
        updatePatient(asset) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let fhirJson;
                try {
                    fhirJson = this.getTransientMapKey(this.TRANSIENT_FHIR_JSON) + "";
                    this.Ctx.Stub.putPrivateData(this.PATIENT_PDC, asset.patientId, Buffer.from(fhirJson));
                }
                catch (error) {
                    console.log("[txId: " + this.getTransactionId() + "] ERROR :: updatePatient | error: " + error.message);
                    fhirJson = null;
                }
                asset.fhirJson = null;
                const rtn = yield this.Ctx.Model.update(asset);
                rtn.fhirJson = fhirJson;
                return rtn;
            });
        }
        deletePatient(id) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const result = yield this.Ctx.Model.delete(id);
                try {
                    this.Ctx.Stub.deletePrivateData(this.PATIENT_PDC, id);
                }
                catch (error) {
                    console.log("[txId: " + this.getTransactionId() + "] ERROR :: deletePatient | error: " + error.message);
                }
                return result;
            });
        }
        getPatientHistoryById(id) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const result = yield this.Ctx.Model.history(id);
                return result;
            });
        }
        getPatientByRange(startId, endId) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const result = yield this.Ctx.Model.getByRange(startId, endId, ObpcsTareaPOC_model_1.Patient);
                if (result) {
                    let pdcSuccess = true;
                    for (let i = 0; i < result.length; i++) {
                        let item = result[i];
                        if (pdcSuccess) {
                            try {
                                const fhirJson = yield this.Ctx.Stub.getPrivateData(this.PATIENT_PDC, item.patientId);
                                if (fhirJson) {
                                    const decoder = new util_1.TextDecoder();
                                    item.fhirJson = decoder.decode(fhirJson);
                                }
                            }
                            catch (error) {
                                console.info("[txId: " + this.getTransactionId() + "] INFO :: getPatientByRange | Falha ao acessar a PDC: '" + this.PATIENT_PDC + "'.");
                                pdcSuccess = false;
                            }
                        }
                    }
                }
                return result;
            });
        }
        createOrganization(asset) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let fhirJson;
                try {
                    fhirJson = this.getTransientMapKey(this.TRANSIENT_FHIR_JSON) + "";
                    this.Ctx.Stub.putPrivateData(this.ORGANIZATION_PDC, asset.organizationId, Buffer.from(fhirJson));
                }
                catch (error) {
                    console.log("[txId: " + this.getTransactionId() + "] ERROR :: createOrganization | error: " + error.message);
                    fhirJson = null;
                }
                asset.fhirJson = null;
                const rtn = yield this.Ctx.Model.save(asset);
                rtn.fhirJson = fhirJson;
                return rtn;
            });
        }
        getOrganizationById(id) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const asset = yield this.Ctx.Model.get(id, ObpcsTareaPOC_model_2.Organization);
                if (asset) {
                    try {
                        const fhirJson = yield this.Ctx.Stub.getPrivateData(this.ORGANIZATION_PDC, id);
                        if (fhirJson) {
                            const decoder = new util_1.TextDecoder();
                            asset.fhirJson = decoder.decode(fhirJson);
                        }
                    }
                    catch (error) {
                        console.log("[txId: " + this.getTransactionId() + "] ERROR :: getOrganizationById | id: " + id + " | error: " + error.message);
                    }
                }
                return asset;
            });
        }
        updateOrganization(asset) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let fhirJson;
                try {
                    fhirJson = this.getTransientMapKey(this.TRANSIENT_FHIR_JSON) + "";
                    this.Ctx.Stub.putPrivateData(this.ORGANIZATION_PDC, asset.organizationId, Buffer.from(fhirJson));
                }
                catch (error) {
                    console.log("[txId: " + this.getTransactionId() + "] ERROR :: updateOrganization | error: " + error.message);
                    fhirJson = null;
                }
                const rtn = yield this.Ctx.Model.update(asset);
                rtn.fhirJson = fhirJson;
                return rtn;
            });
        }
        deleteOrganization(id) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const result = yield this.Ctx.Model.delete(id);
                try {
                    this.Ctx.Stub.deletePrivateData(this.ORGANIZATION_PDC, id);
                }
                catch (error) {
                    console.log("[txId: " + this.getTransactionId() + "] ERROR :: deleteOrganization | error: " + error.message);
                }
                return result;
            });
        }
        getOrganizationHistoryById(id) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const result = yield this.Ctx.Model.history(id);
                return result;
            });
        }
        getOrganizationByRange(startId, endId) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const result = yield this.Ctx.Model.getByRange(startId, endId, ObpcsTareaPOC_model_2.Organization);
                if (result) {
                    let pdcSuccess = true;
                    for (let i = 0; i < result.length; i++) {
                        let item = result[i];
                        if (pdcSuccess) {
                            try {
                                const fhirJson = yield this.Ctx.Stub.getPrivateData(this.ORGANIZATION_PDC, item.organizationId);
                                if (fhirJson) {
                                    const decoder = new util_1.TextDecoder();
                                    item.fhirJson = decoder.decode(fhirJson);
                                }
                            }
                            catch (error) {
                                console.info("[txId: " + this.getTransactionId() + "] INFO :: getOrganizationByRange | Falha ao acessar a PDC: '" + this.ORGANIZATION_PDC + "'.");
                                pdcSuccess = false;
                            }
                        }
                    }
                }
                return result;
            });
        }
        createObservation(asset) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let fhirJson;
                try {
                    fhirJson = this.getTransientMapKey(this.TRANSIENT_FHIR_JSON) + "";
                    this.Ctx.Stub.putPrivateData(this.OBSERVATION_PDC, asset.observationId, Buffer.from(fhirJson));
                }
                catch (error) {
                    console.log("[txId: " + this.getTransactionId() + "] ERROR :: createObservation | error: " + error.message);
                    fhirJson = null;
                }
                const rtn = yield this.Ctx.Model.save(asset);
                rtn.fhirJson = fhirJson;
                return rtn;
            });
        }
        getObservationById(id) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const asset = yield this.Ctx.Model.get(id, ObpcsTareaPOC_model_3.Observation);
                if (asset) {
                    try {
                        const fhirJson = yield this.Ctx.Stub.getPrivateData(this.OBSERVATION_PDC, id);
                        if (fhirJson) {
                            const decoder = new util_1.TextDecoder();
                            asset.fhirJson = decoder.decode(fhirJson);
                        }
                    }
                    catch (error) {
                        console.log("[txId: " + this.getTransactionId() + "] ERROR :: getObservationById | id: " + id + " | error: " + error.message);
                    }
                }
                return asset;
            });
        }
        updateObservation(asset) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let fhirJson;
                try {
                    fhirJson = this.getTransientMapKey(this.TRANSIENT_FHIR_JSON) + "";
                    this.Ctx.Stub.putPrivateData(this.OBSERVATION_PDC, asset.observationId, Buffer.from(fhirJson));
                }
                catch (error) {
                    console.log("[txId: " + this.getTransactionId() + "] ERROR :: updateObservation | error: " + error.message);
                    fhirJson = null;
                }
                const rtn = yield this.Ctx.Model.update(asset);
                rtn.fhirJson = fhirJson;
                return rtn;
            });
        }
        deleteObservation(id) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const result = yield this.Ctx.Model.delete(id);
                try {
                    this.Ctx.Stub.deletePrivateData(this.OBSERVATION_PDC, id);
                }
                catch (error) {
                    console.log("[txId: " + this.getTransactionId() + "] ERROR :: deleteObservation | error: " + error.message);
                }
                return result;
            });
        }
        getObservationHistoryById(id) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const result = yield this.Ctx.Model.history(id);
                return result;
            });
        }
        getObservationByRange(startId, endId) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const result = yield this.Ctx.Model.getByRange(startId, endId, ObpcsTareaPOC_model_3.Observation);
                if (result) {
                    let pdcSuccess = true;
                    for (let i = 0; i < result.length; i++) {
                        let item = result[i];
                        if (pdcSuccess) {
                            try {
                                const fhirJson = yield this.Ctx.Stub.getPrivateData(this.OBSERVATION_PDC, item.observationId);
                                if (fhirJson) {
                                    const decoder = new util_1.TextDecoder();
                                    item.fhirJson = decoder.decode(fhirJson);
                                }
                            }
                            catch (error) {
                                console.info("[txId: " + this.getTransactionId() + "] INFO :: getObservationByRange | Falha ao acessar a PDC: '" + this.OBSERVATION_PDC + "'.");
                                pdcSuccess = false;
                            }
                        }
                    }
                }
                return result;
            });
        }
        executeQuery(query) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const result = yield this.query(query);
                return result;
            });
        }
    }
    tslib_1.__decorate([
        decorators_1.Validator(),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "init", null);
    tslib_1.__decorate([
        decorators_1.Validator(ObpcsTareaPOC_model_1.Patient),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [ObpcsTareaPOC_model_1.Patient]),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "createPatient", null);
    tslib_1.__decorate([
        decorators_1.Validator(yup.string()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String]),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "getPatientById", null);
    tslib_1.__decorate([
        decorators_1.Validator(ObpcsTareaPOC_model_1.Patient),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [ObpcsTareaPOC_model_1.Patient]),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "updatePatient", null);
    tslib_1.__decorate([
        decorators_1.Validator(yup.string()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String]),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "deletePatient", null);
    tslib_1.__decorate([
        decorators_1.Validator(yup.string()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String]),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "getPatientHistoryById", null);
    tslib_1.__decorate([
        decorators_1.Validator(yup.string(), yup.string()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, String]),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "getPatientByRange", null);
    tslib_1.__decorate([
        decorators_1.Validator(ObpcsTareaPOC_model_2.Organization),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [ObpcsTareaPOC_model_2.Organization]),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "createOrganization", null);
    tslib_1.__decorate([
        decorators_1.Validator(yup.string()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String]),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "getOrganizationById", null);
    tslib_1.__decorate([
        decorators_1.Validator(ObpcsTareaPOC_model_2.Organization),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [ObpcsTareaPOC_model_2.Organization]),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "updateOrganization", null);
    tslib_1.__decorate([
        decorators_1.Validator(yup.string()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String]),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "deleteOrganization", null);
    tslib_1.__decorate([
        decorators_1.Validator(yup.string()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String]),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "getOrganizationHistoryById", null);
    tslib_1.__decorate([
        decorators_1.Validator(yup.string(), yup.string()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, String]),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "getOrganizationByRange", null);
    tslib_1.__decorate([
        decorators_1.Validator(ObpcsTareaPOC_model_3.Observation),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [ObpcsTareaPOC_model_3.Observation]),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "createObservation", null);
    tslib_1.__decorate([
        decorators_1.Validator(yup.string()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String]),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "getObservationById", null);
    tslib_1.__decorate([
        decorators_1.Validator(ObpcsTareaPOC_model_3.Observation),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [ObpcsTareaPOC_model_3.Observation]),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "updateObservation", null);
    tslib_1.__decorate([
        decorators_1.Validator(yup.string()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String]),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "deleteObservation", null);
    tslib_1.__decorate([
        decorators_1.Validator(yup.string()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String]),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "getObservationHistoryById", null);
    tslib_1.__decorate([
        decorators_1.Validator(yup.string(), yup.string()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, String]),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "getObservationByRange", null);
    tslib_1.__decorate([
        decorators_1.Validator(yup.string()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String]),
        tslib_1.__metadata("design:returntype", Promise)
    ], ObpcsTareaPOCController.prototype, "executeQuery", null);
    return ObpcsTareaPOCController;
})();
exports.ObpcsTareaPOCController = ObpcsTareaPOCController;
//# sourceMappingURL=ObpcsTareaPOC.controller.js.map