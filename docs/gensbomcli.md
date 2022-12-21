---
sidebar_position: 6
sidebar_label: Generating SBOM from CLI
---

# Generating SBOM from CLI 

The `gensbom` Command Line Interface (CLI) tool developed by Scribe, generates a [Software Bill of Materials (SBOM)](https://scribesecurity.com/sbom/ "Read About SBOMs") for Docker and Open Containers Images (OCI). 
You can call `gensbom` from your Continuous Integration (CI) pipeline after the build stage, or run it from a CLI on an image.

The `gensbom` tool runs on Mac or Linux.

**To generate an SBOM from a CLI:**

1. Get the Scribe `gensbom` CLI tool:  
    ```sh
    curl -sSfL http://get.scribesecurity.com/install.sh | sh -s -- -t gensbom    
    ```
2. Generate an SBOM:  
   ```sh
    gensbom <target>
   ```
   where <target\> is your Docker image.
        
    This creates a default SBOM in a CycloneDX JSON format. 
    For example:  
    ```sh
    gensbom bom alpine:latest
    ```
    creates the SBOM of image `alpine:latest` from Docker Hub.

    
### Finding SBOM file locations and renaming options
* An image name can be: `name:tag`, a file path, or a registry URL. 

**Defaults**
 * SBOM files will be under this directory: */tmp/scribe/registry/. 
 
    For example: the SBOM generated from an image named **alpine:latest** is at: /tmp/scribe/registry/alpine/latest
* The SBOM file name is the hash of the image.
* Result SBOM path format is as follows: *{target source}/{image name}/{image tag}*.

  For example: */tmp/scribe/registry/alpine/latest*.

**Changing defaults**       
* Change the default Output file name and path as follows:  
      `gensbom <target> [--output-file /path/file_name.json]`
      
* Change the output directory as follows:  
      `gensbom <target> [--output-directory /file_path]`
      
## Using Vairous Target (Image) locations
You can use the following image locations: 
### Docker images
* By default the image is retrieved by Docker on Docker Hub.  
  ```sh
  gensbom your_repo/your_image:tag
  ```

* To explicitly use the Docker daemon:  
  ```sh
  gensbom docker:your_repo/your_image:tag
  ```

* To use a local tarball created by `docker save`:  
  ```sh
  gensbom docker-archive:path/to/your_image.tar 
   ```  

### From local disk
* Use a tarball from your local disk for *OCI archives* (for example, Skopeo):  
  ```sh
  gensbom oci-archive:path/to/your_image.tar 
  ```  

* Read the image directly from a path on your local disk (any directory):  
  ```sh
  gensbom dir:path/to/your_project
  ```  

* Read directly from a path on disk (any single file):  
  ```sh
  gensbom file:path/to/your_project/file 
  ```

### Remote Registry
* Pull image directly from a registry:  
  ```sh
  gensbom registry:your_repo/your_image:tag
  ```  


