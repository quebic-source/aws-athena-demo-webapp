import * as aws from "@pulumi/aws";
import CloudFront from "./cloudfront";

interface Route53Create {
    domainNamePrefix: string,
    hostedZoneId: string,
}

export default class Route53RecordSet {
    constructor(cloudFront: CloudFront, args: Route53Create) {
        const { domainNamePrefix, hostedZoneId } = args;
        const cloudfrontDistribution = cloudFront.cloudfrontDistribution;
        new aws.route53.Record(domainNamePrefix, {
            zoneId: hostedZoneId,
            name: domainNamePrefix,
            type: "A",
            aliases: [
                {
                    name: cloudfrontDistribution.domainName,
                    zoneId: cloudfrontDistribution.hostedZoneId,
                    evaluateTargetHealth: true
                }
            ]
        });
    }
}