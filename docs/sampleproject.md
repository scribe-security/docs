---
sidebar_position: 5
sidebar_label: Sample Project
---

# Demo: Run valint on a Sample project
<!--- problem -  offer a demo to try out, assuming the person has a product?  --->
## Before you begin

Integrating Scribe Hub with your environment requires the following credentials that are found in the **Integrations** page. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **integrations**)

* **Client ID**
* **Client Secret**

<img src='../../../img/ci/integrations-secrets.jpg' alt='' width='70%' min-width='400px'/>

## Run Valint on a Sample Project

Try out Scribe with our sample open-source Node.js project by following these steps: 

1. Go to `https://github.com/scribe-security/image-demo`.


2. Set the following keys with the corresponding credential values obtained from Scribe as environment variables:  
   ```js
   export CLIENT_ID=<client_id>
   export CLIENT_SECRET=<client_secret>
   ```
   
3. Using a Shell-based CLI, download the `valint` CLI tool, created by Scribe:
   ```sh
   curl -sSfL https://get.scribesecurity.com/install.sh  | sh -s -- -t valint
   ```
   <img src='../../img/ci/valint-cli-download.jpg' alt='Valint CLI download' width='80%' min-width='400px'/>
4. Clone the sample project from GitHub  
      ```sh
      git clone https://github.com/scribe-security/image-demo.git
      ```
      <img src='../../img/ci/valint-cli-git-clone.jpg' alt='Git Clone' width='80%' min-width='400px'/>

5. Run `valint` locally to collect hash value evidence of the source code files

      ```sh
      $HOME/.scribe/bin/valint bom dir:image-demo --scribe.client-id=$CLIENT_ID \
      --scribe.client-secret=$CLIENT_SECRET -E -f -v
      ```
      <img src='../../img/ci/CLI-SBOM-write.jpg' alt='Collect hash value evidence of the source code files' width='80%' min-width='400px'/>

6. Build a Docker image for the project  
   ```sh
   cd image-demo
   docker build -t image-demo .
   ```
   <img src='../../img/ci/CLI-build-docker.jpg' alt='Build a Docker image for the project' width='80%' min-width='400px'/>

7. Run `valint` locally to collect hash value evidence about your docker image

    ```sh
    $HOME/.scribe/bin/valint bom image-demo:latest --scribe.client-id=$CLIENT_ID \
    --scribe.client-secret=$CLIENT_SECRET -E -f -v  
    ```
   <img src='../../img/ci/CLI-SBOM-write-2.jpg' alt='Collect hash value evidence about your docker image' width='80%' min-width='400px'/>

8. When `valint` is done, check out your your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** **products** page, find the product you have just updated and click on it. You'll see a new build being updated. Clicking on that build will allow you to review the integrity information and SBOM for the new build you have just uploaded.
