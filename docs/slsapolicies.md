---
sidebar_position: 11
sidebar_label: Scribe Hub SLSA Policies
---

# Scribe Hub SLSA Policies

The Supply chain Levels for Software Artifacts or SLSA (pronounced Salsa) is a security framework created by Google. It is a list of standards and controls meant to prevent tampering, improve file integrity, and secure packages and infrastructure in your projects, businesses, or enterprises. SLSA consists of common-sense security measures intended for embedding security throughout the development lifecycle. SLSA is meant to make it easier for the implementing organization to get information about its software source, build, and artifacts. At the same time, it’s meant to make it much harder for any malicious or threat actor, either within or outside of the organization, to make any unauthorized changes to files, processes, or artifacts.

You can read more about SLSA v0.2 [here](https://slsa.dev/provenance/v0.2 "SLSA Framework"). 

The Scribe Hub allows producers to collect relevant SLSA information about their pipelines in the form of a series of policies. You can choose to enact these policies on your pipeline and check whether the policy has passed or failed. If you see that all policies have passed that is equivalent to conforming to __SLSA level 3__. To learn about how to enact the SLSA policy on your product check out [this page](../docs/ci-integrations/github#generating-slsa-provenance).

### BuildAsCode 
This policy checks that the build definition and configuration executed by the build service is verifiably derived from text file definitions stored in a version control system.

Verifiably derived can mean either fetched directly through a trusted channel, or that the derived definition has some trustworthy provenance chain linking back to version control.

### SourceRetainedIndefinitely
This policy checks that this revision and its change history are preserved indefinitely and cannot be deleted, except when subject to an established and transparent policy for obliteration, such as a legal or policy requirement.

### ProvenanceAuthenticated
This policy checks that the provenance’s authenticity and integrity can be verified by the consumer. This SHOULD be through a digital signature from a private key accessible only to the service generating the provenance.

### BuildIsolated
This policy checks that the build service ensured that the build steps ran in an isolated environment free of influence from other build instances, whether prior or concurrent.

* It MUST NOT be possible for a build to access any secrets of the build service, such as the provenance signing key.
* It MUST NOT be possible for two builds that overlap in time to influence one another.
* It MUST NOT be possible for one build to persist or influence the build environment of a subsequent build.
* Build caches, if used, MUST be purely content-addressable to prevent tampering.

### ProvenanceNonFalsifiable
This policy checks that provenance cannot be falsified by the build service’s users.

* Any secret material used to demonstrate the non-falsifiable nature of the provenance, for example the signing key used to generate a digital signature, MUST be stored in a secure management system appropriate for such material and accessible only to the build service account.
* Such secret material MUST NOT be accessible to the environment running the user-defined build steps.
* Every field in the provenance MUST be generated or verified by the build service in a trusted control plane. The user-controlled build steps MUST NOT be able to inject or alter the contents, except as noted below.

### ProvenanceAvailable
This policy checks that the provenance is available to the consumer in a format that the consumer accepts. The format SHOULD be in-toto SLSA Provenance, but another format MAY be used if both producer and consumer agree and it meets all the other requirements.

### BuildScripted
This policy checks that all build steps were fully defined in some sort of “build script”. The only manual command, if any, was to invoke the build script.

### ProvenanceServiceGenerated
This policy checks that the data in the provenance was obtained from the build service (either because the generator is the build service or because the provenance generator reads the data directly from the build service).

Regular users of the service MUST NOT be able to inject or alter the contents, except as noted below.

### BuildEphemeralEnvironment
This policy checks that the build service has ensured that the build steps ran in an ephemeral environment, such as a container or VM, provisioned solely for this build, and not reused from a prior build.

### BuildService
This policy checks that all build steps ran using some build service, not on a developer’s workstation.

### SourceHistoryVerified
This policy checks that every change in the revision’s history has at least one strongly authenticated actor identity (author, uploader, reviewer, etc.) and timestamp. It must be clear which identities were verified, and those identities must use two-step verification or similar. 

### SourceVersionControlled
This policy checks that every change to the source is tracked in a version control system that meets the following requirements:

* __Change history__ There exists a record of the history of changes that went into the revision. Each change must contain: the identities of the uploader and reviewers (if any), timestamps of the reviews (if any) and submission, the change description/justification, the content of the change, and the parent revisions.

* __Immutable reference__ There exists a way to indefinitely reference this particular, immutable revision. In git, this is the {repo URL + branch/tag/ref + commit ID}.

Most popular version control system meet this requirement, such as git, Mercurial, Subversion, or Perforce.