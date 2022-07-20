---
sidebar_position: 1
---

# GitHub Actions

Scribe includes 2 elements in this action:  
*gensbom* - the tool creating the *SBOM* and
*valint* - the tool getting the report.

Both tools have other capabilites and CLI option but the simplest integration is to call  
*gensbom* to create an *SBOM* of the repository and the final image and then, call *valint*  
to get Scribe's integrity report of the result.

Use default configuration path `.gensbom.yaml` to make sure you have set all the input parameters you need.  
At minimum, you need to set the scribe `clientid` and `clientsecret`.  

These credentials can be copied from your <a href='https://mui.production.scribesecurity.com/install-scribe'>CLI page</a>.

```yaml
  scribe-clientid: <scribe-client-id>
    description: 'Scribe client id' 
  scribe-clientsecret: <scribe-access-token>
    description: 'Scribe access token' 
```

Here's usage example for generating an SBOM in GitHub workflow:
```bash
- name: Generate cyclonedx json SBOM
  uses: scribe-security/actions/gensbom/bom@master
  with:
    target: '<target_name:tag>'
    verbose: 2
```
In order to get a valid integrity report you should create 2 *SBOMs*, 1 for your repository source code, and 1 for your final image.
The created *SBOMs* are automatically uploaded to Scribe's backend for integrity analysis.

Here's usage example for calling Scribe's report in GitHub workflow:
```bash
- name: Valint - download report
  id: valint_report
  uses: scribe-security/actions/valint/report@master
  with:
      verbose: 2
      scribe-enable: true
      scribe-clientid: ${{ inputs.clientid }}
      scribe-clientsecret: ${{ inputs.clientsecret }}
```
