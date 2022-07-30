import S3Orgin from "./resources/s3-origin";
import CloudFront from "./resources/cloudfront";
import Route53RecordSet from "./resources/route53-record-set";
import { ProjectConfig } from "./config/project-config";

const projectConfig = new ProjectConfig();
const domainProperties = projectConfig.domainProperties;
const { bucketName, domainNamePrefix, resourcesDomainNamePrefix, hostedZoneId, acmCertificateArn, wwwEnable } = domainProperties;

const s3Orgin = new S3Orgin({ bucketName });
const cloudFront = new CloudFront(s3Orgin, {
    cloudDistributionName: "frontend-cd",
    oaiName: "root-oai",
    bucketPolicyId: "s3-access",
    domainNamePrefix,
    bucketName,
    acmCertificateArn
});
new Route53RecordSet(cloudFront, {
    domainNamePrefix, 
    hostedZoneId
});

if (wwwEnable) {
    // www related resources
    const wwwBucketName =  `www.${bucketName}`;
    const wwwDomainNamePrefix =  `www.${domainNamePrefix}`;
    const wwwS3Orgin = new S3Orgin({
        bucketName: wwwBucketName,
        redirect: `https://${domainNamePrefix}`
    });

    const wwwCloudFront = new CloudFront(wwwS3Orgin, {
        cloudDistributionName: "www-cd",
        oaiName: "www-oai",
        bucketPolicyId: "www-s3-access",
        domainNamePrefix: wwwDomainNamePrefix,
        bucketName: wwwBucketName,
        acmCertificateArn,
        wwwEnable
    });

    new Route53RecordSet(wwwCloudFront, {
        domainNamePrefix: wwwDomainNamePrefix, 
        hostedZoneId
    });
}