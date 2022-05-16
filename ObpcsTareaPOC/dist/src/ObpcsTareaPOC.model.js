"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observation = exports.Organization = exports.Patient = void 0;
const tslib_1 = require("tslib");
const yup = require("yup");
const decorators_1 = require("../lib/decorators");
const ochain_model_1 = require("../lib/ochain-model");
let Patient = (() => {
    let Patient = class Patient extends ochain_model_1.OchainModel {
        constructor() {
            super(...arguments);
            this.assetType = 'patient';
        }
    };
    tslib_1.__decorate([
        decorators_1.Mandatory(),
        decorators_1.Validate(yup.string()),
        tslib_1.__metadata("design:type", String)
    ], Patient.prototype, "patientId", void 0);
    tslib_1.__decorate([
        decorators_1.Validate(yup.string()),
        tslib_1.__metadata("design:type", String)
    ], Patient.prototype, "cpf", void 0);
    tslib_1.__decorate([
        decorators_1.Validate(yup.string()),
        tslib_1.__metadata("design:type", String)
    ], Patient.prototype, "name", void 0);
    tslib_1.__decorate([
        decorators_1.Validate(yup.date()),
        tslib_1.__metadata("design:type", Date)
    ], Patient.prototype, "dateOfBirth", void 0);
    tslib_1.__decorate([
        decorators_1.Default('false'),
        decorators_1.Validate(yup.boolean()),
        tslib_1.__metadata("design:type", Boolean)
    ], Patient.prototype, "deceased", void 0);
    Patient = tslib_1.__decorate([
        decorators_1.Id('patientId')
    ], Patient);
    return Patient;
})();
exports.Patient = Patient;
let Organization = (() => {
    let Organization = class Organization extends ochain_model_1.OchainModel {
        constructor() {
            super(...arguments);
            this.assetType = 'organization';
        }
    };
    tslib_1.__decorate([
        decorators_1.Mandatory(),
        decorators_1.Validate(yup.string()),
        tslib_1.__metadata("design:type", String)
    ], Organization.prototype, "organizationId", void 0);
    tslib_1.__decorate([
        decorators_1.Validate(yup.string()),
        tslib_1.__metadata("design:type", String)
    ], Organization.prototype, "cnpj", void 0);
    tslib_1.__decorate([
        decorators_1.Validate(yup.string()),
        tslib_1.__metadata("design:type", String)
    ], Organization.prototype, "name", void 0);
    tslib_1.__decorate([
        decorators_1.Default('true'),
        decorators_1.Validate(yup.boolean()),
        tslib_1.__metadata("design:type", Boolean)
    ], Organization.prototype, "active", void 0);
    Organization = tslib_1.__decorate([
        decorators_1.Id('organizationId')
    ], Organization);
    return Organization;
})();
exports.Organization = Organization;
let Observation = (() => {
    let Observation = class Observation extends ochain_model_1.OchainModel {
        constructor() {
            super(...arguments);
            this.assetType = 'observation';
        }
    };
    tslib_1.__decorate([
        decorators_1.Mandatory(),
        decorators_1.Validate(yup.string()),
        tslib_1.__metadata("design:type", String)
    ], Observation.prototype, "observationId", void 0);
    tslib_1.__decorate([
        decorators_1.Validate(yup.string()),
        tslib_1.__metadata("design:type", String)
    ], Observation.prototype, "profile", void 0);
    tslib_1.__decorate([
        decorators_1.Validate(yup.string()),
        tslib_1.__metadata("design:type", String)
    ], Observation.prototype, "identifierSystem", void 0);
    tslib_1.__decorate([
        decorators_1.Validate(yup.string()),
        tslib_1.__metadata("design:type", String)
    ], Observation.prototype, "identifierValue", void 0);
    tslib_1.__decorate([
        decorators_1.Validate(yup.string()),
        tslib_1.__metadata("design:type", String)
    ], Observation.prototype, "status", void 0);
    tslib_1.__decorate([
        decorators_1.Validate(yup.string()),
        tslib_1.__metadata("design:type", String)
    ], Observation.prototype, "codeSystem", void 0);
    tslib_1.__decorate([
        decorators_1.Validate(yup.string()),
        tslib_1.__metadata("design:type", String)
    ], Observation.prototype, "codeValue", void 0);
    tslib_1.__decorate([
        decorators_1.Validate(yup.string()),
        tslib_1.__metadata("design:type", String)
    ], Observation.prototype, "patientId", void 0);
    tslib_1.__decorate([
        decorators_1.Validate(yup.date()),
        tslib_1.__metadata("design:type", Date)
    ], Observation.prototype, "effectiveDateTime", void 0);
    tslib_1.__decorate([
        decorators_1.Validate(yup.date()),
        tslib_1.__metadata("design:type", Date)
    ], Observation.prototype, "issuedAt", void 0);
    tslib_1.__decorate([
        decorators_1.Validate(yup.string()),
        tslib_1.__metadata("design:type", String)
    ], Observation.prototype, "organizationId", void 0);
    tslib_1.__decorate([
        decorators_1.Validate(yup.string()),
        tslib_1.__metadata("design:type", String)
    ], Observation.prototype, "valueString", void 0);
    Observation = tslib_1.__decorate([
        decorators_1.Id('observationId')
    ], Observation);
    return Observation;
})();
exports.Observation = Observation;
//# sourceMappingURL=ObpcsTareaPOC.model.js.map