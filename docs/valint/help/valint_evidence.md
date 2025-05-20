## valint evidence

Add file as evidence command

### Synopsis

Collect, Create and Store any file as evidence

```
valint evidence [TARGET] [flags]
```

### Optional flags 
Flags for `evidence` subcommand


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| | --attest.config | Attestation config path | |
| | --attest.default | Attestation default config, options=[sigstore sigstore-github x509 x509-env kms pubkey] | |
| | --ca | x509 CA Chain path | |
| | --cert | x509 Cert path | |
| | --compress | Compress content) | |
| | --crl | x509 CRL path | |
| | --crl-full-chain | Enable Full chain CRL verfication | |
| | --disable-crl | Disable certificate revocation verificatoin | |
| -o | --format | Evidence format, options=[statement attest] | |
| | --format-encoding | Evidence Format encoding | |
| | --format-type | Evidence Format type | |
| | --format-version | Evidence Format version | |
| -h | --help | help for evidence | |
| | --key | x509 Private key path | |
| | --kms | Provide KMS key reference | |
| | --oci | Enable OCI store | |
| -R | --oci-repo | Select OCI custom attestation repo | |
| | --parser | Evidence Parser Name | |
| | --pass | Private key password | |
| | --pubkey | Public key path | |
| -y | --skip-confirmation | Skip Sigstore Confirmation | |
| | --tool | Evidence Tool name | |
| | --tool-vendor | Evidence Tool vendor | |
| | --tool-version | Evidence Tool version | |


### Global options flags
Flags for all `valint` subcommands


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| | --cache-enable | Enable local cache | true |
| -c | --config | Configuration file path | |
| -C | --context-type | CI context type, options=[jenkins github circleci azure gitlab travis tekton bitbucket teamcity local admission] | |
| | --deliverable | Mark as deliverable, options=[true, false] | |
| -e | --env | Environment keys to include in evidence | |
| -G | --gate | Policy Gate name | |
| | --input | Input Evidence target, format (\<parser>:\<file> or \<scheme>:\<name>:\<tag>) | |
| -L | --label | Add Custom labels | |
| | --level | Log depth level, options=[panic fatal error warning info debug trace] | |
| | --log-context | Attach context to all logs | |
| | --log-file | Output log to file | |
| -d | --output-directory | Output directory path | "$\{XDG_CACHE_HOME\}/valint" |
| -O | --output-file | Output file name | |
| -p | --pipeline-name | Pipeline name | |
| | --predicate-type | Custom Predicate type (generic evidence format) | "http://scribesecurity.com/evidence/generic/v0.1" |
| -n | --product-key | Product Key | |
| -V | --product-version | Product Version | |
| -q | --quiet | Suppress all logging output | |
| -U | --scribe.client-id | Scribe Client ID (deprecated) | |
| -P | --scribe.client-secret | Scribe Client Token | |
| -D | --scribe.disable | Disable scribe client | |
| -E | --scribe.enable | Enable scribe client (deprecated) | |
| -u | --scribe.url | Scribe API Url | "https://api.scribesecurity.com" |
| -s | --show | Print evidence to stdout | |
| | --structured | Enable structured logger | |
| | --timeout | Timeout duration | "120s" |
| -v | --verbose | Log verbosity level [-v,--verbose=1] = info, [-vv,--verbose=2] = debug | |


### Examples for running `valint evidence`

