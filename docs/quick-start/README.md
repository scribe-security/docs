---
sidebar_label: "Quickstart"
title: Quickstarting with a basic example
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# **Get Started with a Simple Example**  

This guide provides a basic example of generating a **signed SBOM** and a **signed provenance document** for your builds using **Valint,** Scribe’s CI/CD agent.  

Valint enables you to:  
- Generate SBOMs  
- Collect security evidence  
- Perform integrity checks  
- Enforce security guardrails in your build pipelines  

## **1. Set Up Your Project**  
- Choose a **GitHub project** that builds container images, or fork our **[demo project](https://github.com/Scribe-public-demos/demo-project)** to get started quickly.  
- Using **GitLab, Azure Pipelines, or another CI platform?** Refer to [integration guides](https://scribe-security.netlify.app/docs/integrating-scribe/ci-integrations/).  

## **2. Generate a Scribe API Token**  
- Obtain your API token from **[Scribe Hub](https://app.scribesecurity.com/account/tokens?modal=openCreateTokenModal)**.  
- Add it to your **GitHub secrets** as **`SCRIBE_API_TOKEN`** following [GitHub's documentation on secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository).  

## **3. Modify Your Image Build Workflow**  
Add the following steps to your existing **GitHub Actions workflow** (e.g., `build-image.yaml`):  

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

### **Notes:**  
- Replace **`your-image:tag`** with your actual Docker image name and tag, such as `my-app:latest`.  
- This workflow can also be triggered manually in GitHub Actions. More details are available in [GitHub's documentation](https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/manually-running-a-workflow).  

## **4. View Your SBOM & Analysis, and SLSA Provenance**  
- Go to **[Scribe Hub → Products](https://app.scribesecurity.com/producer-products)**.  
- Select your product to review the **SBOM, security insights, and SLSA provenance** (available under the **Evidence** tab).  

---

# **Continue with a Discovery Example**  

This example runs a **discovery process** on your GitHub organization to map assets and security posture.  

The workflow is available on GitHub: **[GitHub Discovery Workflow](https://github.com/scribe-public/reusable-workflows/blob/main/.github/workflows/github-discovery-101)**  

### **Steps to Run the Discovery Workflow:**  
1. Replace **`<your-github-org>`** with your **GitHub organization name**.  
2. Provide **organization read permissions** to `GH_TOKEN` (your GitHub token).  
   - Generate a **Fine-Grained Personal Access Token (PAT)** with **read access** to `organization` and `repository metadata` in [GitHub Developer Settings](https://github.com/settings/tokens).  
   - More details are available in [GitHub's documentation](https://docs.github.com/en/enterprise-cloud@latest/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#managing-pat-access-to-your-organization).  

```yaml
name: Github-Discovery-101

env:
  GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
  ORG_NAME: <your-github-org>
  SCRIBE_PRODUCT_NAME: Hello-GitHub-Discovery
  SCRIBE_PRODUCT_VERSION: "1.0.1"
  SCRIBE_TOKEN: ${{ secrets.SCRIBE_API_TOKEN }}
  LOG_LEVEL: DEBUG
  db.local.store_policy: replace
  valint.scribe.client-secret: ${{ secrets.SCRIBE_API_TOKEN }}

on:
  workflow_dispatch:

concurrency: 
  group: build-in-${{ github.ref }}
  cancel-in-progress: true

jobs:
  GitHub-Discovery:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Find five most recently active repos
        run: |
          curl -s -H "Authorization: token $GITHUB_TOKEN" \
          "https://api.github.com/orgs/$ORG_NAME/repos?sort=updated&per_page=5" | jq -r '.[].full_name' > repo_list.txt   
          cat repo_list.txt
          repo_scope="--repository.mapping "
          while IFS= read -r repo; do
          repo_scope+="$repo::$SCRIBE_PRODUCT_NAME::$SCRIBE_PRODUCT_VERSION "
          done < repo_list.txt
          echo "REPO_SCOPE="$repo_scope >> $GITHUB_ENV
          
      - name: Generate a signed deliverable SBOM
        uses: scribe-security/action-bom-cli@master
        with:
          target: 'git:.'
          product-key: ${{ env.SCRIBE_PRODUCT_NAME }}
          product-version: ${{ env.SCRIBE_PRODUCT_VERSION }} 
          scribe-client-secret: ${{ env.SCRIBE_TOKEN }}
          components: commits,packages,files,dep
          format: attest

      - name: GitHub Discover
        uses: scribe-security/action-platforms@master
        with:
          command: discover
          platform: github
          args:
           --${{ env.REPO_SCOPE }}
           --token=${{ env.GITHUB_TOKEN }}
           --url=https://api.github.com 
           --scope.organization=${{ env.ORG_NAME }} 
           --commit.skip 
           --scope.branch=main 
           --workflow.skip
           --organization.mapping=scribe-security::$SCRIBE_PRODUCT_NAME::$SCRIBE_PRODUCT_VERSION 
```

---

# **Next Steps**  

Additional guides for securing and managing your software supply chain:  
- **[Managing SBOMs & Vulnerabilities](../../guides/manag-sbom-and-vul)**  
- **[Securing Software with SLSA Framework](../../guides/secure-sfw-slsa)**  
- **[Enforcing SDLC Policies](../../guides/enforcing-sdlc-policy)**  
- **[Achieving SSDF Compliance](../../guides/ssdf-compliance)**  
- **[Securing Your Builds](../../guides/securing-builds)**  
