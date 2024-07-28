<p><a target="_blank" href="https://app.eraser.io/workspace/nhmxJe8KTjfdprsMUOQj" id="edit-in-eraser-github-link"><img alt="Edit in Eraser" src="https://firebasestorage.googleapis.com/v0/b/second-petal-295822.appspot.com/o/images%2Fgithub%2FOpen%20in%20Eraser.svg?alt=media&amp;token=968381c8-a7e7-472a-8ed6-4a6626da5501"></a></p>

## valint
Validate Supply Chain Integrity

### Synopsis
Command Line Interpreter (CLI) tool,that empowers supply chain stakeholders to ensure supply chain integrity, verify compliance, and generate and manage evidence.

### Optional flags
Flags for `valint` 

| Short | Long | Description | Default |
| ----- | ----- | ----- | ----- |
|  | --allow-expired | Allow expired certs |  |
|  | --attest.config | Attestation config path |  |
|  | --attest.default | Attestation default config, options=[sigstore sigstore-github x509 x509-env] | "sigstore" |
|  | --backoff | Backoff duration | "15s" |
|  | --ca | x509 CA Chain path |  |
|  | --cache-enable | Enable local cache | true |
|  | --cert | x509 Cert path |  |
| -c | --config | Configuration file path |  |
|  | --context-dir | Context dir |  |
| -C | --context-type | CI context type, options=[jenkins github circleci azure gitlab travis tekton bitbucket local admission] | "local" |
|  | --crl | x509 CRL path |  |
|  | --crl-full-chain | Enable Full chain CRL verfication |  |
|  | --deliverable | Mark as deliverable, options=[true, false] |  |
|  | --depth | Git clone depth |  |
|  | --disable-crl | Disable certificate revocation verificatoin |  |
| -e | --env | Environment keys to include in evidence |  |
| -F | --filter-regex | Filter out files by regex | <p>[</p><p>**/*.pyc,**</p><p>/.git/**]</p> |
|  | --filter-scope | Filter packages by scope |  |
| -G | --gate | Policy Gate name |  |
|  | --git-auth | Git repository authentication info, [format: 'username:password'] |  |
|  | --git-branch | Git branch in the repository |  |
|  | --git-commit | Git commit hash in the repository |  |
|  | --git-tag | Git tag in the repository |  |
| -h | --help | help for valint |  |
|  | --key | x509 Private key path |  |
| -L | --label | Add Custom labels |  |
| -D | --level | Log depth level, options=[panic fatal error warning info debug trace] |  |
|  | --log-context | Attach context to all logs |  |
|  | --log-file | Output log to file |  |
|  | --oci | Enable OCI store |  |
| -R | --oci-repo | Select OCI custom attestation repo |  |
| -d | --output-directory | Output directory path | "${XDG_CACHE_HOME}/valint" |
| -O | --output-file | Output file name |  |
| -p | --pipeline-name | Pipeline name |  |
|  | --platform | Select target platform, examples=windows/armv6, arm64 ..) |  |
|  | --predicate-type | Custom Predicate type (generic evidence format) | <p>"</p><p>"</p> |
| -n | --product-key | Product Key |  |
| -V | --product-version | Product Version |  |
| -q | --quiet | Suppress all logging output |  |
|  | --rule-args | Policy arguments | [] |
| -U | --scribe.client-id | Scribe Client ID (deprecated) |  |
| -P | --scribe.client-secret | Scribe Client Token |  |
| -E | --scribe.enable | Enable scribe client |  |
| -u | --scribe.url | Scribe API Url | <p>"</p><p>"</p> |
| -s | --show | Print evidence to stdout |  |
|  | --structured | Enable structured logger |  |
|  | --timeout | Timeout duration | "120s" |
| -v | --verbose | Log verbosity level [-v,--verbose=1] = info, [-vv,--verbose=2] = debug |  |
### SEE ALSO
- [﻿valint bom](valint_bom.md)  - Create evidence command
- [﻿valint discard](valint_discard.md)  - Discard evidence
- [﻿valint download](valint_download.md)  - Downloads the evidence based on cache
- [﻿valint evidence](valint_evidence.md)  - Add file as evidence command
- [﻿valint list](valint_list.md)  - List evidence command
- [﻿valint slsa](valint_slsa.md)  - Create SLSA provenance evidence command
- [﻿valint verify](valint_verify.md)  - Verify compliance policies against evidence to ensure the integrity of supply chain.




<!--- Eraser file: https://app.eraser.io/workspace/nhmxJe8KTjfdprsMUOQj --->