const AWS = require('aws-sdk');
const fs = require('fs');
const path = require("path");
const mime = require('mime-types')
const s3 = new AWS.S3({region: process.env.AWS_DEFAULT_REGION});

const BUCKET_NAME = process.argv[2];
const RESOURCES_DIR = 'build';

const getAllFiles = (dirPath, arrayOfFiles) => {
    files = fs.readdirSync(dirPath)
    arrayOfFiles = arrayOfFiles || []
    files.forEach(function(file) {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
            arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles)
        } else {
            arrayOfFiles.push(path.join(dirPath, file))
        }
    })

    return arrayOfFiles
}

const setReleaseId = () => {
    const releaseId = process.env.CI_COMMIT_TAG? process.env.CI_COMMIT_TAG: process.env.CI_COMMIT_SHORT_SHA;
    const filePath = path.join(RESOURCES_DIR, 'index.html');
    let content = fs.readFileSync(filePath).toString();
    content = content.replace('RELEASE_ID', releaseId);
    fs.writeFileSync(filePath, content);
}

const emptyBucket = async () => {
    console.log('start bucket reset...');
    const objects = await s3.listObjects(
        { Bucket: BUCKET_NAME }
    ).promise();
    for (const { Key } of objects.Contents) {
        await s3.deleteObject({Bucket: BUCKET_NAME, Key}).promise();
    }
    console.log('bucket reset completed');
}

const uploadFile = async (resourcePath, { cache }) => {
    const fileContent = fs.readFileSync(resourcePath);
    const params = {
        Bucket: BUCKET_NAME,
        Key: `${resourcePath.replace(`${RESOURCES_DIR}/`, '')}`,
        Body: fileContent,
        CacheControl: cache,
        ContentType: mime.lookup(resourcePath),
        ACL: 'public-read',
        Include: '*'
    };
    await s3.upload(params).promise();
};

(async () => {
    try {
        console.log('s3 deployment start');
        setReleaseId();
        await emptyBucket();
        console.log('files upload start...');
        for (const resourcePath of getAllFiles(RESOURCES_DIR)) {
            let cache = 'no-cache';
            if (resourcePath.includes('index.html')) {
                cache = 'no-store'
            }
            await uploadFile(resourcePath, { cache });
        }
        console.log('files upload completed');
        console.log('s3 deployment completed')
    } catch (e) {
        console.error('s3 deployment failed', e)
        process.exit(1)
    }
})();
