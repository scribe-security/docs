---
sidebar_label: "Importing SBOMs"
title: Importing SBOMs
sidebar_position: 3
---

In some cases you might prefer using specific commercial or open-source tools to generate SBOMS of your software artifacts. For example, in a case you wish to reverse a complicated binary artifact. In other cases, you might require manage in Scribe SBOMs your received from 3rd parties.  

You can import these SBOMs to Scribe Hub and it is also possible to to merge these SBOMs with the SBOMs created by Scribe to increase overall accuracy.  

To import such an external SBOM call Valint as follows:
```
valint bom <filename> -o generic-attest --predicate-type cycloneDX
```


 