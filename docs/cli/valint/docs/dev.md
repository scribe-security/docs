
# Dev

## Bootstrap
Before you work on anything in this project you need to bootstrap this project
```bash
make bootstrap
```

This will install dependencies and dev tools.

if you just want to install dependencies you can execute
```bash
make boostrap-go
```
or if you want to install only tools

```bash
make boostrap-tools
```

## Build
First bootstrap your environment and download the dependencies,
Next build the packages.

```bash
make build
```

This command generates licsense, creates a goreleaser and generates a snapshot build of the repository
## Clean

In order to clean previous builds, result reports and test cache you can execute

```bash
make clean
```

This command can be used to remove the snapshot and dist artifacts
## Licenses

To generate the licenses for the cli

```bash
make licenses
```

to delete the generated licenses you can use

```bash
make clean-licenses
```


## Release
We use go releaser to generate releases

you can update the `.goreleaser.yaml` for some release options
and then you can execute the following command to release

```bash
make release
```

## Lint

To verify golang lint standards you should execute
```bash
make lint
```
This command will execute `golang-ci` and will be using the configuration file `.golangci.yaml`
Note: This command will exclude test files in the lint 

## Unit Test

To run unit test you could run 

```
make unittest
```
Note: This will not cache any test results

## Insallation
CLI installation options

<details>
  <summary> Pull binary </summary>

Get the valint tool
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

You can pull the cli release binary wrapped in its relevant docker image (tag should equal the version).

```bash
docker pull scribesecuriy.jfrog.io/scribe-docker-public-local/valint:latest
```

</details>


<details>
  <summary> Release packages </summary>

Download a `.deb` or `.rpm` file from the [releases page](https://github.com/scribe-security/valint/releases)
and install with `dpkg -i` and `rpm -i` respectively.

```bash
dpkg -i <valint_package.deb>
valint --version
```

</details>