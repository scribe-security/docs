
# `valint` - Validate integrity of your supply chain

`valint` is a Command Line Interpreter (CLI) tool developed by Scribe, that validates the integrity of your build. 

At the end of your pipeline run, decide to accept or fail a build, depending on the integrity analysis result reported by Scribe.  

Validations are based on evidence collected from your build.

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
  <summary> Apt repository </summary>

Download agent DEB package from https://scribesecuriy.jfrog.io/artifactory/scribe-debian-local/valint

```bash
wget -qO - https://scribesecuriy.jfrog.io/artifactory/api/security/keypair/scribe-artifactory/public | sudo apt-key add -
sudo sh -c "echo 'deb https://scribesecuriy.jfrog.io/artifactory/scribe-debian-local stable non-free' >> /etc/apt/sources.list"
apt-get install valint -t stable
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

Use `valint` report to download the integrity validation report from Scribe service:

```sh
valint report [flags]
```

By default, the report is written to the local cache. 
```sh
~/.cache/valint/reports/<timestamp>/<report-file>
```


## `valint` flags 
>The following flags are mandatory:
>* -U (Client ID)
>* -P (Client Secret)
>* -E (Enable Scribe client)

| Short | Long | Description |  Option Values | Default |
| --- | --- | --- | --- | --- |
|  -n | --product-key \<string\> | Scribe Product Key  | | | 
| -U | --scribe.client-id \<string\> | Scribe Client ID (mandatory) | |  |
| -P | --scribe.client-secret \<string\> | Scribe Client Secret (mandatory) | | |

For full list of flag options see [valint documentation](command/valint.md)

## Examples
---

### Examples of running `valint report [flags]`
Download your report from Scribe service:
  ```sh
valint report --scribe.client-id=<client_id> --scribe.client-secret=<client_secret>			
  ```
Download report, retry timeout after 30 seconds: 
  ```sh
valint report --scribe.client-id=<client_id> --scribe.client-secret=<client_secret> -T 30s		
  ```
Download report, retry timeout after 30 seconds and backoff 10 seconds: 
  ```sh
valint report --scribe.client-id=<client_id> --scribe.client-secret=<client_secret> -T 30s -B 10s		
  ```
Download report of all source code files that were suspiciously modified:
  ```sh
valint report --scribe.client-id=<client_id> --scribe.client-secret=<client_secret> -I ModifiedFiles -S files 
  ```
Download report of all source code packages that were verified (validated):
```sh
valint report --scribe.client-id=<client_id> --scribe.client-secret=<client_secret> -I Verified -S packages 	
```

For full list of `valint report` flag options see [valint report documentation](command/valint_report.md)


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
