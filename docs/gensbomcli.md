---
sidebar_position: 5
---

# How to generate an SBOM from CLI

Scribe's *gensbom* CLI tool generates an SBOM for docker images and OCI images. You can call *gensbom* from your CI pipeline after the build stage, or run it from a bash shell and point it to an image in your registry..  

*gensbom* runs on Mac or Linux.

1. Get Scribe *gensbom* CLI tool  
```curl -sSfL http://get.scribesecurity.com/install.sh | sh```

2. Generate an *SBOM*  
```gensbom <target>```  
```<target>``` is the docker image: *name:tag, file path, or registry URL*  
This creates a default SBOM in a CycloneDX JSON format. For example:  
```gensbom alpine:latest```  
creates the SBOM of image *alpine:latest* from Dockerhub. The SBOM is found by default under ```/tmp/scribe/registry/alpine/latest```  

<br/>  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;By default, the SBOM file name is the hash of the image. You change the output file path and name as follows:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```gensbom <target> [--output-file /path/file_name.json]```  

<br/>  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You can also change the output directory as follows:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```gensbom <target> [--output-directory /file_path]```  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SBOMs path format is as follows: ```{target source}/{image name}/{image tag}```
For example:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```/tmp/scribe/registry/alpine/latest```

# Examples   

### Target (image) locations:

```gensbom yourrepo/yourimage:tag```    
By default the image is retrieved by dockerd on dockerhub.  

Explicitly use the *Docker* daemon:  
```gensbom docker:yourrepo/yourimage:tag ```  

Use a local traball created by "docker save":  
```gensbom docker-archive:path/to/yourimage.tar ```  

Use a tarball from your local disk for *OCI archives* (for example, Skopeo):  
```gensbom oci-archive:path/to/yourimage.tar ```  

Read the image directly from a path on your local disk (any directory):  
```gensbom dir:path/to/yourproject```  

Pull image directly from a registry:  
```gensbom registry:yourrepo/yourimage:tag```  

Read directly from a path on disk (any single file):  
```gensbom file:path/to/yourproject/file ```

### Output SBOM locations

```gensbom alpine:latest --output-file /your_sboms/sample-sbom.json  ```  
```gensbom alpine:latest --output-directory /your_sboms```
