# Configuration 

Configuration search paths:

- .valint.yaml
- .valint/valint.yaml
- ~/.valint.yaml
- \<k\>/valint/valint.yaml

For a custom configuration location use `--config` flag with any command.

Configuration format and default values.

```yaml
cache:
  enable: true
  output_directory: $\{XDG_CACHE_HOME\}/valint
scribe:
  auth:
    enable: true
  url: https://api.scribesecurity.com
  enable: false
  disable: false
  retry:
    backoff: 15s
    timeout: 120s
context:
  predicate-type: http://scribesecurity.com/evidence/generic/v0.1
bom:
  normalizers:
    packagejson:
      enable: true
  formats: []
  force: false
  components:
  - metadata
  - layers
  - packages
  - syft
  - dep
  - commits
  package:
    group: ""
    type: []
    exclude-type: []
  attach-regex: []
  final-artifact: false
slsa:
  components:
  - metadata
  - layers
attest:
  config: ""
  bundle: https://github.com/scribe-public/sample-policies
  skip-bundle: true
  bundle-args:
    auth: ""
    tag: ""
    branch: ""
    commit: ""
    depth: 0
  policy_configs: []
  rule_configs: []
  label_filters: []
  initiative_filters: []
  default: sigstore
  report:
    add-passed: true
  cocosign: {}
  x509: {}
  kms:
    enable: false
    ref: ""
  pubkey: {}
  target-fallback: false
  target-fallback-name: false
  target-fallback-hash: false
  target-fallback-repo-digest: false
filter:
  filter-regex:
  - '**/*.pyc'
  - '**/.git/**'
  filter-purl: []
  filter-scope: []
list:
  columns:
  - timestamp
  - store
  - ref
  - context_type
  - sbomname
  - product-key
  - git_url
  all: false
  filters: {}
  current: false
  output-file: ""
  format: ""
discard:
  silent: false
  interactive: false
  current: false
```
