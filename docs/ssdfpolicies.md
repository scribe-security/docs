---
sidebar_position: 13
sidebar_label: Scribe Hub SSDF Policies
---

# Scribe Hub SSDF Policies

The Secure Software Development Framework (SSDF) outlines some of the fundamental practices you should follow to ensure the security of the software you’re building. The SSDF is based on standard software development security practices established by the National Institute of Standards and Technology (NIST) and explicitly addresses security issues in software development. The SSDF version 1.1 is defined in [NIST SP 800-218](https://scribesecurity.com/blog/ssdf-nist-800-218-final-version-differences-from-the-draft-and-their-implications-for-you/ "SSDF (NIST 800-218) final version – differences from the draft and their implications for you") publication. The framework was initially published in September of 2021 as a draft version. On March 22, 2021, NIST released the final version of the SSDF 1.1. All the high-level practices and tasks remained the same with a lot of the differences centered around the various examples provided. In deciding which practices to implement, NIST recommends balancing risk against cost, feasibility, and applicability. 

The Scribe Hub allows producers to collect relevant SSDF information about their pipelines in the form of a series of policies. You can choose to enact these policies on your pipeline and check whether the policy has passed or failed. If you see that all policies have passed that is equivalent to conforming to __SSDF__. To learn about how to enact the SSDF policy on your product check out [this page](../docs/ci-integrations/github#connecting-scribeapp-to-your-organizational-github-account).

### Ensure any change to code receives approval of two strongly authenticated users 
This policy checks that every code change is reviewed and approved by two authorized contributors who are both strongly authenticated, from the team relevant to the code change.

### Ensure previous approvals are dismissed when updates are introduced to a code change proposal 
This policy checks that when a proposed code change is updated, previous approvals are declined and new approvals are required.

### Ensure that there are restrictions on who can dismiss code change reviews 
This policy checks that only trusted users should be allowed to dismiss code change reviews.

### Ensure code owners are set for extra sensitive code or configuration
This policy checks that code owners are trusted users that are responsible for reviewing and managing an important piece of code or configuration. An organization is advised to set code owners for every extremely sensitive code or configuration.

### Ensure inactive branches are reviewed and removed periodically 
This policy checks that you keep track of code branches that are inactive for a lengthy period of time and periodically remove them.

### Ensure all checks have passed before the merge of new code
This policy checks that before a code change request can be merged to the code base, all predefined checks must successfully pass.

### Ensure open git branches are up to date before they can be merged into codebase
This policy checks that the organization makes sure each suggested code change is in full sync with the existing state of its origin code repository before allowing merging.

### Ensure all open comments are resolved before allowing to merge code changes 
This policy checks that the organization enforces a “no open comments” policy before allowing code change merging.

### Ensure verifying signed commits of new changes before merging 
This policy checks that every commit in a pull request is signed and verified before merging.

### Ensure linear history is required 
Linear history is the name for Git history where all commits are listed in chronological order, one after another. Such history exists if a pull request is merged either by rebase merge (reorders the commits history) or squash merge (squashes all commits to one). This policy checks that linear history is present by requiring the use of rebase or squash merge when merging a pull request.

### Ensure branch protection rules are enforced on administrators 
This policy checks that administrators are subject to branch protection rules.

### Ensure pushing of new code is restricted to specific individuals or teams 
This policy checks that only trusted users can push or merge new code to protected branches.

### Ensure force pushes code to branches is denied 
The “force push” option allows users with “push” permissions to force their changes directly to the branch without a pull request. This policy checks that this option is disabled.

### Ensure branch deletions are denied 
This policy checks that users with only push access are incapable of deleting a protected branch.

### Ensure all public repositories contain a SECURITY.md file 
A SECURITY.md file is a security policy file that offers instruction on reporting security vulnerabilities in a project. This policy checks that when someone creates an issue within a specific project, a link to the SECURITY.md file will subsequently be shown.

### Ensure repository creation is limited to specific members 
This policy checks that the ability to create repositories is limited to trusted users and teams.

### Ensure repository deletion is limited to specific members 
This policy checks that only a limited number of trusted users can delete repositories rather than all users.

### Ensure issue deletion is limited to specific members 
This policy checks that only trusted and responsible users can delete issues.

### Ensure inactive users are reviewed and removed periodically 
This policy checks that inactive user accounts are tracked and periodically removed from the organization.

### Ensure minimum number of admins are set for the organization
This policy checks that the organization has a minimum number of administrators (the smallest possible number).

### Ensure the organization is requiring members to use MFA 
This policy checks that members of the organization are using Multi-Factor Authentication (MFA) in addition to a standard user name and password when authenticating to the source code management platform.

### Ensure 2 admins are set for each repository 
This policy checks that every repository has two users with administrative permissions.

### Ensure strict base permissions are set for repositories 
Base permissions define the permission level automatically granted to all organization members. This policy checks that strict base access permissions are defined for all of the repositories in the organization, including new ones.

### Ensure an organization’s identity is confirmed with a Verified badge 
This policy checks that the domains an organization owns are confirmed with a “Verified” badge.

### Ensure all build steps are defined as code
This policy checks that the organization uses pipeline as code for build pipelines and their defined steps.

### Ensure access to the build process’s triggering is minimized 
This policy checks that access to pipeline triggers is restricted.

### Ensure pipelines are automatically scanned for vulnerabilities 
This policy checks that pipelines are periodically and automatically scanned for misconfigurations. 

### Ensure scanners are in place to identify and prevent sensitive data in pipeline files
This policy checks that sensitive data, such as confidential ID numbers, passwords, etc. is not present in pipelines.

### Ensure all external dependencies used in the build process are locked 
External dependencies may be public packages needed in the pipeline, or perhaps the public image being used for the build worker. This policy checks that external dependencies in every build pipeline are locked.

### Ensure pipeline steps produce an SBOM 
An SBOM is a file that specifies each component of software or a build process. This policy checks that an SBOM is generated after each run of a pipeline.

### Ensure dependencies are pinned to a specific, verified version 
This policy checks that dependencies are pinned to a specific version. Avoid using the “latest” tag or broad version.

### Ensure packages are automatically scanned for known vulnerabilities 
This policy checks that every package is automatically scanned for vulnerabilities.

### Ensure packages are automatically scanned for license implications
A software license is a document that provides legal conditions and guidelines for the use and distribution of software, usually defined by the author. This policy checks that each package is automatically scanned for any legal implications.

### Ensure user’s access to the package registry utilizes MFA 
This policy checks that Multi-Factor Authentication (MFA) is enforced for user access to the package registry.

### Ensure anonymous access to artifacts is revoked 
This policy checks that anonymous access to artifacts is disabled.

### Ensure webhooks of the package registry are secured 
This policy checks that secured webhooks of the package registry are used.
