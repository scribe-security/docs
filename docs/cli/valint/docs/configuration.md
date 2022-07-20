# Configuration 

Configuration search paths:

- .valint.yaml
- .valint/valint.yaml
- ~/.valint.yaml
- \<k\>/valint/valint.yaml

For a custom configuration location use `--config` flag with any command.

Configuration format and default values.

```yaml
 "logger": {
  "verbose": 2
 },
 "output_directory": "/home/mikey/.cache/valint",
 "scribe": {
  "auth": {
   "login_url": "https://scribesecurity-production.us.auth0.com",
   "client_id": "******",
   "client_secret": "******",
   "grant_type": "client_credentials",
   "enable": true,
   "audience": "api.production.scribesecurity.com"
  },
  "service": {
   "url": "https://api.production.scribesecurity.com",
   "enable": true
  }
 },
 "context": {
  "context-type": "local"
 },
 "global": {},
 "report": {
  "retry": {
   "backoff": "3s",
   "timeout": "15s"
  },
  "sections": [
   "files",
   "packages",
   "packages-files",
   "analyze-summary"
  ],
  "integrity": [
   "Preservedfiles",
   "ModifiedFiles",
   "PreservedByHashFiles",
   "MissedFiles",
   "AddedFiles",
   "Validated",
   "Not_Validated"
  ]
 }

```