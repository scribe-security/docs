---
sidebar_position: 3
---

# Other CI Systems

In order to integrate our tools into any other CI pipeline you'll need to download the two tools, gensbom and valint. Once you have the tools you can implement their CLI commands in any any pipeline you want.

## Download the tools

You can use this command to download both the gensbom tool and the valint tool

```
curl -sSfL https://raw.githubusercontent.com/scribe-security/misc/master/install.sh | sh
```

## Get the *SBOMs* 

Generate an *SBOM* for your source code. The credentials can be copied from your <a href='https://mui.production.scribesecurity.com/install-scribe'>CLI page</a>.


```bash
gensbom bom dir:<path> --scribe.clientid=****** -P --scribe.clientsecret=****** --name=scribe -E -f -v
```

Generate an *SBOM* for your final image.

```bash
gensbom bom <your_docker_repository:tag> --scribe.clientid=****** -P --scribe.clientsecret=****** --name=scribe -E -f -v
```

## Get the integrity report 

In this example the report will be downloaded into 'scribe/valint'. The credentials can be copied from your <a href='https://mui.production.scribesecurity.com/install-scribe'>CLI page</a>.

```
valint report -U \
 --scribe.clientid=****** -P --scribe.clientsecret=****** --output-directory scribe/valint -v
```