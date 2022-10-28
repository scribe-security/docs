---
title: Valint
date: Jun 14, 2022
geometry: margin=2cm
---

# `valint` - Validate integrity of your supply chain

`valint` is a Command Line Interpreter (CLI) tool developed by Scribe, that validates the integrity of your build. 

> Currently, our release validates only *Node.js* and *npm* files/packages.

Validations are based on evidence collected from your pipeline. 

At the end of your pipeline run, decide to accept or fail a build, depending on the integrity analysis result reported by Scribe.  

  <details> 
      <summary> <i> How <code>valint</code> validates the integrity of your files </i>
      </summary>
      To assure that hash values have not changed on their way to the final container image, valint compares hash values of each file in your pipeline to the hash value of an assured version.
      <ul>
      <li><b>File integrity:</b> the validation process includes checking your source files (Node.js) using the source control management (SCM) source code as an assured version. </li> 
      <li> <b>Package integrity:</b> validation for all files in (npm) packages and dependencies use the official npm registry as an assured version.  </li> 
      </ul>      
      
</details>

<!--- I strongly suggest linking to this text from somewhere else, explaining the process of comparing hashes. Only second best option is here, in a collapse.
 -->

## Installing `valint`
Choose any of the following command line interpreter (CLI) installation options:

<details>
  <summary> Pull binary </summary>

Get the `valint` tool
```bash
curl http://get.scribesecurity.com/install.sh  | sh -s -- -t valint
```

</details>

<details>
  <summary> Docker image </summary>

Pull the `valint` release binary wrapped in its relevant docker image. Tag should be the requested version.

```bash
docker pull scribesecuriy.jfrog.io/scribe-docker-public-local/valint:latest
```

</details>


<details>
  <summary> Release packages </summary>

1. Download a `.deb` or `.rpm` file from the [releases page](https://github.com/scribe-security/valint/releases "release page").
1. Install `.deb` files using `dpkg -i` and `.rpm` files using `rpm -i`.

```bash
dpkg -i <valint_package.deb>
valint --version
```

</details>

## Acquiring Scribe credentials  

Running `valint` requires the following credentials that are found in the product setup dialog. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **Home>Products>[$product]>Setup**)

* **Product Key**
* **Client ID**
* **Client Secret**

## Running `valint` report

Use `valint report` to download your integrity validation report from Scribe service:

```sh
valint report [flags]
```

By default, the report is written to the local cache. 
```sh
~/.cache/valint/reports/<timestamp>/<report-file>
```


### `valint` flags 
>The following flags are mandatory:
>* -U (Client ID)
>* -P (Client Secret)
>* -E (Enable Scribe client)

| Short | Long | Description |  
| --- | --- | --- |
|  -n | --product-key \<string\> | Scribe Product Key  |  
| -U | --scribe.client-id \<string\> | Scribe Client ID (mandatory) | 
| -P | --scribe.client-secret \<string\> | Scribe Client Secret (mandatory) | 

For the full list of flag options, see [valint documentation](docs/command/valint.md).

## Filtering output of report

Filter your integrity check results by running `valint report -I <option>`. Specify one of the following options: 
* `Validated` - Receive information on all files/packages that are validated. 
* `Modified` - Receive information on all files/packages in which a change was detected.
* `Not_Covered`, `Not_Validated` - Receive information of all files/packages that the current release of `valint` was unable to confirm validation.

### Requesting detail type
To request the type of output information, run `valint report -S <option>`. Specify one of the following options:  
* `summary` - Summary of the validation report
* `files` - Validation information of all source files 
* `packages` - Validation information per package, including dependencies
* `packages-files` - Validation information per file in each package, including dependencies


## Examples - running `valint report`
---
Download your report from Scribe service:
  ```sh
valint report --scribe.client-id=<client_id> --scribe.client-secret=<client_secret>			
  ```
---
Download report, retry timeout after 30 seconds: 
  ```sh
valint report --scribe.client-id=<client_id> --scribe.client-secret=<client_secret> -T 30s		
  ```
---
Download report, retry timeout after 30 seconds and backoff 10 seconds: 
  ```sh
valint report --scribe.client-id=<client_id> --scribe.client-secret=<client_secret> -T 30s -B 10s		
  ```
---
Download report of all source code files that were suspiciously modified:
  ```sh
valint report --scribe.client-id=<client_id> --scribe.client-secret=<client_secret> -I Modified -S files 
  ```
---
Download report of all source code packages that were verified (validated):
```sh
valint report --scribe.client-id=<client_id> --scribe.client-secret=<client_secret> -I Verified -S packages 	
```
---

For full list of `valint report` flag options see [valint report documentation](docs/command/valint_report.md)

## Supported architecture and operating systems (OS) 
CPU Architecture 
* AMD64 (x86_64) 
* ARM64  

OS 
* Linux
* macOS 
* Windows 

<!-- # Commands
valint supports the following commands.

## Diff
Command checks the differences between source and destination sboms.

See details [CLI documentation - diff](docs/command/valint_diff.md)

### Diff additional info
Additional info can be added to the diff report adding:
* Metadata of the sboms.
* Synopsis of the report. 

### Diff scoping
SBOM differences can be filtered to show only part of the sbom data by:
1) Integrity types
2) Package types.
3) Mime-type types.
4) Lists of regex paths for source and destination sboms. -->
