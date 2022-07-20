---
sidebar_position: 4
---

# Detecting CVEs

You can list all the CVEs relevant to your software artifact as follows: 
1. Generate an *SBOM* with *gensbom*
2. Use open-source tool <a href='https://github.com/anchore/grype'>Grype</a> on this *SBOM*. You can run it either offline or online. If you run offline, you need to update the tool frequently and suppress the automatic update.  
In a bash shell run:  
```grype sbom:./image-sbom.json```   

Output when no vulnerabilities are found:
<img src='../img/grype/grype_alpine.png' alt='Grype alpine' />

Example output when vulnerabilities are found:
<img src='../img/grype/grype_couchbase.png' alt='Grype couchbase' />  
&nbsp;  


For more details on the CVEs run:  
```grype sbom:./image-sbom.json -o json```
