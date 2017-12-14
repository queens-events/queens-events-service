const multer = require('multer');
const moment = require('moment');
const multerS3 = require('multer-s3');

const AWS = require('aws-sdk');
const rootBucketName = 'queens-events';

AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY;
AWS.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
AWS.config.region = 'ca-central-1';

const s3 = new AWS.S3();

module.exports = multerMiddlewareFactory = (bucketName) => {
    return multer({
        storage: multerS3({
            s3,
            bucket: `${rootBucketName}/${bucketName}`,
            acl: 'public-read',
            metadata: (req, file, cb) => {
                cb(null, { fieldName: file.originalname })
            },
            key: (req, file, cb) => {
                cb(null, `${moment().format()}-${file.originalname}`)
            }
        })
    });
}
