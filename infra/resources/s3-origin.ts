import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import {getResourceName} from "../helpers/utils/common-utils";
import {ProjectConfig, DomainPropertiesType} from "../config/project-config";

interface S3OriginCreate {
    bucketName: string,
    redirect?: string
}

export default class S3Origin {
    private readonly _bucket: aws.s3.Bucket;

    constructor(args: S3OriginCreate) {
        const { bucketName, redirect } = args;
        let website;
        if (redirect) {
            website = {redirectAllRequestsTo: redirect} 
        }
        this._bucket = new aws.s3.Bucket(bucketName, {
            bucket: bucketName,
            tags: {env: new ProjectConfig().env},
            website
        });
    }

    public get bucket(): aws.s3.Bucket {
        return this._bucket;
    }

    public addBucketPolicy(id: string, policyStatements: pulumi.Input<pulumi.Input<aws.iam.PolicyStatement>[]>) {
        const policyId = getResourceName(id);
        new aws.s3.BucketPolicy(policyId, {
            bucket: this._bucket.id,
            policy: {Version: "2012-10-17", Statement: policyStatements}
        });
    }
    
}