---
sidebar_position: 3
---

# Other CI Systems

In order to integrate our tools into any other CI pipeline you'll need to download *gensbom*. Once you have it you can implement its CLI commands in any any pipeline you want.

## Download *gensbom*

You can use this command to download *gensbom*

```
curl -sSfL http://get.scribesecurity.com/install.sh | sh
```

## Get the *SBOMs* 

Generate an *SBOM* for your source code. The credentials can be copied from the <a href='https://beta.hub.scribesecurity.com/producer-products'>'add project'</a> page.


```bash
gensbom dir:<path> --scribe.clientid=****** -P --scribe.clientsecret=****** --scribe.projectkey=****** -E -f -v
```

Generate an *SBOM* for your final image.

```bash
gensbom <your_docker_repository:tag> --scribe.clientid=****** -P --scribe.clientsecret=****** --scribe.projectkey=****** -E -f -v
```

And that's it - once these two steps finished you can go to the project page on Scribe Hub and examine the integrity report.