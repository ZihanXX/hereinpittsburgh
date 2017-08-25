//=========THIS IS THE TEMPLETE FOR IMAGE UPLOADING========//


var s3 = require('s3');
 
var client = s3.createClient({
  maxAsyncS3: 20,     // this is the default 
  s3RetryCount: 3,    // this is the default 
  s3RetryDelay: 1000, // this is the default 
  multipartUploadThreshold: 20971520, // this is the default (20 MB) 
  multipartUploadSize: 15728640, // this is the default (15 MB) 
  s3Options: {
    accessKeyId: "AKIAIM3J5R5I3GSMUGWQ",
    secretAccessKey: "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",
    // any other options are passed to new AWS.S3() 
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property 
  },
});

var params = {
  localFile: "dior.jpg",
  s3Params: {
    Bucket: "hereinpittsburgh",
    Key: "some/diorr.jpg",
    ACL: 'public-read'
    // other options supported by putObject, except Body and ContentLength. 
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property 
  }
};
var uploader = client.uploadFile(params);

// uploader.on('error', function(err) {
//   console.error("unable to upload:", err.stack);
// });
// uploader.on('progress', function() {
//   console.log("progress", uploader.progressMd5Amount,
//             uploader.progressAmount, uploader.progressTotal);
// });
// uploader.on('end', function() {
//   console.log("done uploading");
// });


var par = {
    Bucket: "hereinpittsburgh",
    Delete: {
        Objects: [
            {Key: "some/dior.jpg"}
        ]
    }
};
var deleter = client.deleteObjects(par);

// deleter.on('error', function(err) {
//   console.error("unable to delete:", err.stack);
// });
// deleter.on('progress', function() {
//   console.log("progress", deleter.progressMd5Amount,
//             deleter.progressAmount, deleter.progressTotal);
// });
// deleter.on('end', function() {
//   console.log("done deleting");
// });
