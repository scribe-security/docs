---
sidebar_label: "Demo Project"
title: Demo Project
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 5
---

### Using Scribe on a Sample Project

This is a demo deployment of Scribe on a sample git project consisting of a source code repository and a simple CI pipeline implemented using Git workflows. Running the provided workflow will demonstrate how to use Scribe’s tools to generate signed evidence (AKA attestations) from 3 stages of the CI pipeline.
	@@ -24,11 +16,13 @@ The evidence created will be uploaded to the Scribe SaaS platform, and allow the

To run the demo you need to:

1. Login to your GitHub account.

2. Clone the **[demo repo](https://github.com/Scribe-public-demos/demo-project "demo repo")** (this repo contains a simple ‘Hello-World’ app - an NPM based web server).  

3. Create a [Scribe Hub API Token] (https://app.scribesecurity.com/settings/tokens). Note that this token is secret and will not be accessible from the UI after you finalize the token generation. YOu should copy it to a safe temporary notepad until you finish this demo.

4. Create a new secret for your cloned repo, and set its value to the Scribe Hub API token value. 

   - On GitHub.com, navigate to the main page of the repository.

	@@ -40,24 +34,24 @@ To run the demo you need to:

   - At the top of the page, click `New repository secret`.

   - Type `CLIENT_SECRET` as name for your secret in the `Name` input box.

   - Enter the value for your secret.

   - Click `Add secret`.

5. You can now run a workflow to create an attestation of the last version committed and pushed to Git. This attestation represents the 'source of truth' regarding the project's source code. Once you have created and stored this attestation it is quite difficult for a potential adversary to tamper with the code anywhere down the pipeline. In the demo project page, go to Actions.  
Click ‘I understand my workflows, go ahead and enable them’.

   <img src='../../../img/ci/understand_workflows.jpg' alt='I understand my workflows' width='70%'/>

You will be redirected to the 'Actions' tab:   

   <img src='../../../img/ci/demo-project-actions.jpg' alt='demo-project-actions'/>  

   From the actions available on the left panel select *`Create signed git commit sbom`* and click `Run workflow`.  Once the workflow finished executing, a signed attestation (an SBOM) has been generated and automatically uploaded to your Scribe Hub account.

6. At this point you can run the build pipeline - build the project and containerize it. You can do this by running the *`Create signed git clone and signed image SBOMs`* workflow. As the name suggests, this workflow will generate a signed SBOM of the git repo cloned into the pipeline and another signed SBOM of the final built docker image.
   
### Quick tour of the Scribe Hub

The first page you see when you log into your **[Scribe Hub](https://scribehub.scribesecurity.com/ "Scribe Hub Link")** is your **products** page.

<img src='../../../img/start/products-start.jpg' alt='Products page'/>

Even if you have never used Scribe before you'd still be able to see a demo project. Since you have just run the sample project's workflows, running a pipeline, generating evidence, and uploading it to Scribe, you'll see your new project under the default demo project.

The **products** page shows you your products along with some basic information: How many subscribers have you added to this product, when the latest version of it was created (the last pipeline run), how many components were identified in the project, if the source code integrity was verified or not, how many high (or higher) vulnerabilities were identified, and how the project stands in terms of compliance to the SSDF and SLSA frameworks.

Clicking on a product will show you all the product's builds and their information:

<img src='../../../img/start/builds-start.jpg' alt='Product builds page'/>

For each build you can see its version ID, all of its components, the build date, if the source code integrity was verified or not, the number and severity of vulnerabilities, whether each component was signed or not, and whether the build was published. You also have a link to each component's repository URL.

for more information click on any of the builds and you'll get to the build dashboard:

<img src='../../../img/start/dashboard-start.jpg' alt='Product build dashboard page'/>

The dashboard is your main access to see this build's **[reports](../scribe-hub-reports/)**. You can see a summary of the build's compliance information to each of the frameworks, you can see a summary of the vulnerability information, and you can see the integrity validation information.

### Where to go next
* To learn more about what you can see, learn, and access about your build and your product look at the **[reports guide](../scribe-hub-reports/)** section.
* To learn how to create and manage SBOMs and vulnerabilities go to this **[guide](../guides/manag-sbom-and-vul)**.
* To learn about Scribe's use of the SLSA framework go to this **[guide](../guides/secure-sfw-slsa)**.
* To learn about enforcing SDLC policies go to this **[guide](../guides/enforcing-sdlc-policy)**.
* To learn how to achieve SSDF compliance go to this **[guide](../guides/ssdf-compliance)**.
* To learn how to secure your builds go to this **[guide](../guides/securing-builds)**.
