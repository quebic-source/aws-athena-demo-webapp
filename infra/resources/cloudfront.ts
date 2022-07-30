import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import {getResourceName} from "../helpers/utils/common-utils";
import {ProjectConfig, DomainPropertiesType} from "../config/project-config";
import S3Origin from "./s3-origin";

interface CloudFrontCreate {
    cloudDistributionName: string,
    oaiName: string,
    bucketPolicyId: string,
    domainNamePrefix: string,
    acmCertificateArn: string,
    bucketName: string,
    wwwEnable?: boolean
}

export default class CloudFront {
    private readonly _cloudfrontDistribution: aws.cloudfront.Distribution;
    constructor(s3Origin: S3Origin, args: CloudFrontCreate) {
        const projectConfig = new ProjectConfig();
        const { domainNamePrefix, acmCertificateArn, bucketName, cloudDistributionName, oaiName, bucketPolicyId, wwwEnable } = args;
        const bucket = s3Origin.bucket;
        
        const oaiId = getResourceName(oaiName);
        const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity(oaiId, {
            comment: oaiId
        });
        
        const originId = 'elizn-nlu-web';
        this._cloudfrontDistribution = new aws.cloudfront.Distribution(getResourceName(cloudDistributionName), {
            aliases: [
                domainNamePrefix
            ],
            customErrorResponses: [
                {
                    errorCode: 403,
                    responsePagePath: "/index.html",
                    responseCode: 200,
                    errorCachingMinTtl: 300,
                },
                {
                    errorCode: 404,
                    responsePagePath: "/index.html",
                    responseCode: 200,
                    errorCachingMinTtl: 300,
                }
            ],
            viewerCertificate: {
                acmCertificateArn,
                minimumProtocolVersion: 'TLSv1.1_2016',
                sslSupportMethod: 'sni-only'
            },
            comment: "Cloudfront distribution",
            // defaultRootObject: "index.html",
            enabled: true,
            httpVersion: "http2",
            origins: [{
                originId,
                domainName: wwwEnable?bucket.websiteEndpoint: bucket.bucketDomainName,
                s3OriginConfig: wwwEnable? undefined: {
                    originAccessIdentity: originAccessIdentity.cloudfrontAccessIdentityPath,
                },
                customOriginConfig: wwwEnable? {
                    httpPort: 80,
                    httpsPort: 443,
                    originProtocolPolicy: "http-only",
                    originSslProtocols: ["TLSv1"]
                }: undefined
            }],
            defaultCacheBehavior: {
                compress: true,
                allowedMethods: [
                    "GET",
                    "HEAD",
                    "OPTIONS"
                ],
                forwardedValues: {
                    queryString: false,
                    cookies: {
                        forward: "none",
                    },
                },
                targetOriginId: originId,
                viewerProtocolPolicy: "redirect-to-https",
                // GET and HEAD methods are cached by default
                cachedMethods: [
                    "GET",
                    "HEAD",
                ]
            },
            restrictions: {
                geoRestriction: {
                    restrictionType: "none",
                    locations: [],
                },
            },
            tags: {
                env: projectConfig.env
            }
        });

        if (!wwwEnable) {
            s3Origin.addBucketPolicy(bucketPolicyId, [{
                Effect: "Allow",
                Action: "s3:GetObject",
                Resource: `arn:aws:s3:::${bucketName}/*`,
                Principal: {
                    AWS: originAccessIdentity.iamArn
                }
            }]);
        }
    }

    public get cloudfrontDistribution(): aws.cloudfront.Distribution {
        return this._cloudfrontDistribution;
    }
}