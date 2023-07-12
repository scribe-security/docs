# Configuration 

Configuration search paths:

- .gensbom.yaml
- .gensbom/gensbom.yaml
- ~/.gensbom.yaml
- \<k\>/gensbom/gensbom.yaml

For a custom configuration location use `--config` flag with any command.

Configuration format and default values.

```yaml
output_directory: ${XDG_CACHE_HOME}/gensbom
scribe:
  auth:
    login-url: https://scribesecurity-production.us.auth0.com
    grant-type: client_credentials
    enable: true
    audience: api.production.scribesecurity.com
  url: https://api.production.scribesecurity.com
  enable: false
context:
  context-type: local
attest:
  config: ""
  default: sigstore
  cocosign: {}
filter:
  filter-regex:
  - '**/*.pyc'
  - '**/.git/**'
  filter-purl: []
  filter-scope: []
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
  git:
    auth: ""
    tag: ""
    branch: ""
    commit: ""
  final-artifact: false
  retry:
    backoff: 15s
    timeout: 120s
verify:
  input-format: attest-cyclonedx-json
  attestation: ""
  force: false
  final-artifact: false
```
