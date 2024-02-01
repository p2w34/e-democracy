## e-petitions

## e-petitions api

To prepare .zip file for AWS Lambda:
0. cd www/
1. npm install # creates node_modules/ based on package.json and package-lock.json files
2. zip -r e-petitions-api.zip .


## other
1. To use SSH, one has to add SSH key to the bitbucket account, NOT repo! 
- Select the Settings cog on the top navigation bar -> From the Settings dropdown menu, select Personal Bitbucket settings -> Under Security, select SSH keys
- git add remote git@bitbucket.org:generatorreferendow/e-petitions.git
