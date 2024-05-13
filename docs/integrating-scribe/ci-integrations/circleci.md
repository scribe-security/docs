---
sidebar_label: "CircleCI"
title: CircleCI
sidebar_position: 5
---

Use the following instructions to integrate your CircleCI with Scribe.

### 1. Obtain a Scribe Hub API Token
1. Sign in to [Scribe Hub](https://app.scribesecurity.com). If you don't have an account you can sign up for free [here](https://scribesecurity.com/scribe-platform-lp/ "Start Using Scribe For Free").

2. Create a Scribe Hub API token [here](https://app.scribesecurity.com/settings/tokens). Copy it to a safe temporary notepad until you complete the integration </br>
**Note** the token is a secret and will not be accessible from the UI after you finalize the token generation. 

### 2. Add the API token to the CircleCI secrtes
Add the Scribe Hub API token as SCRIBE_TOKEN to your CircleCI environment by following the [CircleCI environment variables instructions](https://circleci.com/docs/env-vars#setting-an-environment-variable-in-a-project "CircleCI embedding environment variables instructions")
<img src='/img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>
### 3. Install Scribe CLI and usage

**Valint** -Scribe CLI- is required to generate evidence in such as SBOMs and SLSA provenance. 
Installation instructions and usage examples can be found on the [Scribe Security Orb page](https://circleci.com/developer/orbs/orb/scribe-security/orbs)
