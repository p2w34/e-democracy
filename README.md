## e-petitions WWW
1. Create e-petitions-www bucket and upload www files
- enable static hosting
- in permissions add policy:
{
  "Version":"2012-10-17",
  "Statement":[
    {
      "Sid":"PublicReadGetObject",
      "Effect":"Allow",
      "Principal": "*",
      "Action":["s3:GetObject"],
      "Resource":["arn:aws:s3:::e-petitions-www/*"]
    }
  ]
}

## e-petitions API. AWS setup
1. API GATEWAY (HTTP)
- might be a problem due to CORS; then set it properly on AWS, for testing I set Access-Control-Allow-Origin as '*' and Access-Control-Allow-Headers as '*', and Access-Control-Allow-Methods as POST
2. S3 Bucket (enable versioning to err on the safe side)
3. Lambda. To prepare .zip file for AWS Lambda:
  a. cd www/
  b. npm install # creates node_modules/ based on package.json and package-lock.json files
  c. zip -r e-petitions-api.zip .
4. IAM. In the Lambda config page see the role and add to it following policy:

{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
            ],
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}

## other
1. To use SSH, one has to add SSH key to the bitbucket account, NOT repo! 
- Select the Settings cog on the top navigation bar -> From the Settings dropdown menu, select Personal Bitbucket settings -> Under Security, select SSH keys
- git add remote git@bitbucket.org:generatorreferendow/e-petitions.git

2. Work with node.js
npm init -y # to set up nodejs project from scratch
npm install -g nodemon # to reload automatically changes to server.js etc.

3. Work with AWS
aws lambda update-function-code --function-name e-petitions --zip-file fileb://e-petitions-api.zip # to upload Lambda code to the exsiting 'e-petitions' lambda