```
  valint evidence <file>

  <file> File Path to add as evidence
  valint evidence file.json                                                                   Attach a file as evidence
  valint evidence file.json -o attest                                                         Sign evidence
  valint evidence file.json --tool my_tool --tool-version 0.0.1 --vendor="My Company Inc"     Customize tool information
  valint evidence file.json --format my_format --format-version 0.0.1 --format-encoding=xml   Customize format information
  valint evidence file.json --predicate-type https:/my_company.com/my_predicate/v1            Customize predicate type
  valint evidence file.json --compress                                                        Compress content
  valint evidence file.json --parser trivy                                                    Select Supported Report Parser
  valint evidence --file trivy:report.json --file semgrep:./report.semgrep.json            Multiple file mapping

  Supported Parsers:
  * acunetix 
  * acunetix360 
  * anchorectlpolicies 
  * anchorectlvulns 
  * anchoreengine 
  * anchoreenterprise 
  * anchoregrype 
  * apiblackduck 
  * apibugcrowd 
  * apicobalt 
  * apiedgescan 
  * apisonarqube 
  * apivulners 
  * appspider 
  * aqua 
  * arachni 
  * asff 
  * auditjs 
  * awsprowler 
  * awsprowlerv3 
  * awsscout2 
  * awssecurityhub 
  * azuresecuritycenterrecommendations 
  * bandit 
  * blackduck 
  * blackduckbinaryanalysis 
  * blackduckcomponentrisk 
  * brakeman 
  * bugcrowd 
  * bundleraudit 
  * burp 
  * burpapi 
  * burpenterprise 
  * burpgraphql 
  * cargoaudit 
  * checkmarx 
  * checkmarxone 
  * checkmarxosa 
  * checkov 
  * chefinspect 
  * clair 
  * cloudsploit 
  * cobalt 
  * codechecker 
  * contrast 
  * coverityapi 
  * crashtestsecurityjson 
  * credscan 
  * cyclonedx 
  * dawnscanner 
  * dependencycheck 
  * dependencytrack 
  * detectsecrets 
  * dockerbench 
  * dockle 
  * drheader 
  * dsop 
  * eslint 
  * fortify 
  * gcloudartifactscan 
  * generic 
  * ggshield 
  * githubvulnerability 
  * gitlabapifuzzing 
  * gitlabcontainerscan 
  * gitlabdast 
  * gitlabdepscan 
  * gitlabsast 
  * gitlabsecretdetectionreport 
  * gitleaks 
  * gosec 
  * govulncheck 
  * h1 
  * hadolint 
  * harborvulnerability 
  * hclappscan 
  * horusec 
  * humble 
  * huskyci 
  * hydra 
  * ibmapp 
  * immuniweb 
  * intsights 
  * jfrogxray 
  * jfrogxrayapisummaryartifact 
  * jfrogxrayondemandbinaryscan 
  * jfrogxrayunified 
  * kics 
  * kiuwan 
  * kubeaudit 
  * kubebench 
  * kubehunter 
  * kubescape 
  * mend 
  * meterian 
  * microfocuswebinspect 
  * mobsf 
  * mobsfscan 
  * mozillaobservatory 
  * msdefender 
  * netsparker 
  * neuvector 
  * neuvectorcompliance 
  * nexpose 
  * nikto 
  * nmap 
  * npmaudit 
  * nsp 
  * nuclei 
  * openscap 
  * openvas 
  * ort 
  * ossindexdevaudit 
  * outpost24 
  * phpsecurityauditv2 
  * phpsymfonysecuritycheck 
  * pipaudit 
  * pmd 
  * popeye 
  * pwnsast 
  * qualys 
  * qualysinfrascanwebgui 
  * qualyswebapp 
  * redhatsatellite 
  * retirejs 
  * riskrecon 
  * rubocop 
  * rustyhog 
  * sarif 
  * scantist 
  * scoutsuite 
  * semgrep 
  * skf 
  * snyk 
  * solarappscreener 
  * sonarqube 
  * sonatype 
  * spotbugs 
  * sshaudit 
  * ssllabs 
  * sslscan 
  * sslyze 
  * stackhawk 
  * sysdigreports 
  * talisman 
  * tenable 
  * terrascan 
  * testssl 
  * tfsec 
  * threagile 
  * trivy 
  * trivyoperator 
  * trufflehog 
  * trufflehog3 
  * trustwave 
  * trustwavefusionapi 
  * twistlock 
  * vcgxml 
  * veracode 
  * veracodesca 
  * wapiti 
  * wazuh 
  * wfuzz 
  * whispers 
  * whitehatsentinel 
  * wpscan 
  * xanitizer 
  * yarnaudit 
  * zap 
  

```

### SEE ALSO

* [valint](valint.md)	 - Validate Supply Chain Integrity

