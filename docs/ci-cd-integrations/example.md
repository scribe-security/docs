---
sidebar_position: 3
---

# Example

This is an example of how doc should look

Download the tool:
```bash
curl https://www.scribesecurity.com/getscribe | sh
```

Here's an example Github workflow with Scribe:  
```bash
name: Main
on:
  push:
    branches: [ main ]
    
env:
    scribe-clientid: ${{ inputs.clientid }}
    scribe-clientsecret: ${{ inputs.clientsecret }}

jobs:
  build:
    name: Generate cyclonedx json SBOM
    runs-on: ubuntu-latest
    steps:
      - uses: scribe-security/actions/gensbom/bom@master
      - name: Generate cyclonedx json SBOM
        with:
            target: 'busybox:latest'
            verbose: 2
```

...

Ideally, I would like to see a full explanation of GitHub actions workflow - where to go, what to do..
At the very least a full YAML file for a workflow with ```<missing_argument>``` where unknown input variables should go.
