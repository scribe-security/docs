---
sidebar_label: "Platforms Github Integration"
title: Scribe Platforms CLI Action
sidebar_position: 2
toc_min_heading_level: 2
toc_max_heading_level: 5
---

Scribe offers the use of GitHub Actions to enable the embedding of evidence collection and integrity validation into your pipeline as a way to help secure your software supply chain.

Further documentation **[Platforms integration](../../../platforms/overview)**.

### Input arguments
```yaml
  cmd:
    description: Command to run
    required: true
  log-level:
    description: Log verbosity level {DEBUG,INFO,WARNING,ERROR,CRITICAL}
  log-file:
    description: Log file path
  config:
    description: Path to a configuration file
  print-config:
    description: Print the configuration after applying all other arguments and exit
  db-local-path:
    description: Local db path
```

### Usage
```yaml
- name: Discover k8s assets
  uses: scribe-security/action-platforms@master
  with:
    cmd: discover k8s
  env:
    K8S_URL: ${{ secrets.K8S_URL }}
    K8S_TOKEN: ${{ secrets.K8S_TOKEN }}
```

## .gitignore
It's recommended to add output directory value to your .gitignore file.
By default add `**/scribe` to your `.gitignore`.