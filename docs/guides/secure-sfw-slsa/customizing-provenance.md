
---

## sidebar_label: "Customizing Provenance"
title: "Customizing the Provenance Document"
sidebar_position: 5
toc_min_heading_level: 2
toc_max_heading_level: 5
You can customize the provenance object by using the following flags:

- `--by-product`  includes the contents of an external file, such as a log file or an SBOM.
For example,
`valint slsa busybox:latest --by-product /path/to/my_file.txt` 

- `--components`  extend `byproduct`  when it is an SBOM with detailed target components such as layers packages, and files.
For example,
`valint slsa busybox:latest --components layers,packages,files` 

- Set specific provenance fields such as:
    - `--invocation` : invocation ID
    - `--build-type` : build type
    - `--builder-id` : builder ID
    - `--started-on` : build start time
    - `--finished-on` : build finish time
For Example,
```
valint slsa busybox:latest --invocation my_invocation --build-type docker --builder-id 12345 --started-on 2023-07-25T15:30:00Z --finished-on 2023-07-25T16:00:00Z
```
- `-env`  or `--all-env`  adds environment variables to the `internaParameters` .
For example,
```yaml
#Attach all environment variables
valint slsa busybox:latest --all-env
# Attach a specific environment variable
valint slsa busybox:latest --env MY_ENV
```
- `--external`  adds parameters to the `externalParameters`  in the form of key=value pairs.
For example,
`valint slsa busybox:latest --external my_custom_param=my_custom_value` 

- `--predicate`  adds a full or partial SLSA provenance predicate.
For example,
`valint slsa busybox:latest --predicate custom.predicate.json`
Where `custom.predicate.json` specifies custom `externalParameters`, `builderDependencies`, and metadata.

```json
{
 "buildDefinition": {
   "externalParameters": {
     "custom_external": {
       "digest": {
         "sha1": "910b17c3bc81ca8c791aaa394d508219e03879f8"
       },
       "name": "build-environment",
       "value": "production",
       "uri": "https://company.com/my_repo/event"
     }
   }
 },
 "runDetails": {
   "builder": {
     "builderDependencies": [
       {
         "uri": "https://github.com/.github/reusable_build.yaml",
         "name": "my_tool",
         "annotations": {
           "vendor": "My company Inc",
           "version": "1.0"
         }
       }
     ]
   },
   "metadata": {
       "invocationID": "https://company.com/my_repo/build.sh",
       "startedOn": "2023-07-25T15:30:00Z",
       "finishedOn": "2023-07-25T16:00:00Z"
   }
 }
}
```
- `--statement`  adds a full or partial SLSA provenance statement.
For example,
`valint slsa busybox:latest --statement custom.statement.json`
The following `custom.predicate.json` includes custom subject and byproducts.

```json
{
 "_type": "https://in-toto.io/Statement/v0.1",
 "predicateType": "https://slsa.dev/provenance/v1",
 "subject": [
   {
     "name": "index.docker.io/my_image",
     "digest": {
       "sha256": "62aedd01bd8520c43d06b09f7a0f67ba9720bdc04631a8242c65ea995f3ecac8"
     }
   }
 ],
 "predicate": {
   "runDetails": {
     "byproducts": [
       {
          "uri": "pkg:docker/index.docker.io/my_image:latest@sha256:7ad00cd55506625f2afad262de6002c8cef20d214b353e51d1025e40e8646e18?index=0",
          "digest": {
             "sha256": "7ad00cd55506625f2afad262de6002c8cef20d214b353e51d1025e40e8646e18"
          },
          "mediaType": "application/vnd.docker.image.rootfs.diff.tar.gzip",
          "annotations": {
             "tag": "v0.0.1"
          }
       }
    ]
   }
 }
}
```




<!--- Eraser file: https://app.eraser.io/workspace/dRjuPjR0HJghu5PPMUNx --->