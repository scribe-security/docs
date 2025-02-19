---
sidebar_label: "GitHub"
title: Setting up an integration in GitHub
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 5
---

### Steps to integrate your GitHub repository with Scribe Hub
This is a basic example of generating a **signed SBOM** and a **signed provenance document** for your builds using **Valint,** Scribe’s CI/CD agent. Valint enables you to **generate SBOMs, collect security evidence, perform integrity checks, and enforce security guardrails** in your build pipelines.
1. Set Up Your Project
   * Choose a GitHub project that builds container images, or fork our [demo project](https://github.com/Scribe-public-demos/demo-project) to get started quickly.  
  *(Using GitLab, Azure Pipelines, or another CI platform?*  [See here](https://scribe-security.netlify.app/docs/integrating-scribe/ci-integrations/))
2. Generate a Scribe API Token
   * Get your API token [here](https://app.scribesecurity.com/account/tokens?modal=openCreateTokenModal)**.**  
   * Add it to your GitHub secrets as **SCRIBE\_API\_TOKEN** (See how in [GitHub documentation](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository).)
3. Modify Your Image Build Workflow
  Add this step to your existing **GitHub Actions workflow** (e.g., **build-image.yaml**):
  ```yaml
  - name: Generate signed SBOM for Docker image  
    uses: scribe-security/action-bom@master  
    permissions:
      contents: read
      id-token: write  # Required for Sigstore signing  
    with:
      target: your-image:tag  # Replace with your actual image name and tag  
      product-key: My-Product  
      product-version: 1.0.0  
      scribe-client-secret: ${{ secrets.SCRIBE_API_TOKEN }}  
      format: attest

  - name: Generate signed SLSA Provenance for Docker image  
    uses: scribe-security/action-slsa@master  
    permissions:
      contents: read
      id-token: write  # Required for Sigstore signing  
    with:
      target: your-image:tag  # Replace with your actual image name and tag  
      product-key: My-Product  
      product-version: 1.0.0  
      scribe-client-secret: ${{ secrets.SCRIBE_API_TOKEN }}  
      format: attest  
  ```
  ✅ Replace **your-image:tag** with your actual Docker image name and tag (e.g., **my-app:latest**).
  
  💡 You can also **trigger this manually** by creating a **GitHub Actions workflow**. See the [GitHub documentation](https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/manually-running-a-workflow).
4. View Your SBOM & Analysis
  Go to [Products](https://app.scribesecurity.com/producer-products) in Scribe Hub and select your product to review the **SBOM and security insights**.

### Where to go next
* To learn how to create and manage SBOMs and vulnerabilities go to this **[guide](../../guides/manag-sbom-and-vul)**.
* To learn about Scribe's use of the SLSA framework go to this **[guide](../../guides/secure-sfw-slsa)**.
* To learn about enforcing SDLC policies go to this **[guide](../../guides/enforcing-sdlc-policy)**.
* To learn how to achieve SSDF compliance go to this **[guide](../../guides/ssdf-compliance)**.
* To learn how to secure your builds go to this **[guide](../../guides/securing-builds)**.



