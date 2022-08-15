---
sidebar_position: 3
---

# Other CI Systems

In order to integrate our tools into any other CI pipeline you'll need to download *gensbom*. Once you have it you can implement its CLI commands in any any pipeline you want.

## Set Credentials
In order for the integration to work you must first set the secrets provided for you at the <a href='https://beta.hub.scribesecurity.com'>'add project'</a> page in your environment / credential store. Of the provided secrets, `client-id` and `client-secret` are identical for all your future projects and `product-key` is unique for this particular project only.

Here's an example for setting your `client-id` credential:
```
CLIENT_ID=<client_id>
```
Instead of `<client_id>` enter the `client-id` credential downloaded from the <a href='https://beta.hub.scribesecurity.com'>'add project'</a> page.

## Get the *SBOMs* 

You can use this command to download *gensbom*

```
curl -sSfL https://raw.githubusercontent.com/scribe-security/misc/master/install.sh | sh
```

## Get the *SBOMs* 

Generate an *SBOM* for your source code. The credentials can be copied from the <a href='https://beta.hub.scribesecurity.com'>'add project'</a> page.


```bash
gensbom bom dir:<path> --scribe.client-id=CLIENT_ID -P --scribe.client-secret=CLIENT_SECRET --product-key=PRODUCT_KEY -E -f -v
```

Generate an *SBOM* for your final image.

```bash
gensbom bom <your_docker_repository:tag> --scribe.client-id=CLIENT_ID -P --scribe.client-secret=CLIENT_SECRET --product-key=PRODUCT_KEY -E -f -v
```

And that's it - once these two steps finished you can go to the project page on Scribe Hub and examine the integrity report.