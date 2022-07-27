
# Dev

## Build
First bootstrap your environment and download the dependencies,
Next build the packages.

```bash
make bootstrap
make build
```

You should find packages in `build` sub-directory
Packages supports are currently amd64, arm64 both DEB, RPM and tar.gz formats. \
**Note:** Make sure your docker supports Buildx `docker buildx ls` or turn off Buildx in Goreleaser config.

## Release

Gensbom uses Gorelease library to build tag and push artifacts to a github release (deb and rpm packages) as well as artifactory (deb,rpm and docker image). \
Release tag is used for the package versions. \
Release access is provided by an access TOKEN from Gensbom git repository, \
Release can only be done when local git is not dirty, so be sure to have everything updated on the tag you are releasing.

```bash
git tag -a <new tag> -m "some message"
git push --tags
GITHUB_TOKEN=<Github access token> ARTIFACTORY_GENERIC_SECRET=<artifactory password> ARTIFACTORY_GENERIC_USERNAME=<artifactory username> make release
```

**Note:** github release is currently posted as a draft and needs to be finalized by a human.
Jenkins pipeline is not yet implemented to autotomize a release process.

## Clean

```bash
make clean
make clean-snapshot
make clean-dist
```

## Test

---

### Integration tests
```bash
make test_images
make integration
```

Output reports for all test images should be present under the local directory ./tmp/docker/

### e2e tests
Set env for e2e then run make.
```bash
export SCRIBE_URL=
export SCRIBE_CLIENT_ID=
export SCRIBE_CLIENT_SECRET=
export SCRIBE_LOGIN_URL=
export SCRIBE_AUDIENCE=

make e2e
```

Output reports for all test images should be present under the local directory ./tmp/docker/
