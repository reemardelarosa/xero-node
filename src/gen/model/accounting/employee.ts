/**
 * Accounting API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 2.1.0
 * Contact: api@xero.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { ExternalLink } from '././externalLink';
import { ValidationError } from '././validationError';

export class Employee {
    /**
    * The Xero identifier for an employee e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9
    */
    'employeeID'?: string;
    /**
    * Current status of an employee – see contact status types
    */
    'status'?: Employee.StatusEnum;
    /**
    * First name of an employee (max length = 255)
    */
    'firstName'?: string;
    /**
    * Last name of an employee (max length = 255)
    */
    'lastName'?: string;
    'externalLink'?: ExternalLink;
    'updatedDateUTC'?: Date;
    /**
    * A string to indicate if a invoice status
    */
    'statusAttributeString'?: string;
    /**
    * Displays array of validation error messages from the API
    */
    'validationErrors'?: Array<ValidationError>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "employeeID",
            "baseName": "EmployeeID",
            "type": "string"
        },
        {
            "name": "status",
            "baseName": "Status",
            "type": "Employee.StatusEnum"
        },
        {
            "name": "firstName",
            "baseName": "FirstName",
            "type": "string"
        },
        {
            "name": "lastName",
            "baseName": "LastName",
            "type": "string"
        },
        {
            "name": "externalLink",
            "baseName": "ExternalLink",
            "type": "ExternalLink"
        },
        {
            "name": "updatedDateUTC",
            "baseName": "UpdatedDateUTC",
            "type": "Date"
        },
        {
            "name": "statusAttributeString",
            "baseName": "StatusAttributeString",
            "type": "string"
        },
        {
            "name": "validationErrors",
            "baseName": "ValidationErrors",
            "type": "Array<ValidationError>"
        }    ];

    static getAttributeTypeMap() {
        return Employee.attributeTypeMap;
    }
}

export namespace Employee {
    export enum StatusEnum {
        ACTIVE = <any> 'ACTIVE',
        ARCHIVED = <any> 'ARCHIVED',
        GDPRREQUEST = <any> 'GDPRREQUEST'
    }
}
