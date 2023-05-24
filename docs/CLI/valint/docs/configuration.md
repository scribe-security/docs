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
    login-url: https://scribesecurity-production.us.auth0.com
    grant-type: client_credentials
    enable: true
    audience: api.production.scribesecurity.com
  url: https://api.production.scribesecurity.com
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
  env: []
  force: false
  components:
  - metadata
  - layers
  - packages
  - syft
  - files
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
    - rust
    - binary
    - sbom
    exclude-type: []
  attach-regex: []
  final-artifact: false
  compress: false
attest:
  config: ""
  default: sigstore
  cocosign: {}
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
```
