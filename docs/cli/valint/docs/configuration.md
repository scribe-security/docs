# Configuration 

Configuration search paths:

- .valint.yaml
- .valint/valint.yaml
- ~/.valint.yaml
- \<k\>/valint/valint.yaml

For a custom configuration location use `--config` flag with any command.

Configuration format and default values.

```yaml
output_directory: ${XDG_CACHE_HOME}/valint
scribe:
  auth:
    login-url: https://scribesecurity-production.us.auth0.com
    grant-type: client_credentials
    enable: true
    audience: api.production.scribesecurity.com
  url: https://api.production.scribesecurity.com
  enable: true
context:
  context-type: local
report:
  retry:
    backoff: 3s
    timeout: 60s
  sections:
  - files
  - packages
  - packages-files
  - summary
  integrity:
  - Modified
  - Not_Covered
  - Validated
  - Not_Validated
diff:
  scope:
    package:
    - apk
    - gem
    - deb
    - rpm
    - npm
    - python
    - php-composer
    - java-archive
    - jenkins-plugin
    - go-module
    - rust-crate
    - msrc-kb
    - dart-pub
    - dotnet
    - pod
    - conan
    - portage
    - hackage
    integrity:
    - validated
    - modified
    - missing
    - added
    - renamed
  paths:
  - ':'
  synopsis:
    enable: true
  metadata:
    enable: true
```
