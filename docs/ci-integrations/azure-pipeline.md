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


## Resources

[Azure Task Page](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/?view=azure-devops) - Azure Pipeline Task docs.
