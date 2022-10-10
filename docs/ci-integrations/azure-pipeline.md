---
sidebar_position: 6
sidebar_label: Azure Pipeline
---


# Azure Pipeline Task
Scribe offers images for evidence collecting and integrity verification using Gitlab CI. \
* Gensbom - bill of material generation tool
* Valint - validate supply chain integrity tool 

# Integration
1. Install Scribe Cli in azure pipeline from the marketplace 
2. Once installed you can start using that in your pipelines.
3. Add secrets to your prefered place
4. Add the ScribeInstall task
5. Add the ScribeCli task with the inputs you want

Given Bellow is an example of Azure pipeline yaml that you can use

```yaml
trigger:
- master
pool: test
container: scribesecurity/azure-task:latest
steps:
- task: ScribeInstall@0
- task: ScribeCli@0
  displayName: sbom stage
  inputs:
    command: 'bom' # Commands can be bom, report, verify
    target: 'dir:some-directory'
    contextType: 'jenkins'
    outputDirectory: '$(Build.ArtifactStagingDirectory)/scribe/gensbom'
    productKey: $(ProductKey)
    scribeClientId: $(ScribeClientId)
    scribeClientSecret: $(ScribeClientSecret)
- task: ScribeCli@0
  displayName: image-bom stage
  inputs:
    command: 'bom'
    target: 'mongo-express:1.0.0-alpha.4'
    contextType: 'jenkins'
    outputDirectory: '$(Build.ArtifactStagingDirectory)/scribe/gensbom'
    productKey: $(ProductKey)
    scribeClientId: $(ScribeClientId)
    scribeClientSecret: $(ScribeClientSecret)
- task: ScribeCli@0
  displayName: download-report stage
  inputs:
    command: 'report'
    contextType: 'jenkins'
    outputDirectory: '$(Build.ArtifactStagingDirectory)/scribe/valint'
    productKey: $(ProductKey)
    scribeClientId: $(ScribeClientId)
    scribeClientSecret: $(ScribeClientSecret)
- task: PublishBuildArtifacts@1 #once done you can publish the artifact so that you can access them
  displayName: 'Publish Artifact: drop'
  inputs:
    PathtoPublish: '$(build.artifactstagingdirectory)'
  condition: succeededOrFailed()
```


2. Please make sure you use secret variables for client id, client secret and prodyct key. To avoid revealing secrets.

## Scribe service integration
Scribe provides a set of services to store,verify and manage the supply chain integrity. \
Following are some integration examples.
Scribe integrity flow - upload evidence using `gensbom` and download the integrity report using `valint`. \
You may collect evidence anywhere in your workflows. 


<details>
  <summary>  Scribe integrity report - full gitlab ci workflow (binary) </summary>

```yaml
image: ubuntu:latest
variables:
  LOGIN_URL: https://scribesecurity-staging.us.auth0.com
  AUTH_AUDIENCE: api.staging.scribesecurity.com
  SCRIBE_URL: https://api.staging.scribesecurity.com
before_script:
  - apt update && apt install git
  - apt install git -y
  - curl -sSfL http://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin

stages:
    - test

test:
    stage: test
    script:
      - >-
        gensbom bom dir:mongo-express \
            --context-type jenkins \
            --output-directory ./scribe/gensbom \
            --product-key $PRODUCT_KEY \
            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
            --scribe.login-url $LOGIN_URL --scribe.auth.audience $AUTH_AUDIENCE --scribe.url $SCRIBE_URL \
            -vv
      - >-
        gensbom bom mongo-express:1.0.0-alpha.4 \
            --context-type jenkins \
            --output-directory ./scribe/gensbom \
            --product-key $PRODUCT_KEY \
            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
            --scribe.login-url $LOGIN_URL --scribe.auth.audience $AUTH_AUDIENCE --scribe.url $SCRIBE_URL \
            -vv
      - >-
        valint report \
            --product-key $PRODUCT_KEY \
            -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET --output-directory scribe/valint \
            --scribe.login-url $LOGIN_URL --scribe.auth.audience $AUTH_AUDIENCE --scribe.url $SCRIBE_URL \
            --timeout 120s \
            -vv

```
</details>

<details>
  <summary>  Scribe integrity report - full gitlab ci workflow (docker) </summary>
  
</details>

---

## Resources

[Gitlab CI Jobs Page](https://docs.gitlab.com/ee/ci/) - Github CI docs.