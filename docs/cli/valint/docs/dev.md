
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