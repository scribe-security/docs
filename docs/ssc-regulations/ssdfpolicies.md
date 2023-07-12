---
sidebar_position: 14
sidebar_label: Scribe Hub SSDF Policies
---

# Scribe Hub SSDF Policies

The Secure Software Development Framework (SSDF) outlines some of the fundamental practices you should follow to ensure the security of the software you’re building. The SSDF is based on standard software development security practices established by the National Institute of Standards and Technology (NIST) and explicitly addresses security issues in software development. The SSDF version 1.1 is defined in [NIST SP 800-218](https://scribesecurity.com/blog/ssdf-nist-800-218-final-version-differences-from-the-draft-and-their-implications-for-you/ "SSDF (SP 800-218) final version – differences from the draft and their implications for you") publication. The framework was initially published in September of 2021 as a draft version. On March 22, 2021, NIST released the final version of the SSDF 1.1. All the high-level practices and tasks remained the same with a lot of the differences centered around the various examples provided. In deciding which practices to implement, NIST recommends balancing risk against cost, feasibility, and applicability. 

The Scribe Hub allows producers to collect relevant SSDF information about their pipelines in the form of a series of policies. Once you connect the ScribeApp to your organizational GitHub account you'll get the SSDF policies checked for each of your builds automatically. You'll be able to check whether the policy has passed or failed. If you see that all policies have passed that is equivalent to conforming to __SSDF__. To learn about how to connect the ScribeApp to your organizational GitHub account check out [this page](../docs/ci-integrations/github#connecting-scribeapp-to-your-organizational-github-account). To learn more about the policies we chose to check you can check out [this page](https://www.cisecurity.org/insights/white-papers/cis-software-supply-chain-security-guide "CIS Software Supply Chain Security Guide").

### Ensure any change to code receives approval of two strongly authenticated users 
According to this policy, each code change must be approved by two strong authenticated authorized contributors from the team that will be affected by the change.

### Ensure previous approvals are dismissed when updates are introduced to a code change proposal 
This policy ensures that whenever a proposed code change is updated, any prior approvals are revoked and new ones are needed.

### Ensure that there are restrictions on who can dismiss code change reviews 
This policy makes sure that only dependable users are permitted to reject code change reviews.

### Ensure code owners are set for extra sensitive code or configuration
This policy verifies that the people in charge of reviewing and managing a crucial piece of code or configuration are trustworthy users. Every piece of sensitive code or configuration should, ideally, have a code owner.

### Ensure inactive branches are reviewed and removed periodically 
This policy verifies that you track inactive code branches and periodically delete them.

### Ensure all checks have passed before the merge of new code
This policy verifies that all predefined checks must be passed in order for a code change request to be merged into the code base.

### Ensure open git branches are up to date before they can be merged into codebase
This policy checks that before allowing merging, the organization must ensure that every suggested code change is fully in sync with the state of the original code repository.

### Ensure all open comments are resolved before allowing to merge code changes 
Before allowing code change merging, this policy verifies that the organization upholds a "no open comments" policy.

### Ensure verifying signed commits of new changes before merging 
Before merging, this policy ensures that each commit in a pull request is signed and verified.

### Ensure linear history is required 
Git history is referred to as linear history when every commit is listed one after another in chronological order. If a pull request is merged using rebase merge or squash merge, which reorders the commit history, such history will exist (squashes all commits to one). This policy requires the use of rebase or squash merge when merging a pull request to ensure that linear history is maintained.

### Ensure branch protection rules are enforced on administrators 
This policy verifies that branch protection regulations apply to administrators as well as to regular users.

### Ensure pushing of new code is restricted to specific individuals or teams 
This policy verifies that only reputable users are permitted to push or merge new code into secured branches.

### Ensure force pushes code to branches is denied 
Usually, users with "push" permissions can force their changes to the branch without submitting a pull request by using the "force push" option. This policy verifies that the option is off.

### Ensure branch deletions are denied 
The purpose of this policy is to ensure that users with only push access cannot remove a protected branch.

### Ensure all public repositories contain a SECURITY.md file 
A security policy file called SECURITY.md is meant to contain instructions on how to report security flaws in a project. This policy ensures that a link to the SECURITY.md file will be displayed when someone creates an issue within a project.

### Ensure repository creation is limited to specific members 
This policy verifies that only reputable teams and users are permitted to create repositories.

### Ensure repository deletion is limited to specific members 
This policy ensures that only a select group of trusted users — and not all users — can delete repositories.

### Ensure issue deletion is limited to specific members 
With this policy, only dependable and trustworthy users are permitted to delete issues.

### Ensure inactive users are reviewed and removed periodically 
This policy ensures that accounts for inactive users are monitored and routinely deleted from the organization.

### Ensure minimum number of admins are set for the organization
This rule verifies that the company has no more than the required number of administrators (the smallest possible number).

### Ensure the organization is requiring members to use MFA 
This policy verifies that users of the organization are authenticating to the source code management platform with Multi-Factor Authentication (MFA) in addition to a standard user name and password.

### Ensure 2 admins are set for each repository 
This policy verifies that every repository has two users with administrative privileges.

### Ensure strict base permissions are set for repositories 
The permission level that is automatically granted to all organization members is defined by base permissions. This policy verifies that all repositories in the organization, even brand-new ones, have strict base access permissions defined.

### Ensure an organization’s identity is confirmed with a Verified badge 
This policy verifies that a "Verified" badge is present on the domains that an organization owns.

### Ensure all build steps are defined as code
This policy verifies that the company uses code files (the type depends on the CI/CD platform used) as the source for build pipelines and the specified steps within them.

### Ensure access to the build process’s triggering is minimized 
This policy verifies the restrictions on pipeline trigger access.

### Ensure pipelines are automatically scanned for vulnerabilities 
This policy verifies that pipelines are automatically and routinely checked for configuration errors. 

### Ensure scanners are in place to identify and prevent sensitive data in pipeline files
This policy verifies that there are no sensitive pieces of data in pipelines, such as private ID numbers, passwords, access keys, etc.

### Ensure all external dependencies used in the build process are locked 
External dependencies could be a pipeline requirement for public packages or even the build worker's public image. This policy verifies that external dependencies are locked in each build pipeline.

### Ensure pipeline steps produce an SBOM 
An SBOM lists every part of software or a build process. This policy verifies the generation of an SBOM following each pipeline run.

### Ensure dependencies are pinned to a specific, verified version 
This policy verifies that dependencies are attached to a particular version. Avoid using the broad version or "latest" tag.

### Ensure packages are automatically scanned for known vulnerabilities 
This policy verifies that every package undergoes an automatic vulnerability scan.

### Ensure packages are automatically scanned for license implications
A software license is a written agreement that, typically as defined by the author, sets forth the terms and regulations for the use and distribution of software. This policy ensures that every package is instantly checked for any potential legal ramifications.

### Ensure user’s access to the package registry utilizes MFA 
The purpose of this policy is to verify that MFA (Multi-Factor Authentication) is used to restrict user access to the package registry.

### Ensure anonymous access to artifacts is revoked 
This policy verifies that artifacts cannot be accessed anonymously.

### Ensure webhooks of the package registry are secured 
This policy verifies that only the package registry's secured webhooks are being used.
