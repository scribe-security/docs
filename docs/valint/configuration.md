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
  output_directory: ${XDG_CACHE_HOME}/valint
scribe:
  auth:
    enable: true
    audience: api.production.scribesecurity.com
  url: https://api.scribesecurity.com
  enable: false
  retry:
    backoff: 15s
    timeout: 120s
context:
  predicate-type: http://scribesecurity.com/evidence/generic/v0.1
  context-type: local
bom:
  normalizers:
    packagejson:
      enable: true
  formats:
  - cyclonedx-json
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
    type:
    - ruby
    - python
    - javascript
    - java
    - dpkg
    - apkdb
    - rpm
    - go-mod
    - dotnet
    - r-package
    - rust
    - binary
    - sbom
    exclude-type: []
  attach-regex: []
  final-artifact: false
  compress: false
slsa:
  formats:
  - statement
  components:
  - metadata
  - layers
attest:
  config: ""
  default: sigstore
  cocosign: {}
  x509: {}
verify:
  input-format: attest-cyclonedx-json
  attestation: ""
  force: false
  final-artifact: false
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
  - sbomname
  - product-key
  - git_url
  filters: {}
  current: false
download:
  folder-path: ""
  format: attest-cyclonedx-json
  ref: ""
  store: cache
```
