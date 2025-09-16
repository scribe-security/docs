---
sidebar_label: "Git Repositories"
title: Git Repositories
sidebar_position: 2
toc_min_heading_level: 2
toc_max_heading_level: 5
---

### Connecting ScribeApp to Your Organizational GitHub Account

To collect security policy information (SLSA and SSDF) from your GitHub pipeline you'll first need to install the Scribe GitHub app in your organizational GitHub account. You'll then need to add the relevant code snippet to your pipeline.

### Where to start

Before you connect to ScribeApp no security policy data will be included in your build version information. To start the integration visit your **[Scribe Hub account](https://scribehub.scribesecurity.com/ "Scribe Hub Link")**. On the left column go to the **integrations** option.

<!-- ![Scribe Integrations](/img/ci/scribe-beta-integrations-1.JPG) 

Once you click on **integrations** you'll get to a page that includes links to all possible environments you could integrate with Scribe Hub.
If you scroll down a bit you'd get to the **Source Control** section:

![Source Control](/img/ci/scribe-beta-source-control-integrations.JPG) 

To continue press the **connect** link designed to connect ScribeApp to your GitHub organization's account. That will lead you to a page like this:

![Install ScribeApp](/img/ci/install_scribeapp.jpg)

Choose the GitHub account you want to integrate the ScribeApp with. Make sure you have owner access to the account to allow the app integration.
Make sure the account is organizational - the integration won't work with a private account.

Once you have chosen the account you wish to integrate with ScribeApp GitHub will present the following window. 

![Install ScribeApp Integration](/img/ci/install_scribeapp_github.jpg)

Choose the access level you wish to grant ScribeApp. You can choose to allow it access to all repositories or just select repositories. Note that repositories that are not covered by the ScribeApp will not be able to produce the SLSA provenance. 

After reviewing the access granted to ScribeApp go ahead and approve it by pressing the big green button.

![Green button](/img/ci/green_button.jpg) 

Next, you'll be directed to GitHub to approve your access by inputting your password. 

![Approve access](/img/ci/approve_access.jpg)

As soon as you provide your password GitHub will handle everything else and redirect you back to the **integrations** page. Note that now there is a green checkmark next to the GitHub icon:

![Approve access](/img/ci/github_integrated.jpg)  -->

**Step 1:** Access Integrations Log in to Scribe Hub. Navigate to the left pane and click on "Integrations".

![Scribe Integrations](/img/start/integrations-start.JPG)

**Step 2:** Scroll down to find GitHub among the listed services. Select GitHub and click "Connect". 
        
**Step 3:** You will be redirected to GitHub. Sign in to your GitHub account, select the relevant GitHub organization account, and choose the appropriate repositories.

**Step 4:** Once done, you will be redirected back to Scribe Hub. From this point onwards, Scribe will automatically generate a SLSA and Software Supply Chain Assurance Framework (SSDF) compliance report for every build.

**Step 5:** Review Compliance Report To access these reports, navigate to "Products" in Scribe Hub, select the relevant product, choose the specific version, and click on the "Compliance" tab.

Once you integrated the ScribeApp with your organizational GitHub account all available security policies (SLSA, SSDF) will be running automatically every time you run a build. The SSDF policy does not require anything to run. To run the SLSA policy you'll need to add a code snippet to your pipeline and run the action.

If anything isn't clear you can check out the GitHub instruction page for **<a href='https://docs.github.com/en/developers/apps/managing-github-apps/installing-github-apps'>installing GitHub Apps</a>**.

### Scan SCM security configuration 

Scribe's **[GitGat](https://github.com/scribe-public/gitgat#readme)** is an open-source tool based on **[OPA](https://www.openpolicyagent.org/docs/latest/)** (Open Policy Agent) and leverages policies written in the Rego language, that evaluate the security posture of your GitHub account. This utility generates a report on your SCM account's security settings.

:::note
currently GitGat evaluates posture against the CIS software supply chain benchmark only.
:::

The following are the steps required to create an attestation of your GitHub account posture during a build run:

**Step 1:** Obtain your GitHub Personal Access Token with read permissions to your account.

**Step 2:** Once you have your token, the simplest way to run GitGat is through a Docker image. The following command, executed in your Unix Command Line Interface (CLI), will run GitGat on your repositories and create the report in your Gist:
```
docker run -e GH_TOKEN scribesecurity/gitgat:latest data.github.report.print_report 2> report.md
$HOME/.scribe/bin/valint bom report.md --scribe.client-id=$CLIENT-ID \
--scribe.client-secret=$SCRIBE_TOKEN -f -v
```

![GitGat run](/img/start/gitgat-1.JPG)

You can read more about **[here](https://github.com/scribe-public/gitgat#readme)** the GitGat full documentation here or view the **[free course](https://training.linuxfoundation.org/training/github-supply-chain-security-using-gitgat-lfd122x/)**.

