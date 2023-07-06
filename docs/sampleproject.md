---
sidebar_position: 5
sidebar_label: Sample Project
---

# Demo: Try Scribe on a sample Git Project
<!--- problem -  offer a demo to try out, assuming the person has a product?  --->
## Before you begin

Integrating Scribe Hub with your environment requires the following credentials that are found in the **Integrations** page. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **integrations**)

* **Client ID**
* **Client Secret**

<img src='../../../img/ci/integrations-secrets.jpg' alt='' width='70%' min-width='400px'/>

## Using Scribe on a Sample Project

This is a demo deployment of Scribe on a sample git project consisting of a source code repository and a simple CI pipeline implemented using Git workflows. Running the provided workflow will demonstrate how to use Scribe’s tools to generate signed evidence (AKA attestations) from 3 stages of the CI pipeline.

The evidence created will be uploaded to the Scribe SaaS platform, and allow the platform to validate the integrity of the build, provide a detailed SBOM of the build, scan the build for vulnerabilities, and map the licenses of the software components used in the build. The only pre-requisite for running the demo is a personal GitHub account and a Scribe Hub account. If you don’t have such a GitHub account you can create one **[here](https://github.com/ "github.com")**.

To run the demo you need to:

1. login to your GitHub account.

2. clone the **[demo repo](https://github.com/Scribe-public-demos "demo repo")** (the repo contains a simple ‘Hello-World’ app - an NPM based web server).  

3. Define two new secret variables to be used with the workflows: a `Client ID` and a `Client secret`.  To do that go to settings→ Secrets and variables → Actions→ New repository secret.

   - On GitHub.com, navigate to the main page of the repository.

   - Under your repository name, click `Settings`. If you cannot see the `Settings` tab, select the dropdown menu, then click `Settings`.

      <img src='../../../img/ci/github-settings.jpg' alt='github-settings' width='90%'/>

   - In the `Security` section of the sidebar, select `Secrets and variables`, then click `Codespaces`.

   - At the top of the page, click `New repository secret`.

   - Type a name for your secret in the `Name` input box. you need to add 2 secrets, `CLIENT_ID` and `CLIENT_SECRET`.

   - Enter the value for your secret. In both cases the secret value was the one you get from your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** **Integrations** page.

   - Click `Add secret`.

4. You can now run a workflow to create an attestation of the last version committed and pushed to Git. This attestation represents the 'source of truth' regarding the project's source code. Once you have created and stored this attestation it is quite difficult for a potential adversary to tamper with the code anywhere down the pipeline. In the demo project page, go to Actions.  
Click ‘I understand my workflows, go ahead and enable them’. 

   <img src='../../../img/ci/demo-project-actions.jpg' alt='demo-project-actions' width='90%'/>  

   From the actions available on the left panel select *`Create signed git commit sbom`* and click `Run workflow`.  Once the workflow finished executing, a signed attestation (an SBOM) has been generated and automatically uploaded to your Scribe Hub account.

5. At this point you can run the build pipeline - build the project and containerize it. You can do this by running the *`Create signed git clone and signed image SBOMs`* workflow. As the name suggests, this workflow will generate a signed SBOM of the git repo cloned into the pipeline and another signed SBOM of the final built docker image.  

   Both attestations will be uploaded to your Scribe Hub account. Now you can view the project details on the **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** **products** page of your Scribe Hub account.

<!--- 
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
--->