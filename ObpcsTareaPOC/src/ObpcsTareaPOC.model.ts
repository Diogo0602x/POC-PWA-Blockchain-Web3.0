/**
 *
 * Copyright (c) 2021, Oracle and/or its affiliates. All rights reserved.
 *
 */
import * as yup from 'yup';
import { Id, Mandatory, Validate, Default, Embedded, Derived, ReadOnly } from '../lib/decorators';
import { OchainModel } from '../lib/ochain-model';
import { STRATEGY } from '../lib/utils';
import { EmbeddedModel } from '../lib/ochain-embedded-model';

@Id('patientId')
export class Patient extends OchainModel<Patient> {
    
    public readonly assetType = 'patient';

    @Mandatory()
    @Validate(yup.string())
    public patientId: string;

    @Validate(yup.string())
    public cpf: string;

    @Validate(yup.string())
    public name: string;

    @Validate(yup.date())
    public dateOfBirth: Date;

    @Default('false')
    @Validate(yup.boolean())
    public deceased: boolean;

    public fhirJson: string;
}

@Id('organizationId')
export class Organization extends OchainModel<Organization> {
    
    public readonly assetType = 'organization';

    @Mandatory()
    @Validate(yup.string())
    public organizationId: string;

    @Validate(yup.string())
    public cnpj: string;

    @Validate(yup.string())
    public name: string;

    @Default('true')
    @Validate(yup.boolean())
    public active: boolean;

    public fhirJson: string;
}

@Id('observationId')
export class Observation extends OchainModel<Observation> {
    
    public readonly assetType = 'observation';

    @Mandatory()
    @Validate(yup.string())
    public observationId: string;

    @Validate(yup.string())
    public profile: string;

    @Validate(yup.string())
    public identifierSystem: string;

    @Validate(yup.string())
    public identifierValue: string;

    @Validate(yup.string())
    public status: string;

    @Validate(yup.string())
    public codeSystem: string;

    @Validate(yup.string())
    public codeValue: string;

    @Validate(yup.string())
    public patientId: string;

    @Validate(yup.date())
    public effectiveDateTime: Date;

    @Validate(yup.date())
    public issuedAt: Date;

    @Validate(yup.string())
    public organizationId: string;

    @Validate(yup.string())
    public valueString: string;
    
    public fhirJson: string;
}
