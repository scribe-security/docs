# Report

Integrity report output example
```
 {
    "source_code": {
            "files": [
                    {
                            "fileName": "docker-compose.yml",
                            "fullPath": "docker-compose.yml",
                            "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "integrity": "Validated"
                    },
                    {
                            "fileName": "package.json",
                            "fullPath": "package.json",
                            "hash": "44a307aa4cb2ccabf7f22c32a042f20f580867bdbe032660e27a4e47df2009b3",
                            "id": 1,
                            "integrity": "ModifiedFiles"
                    },
                    {
                            "fileName": "README.md",
                            "fullPath": "README.md",
                            "hash": "6ce1f55b5dbb51fa6097b39c66df1592df07a2f851fba350aef59529b05321ab",
                            "id": 2,
                            "integrity": "ModifiedFiles"
                    },
                    {
                            "fileName": "LICENSE",
                            "fullPath": "LICENSE",
                            "hash": "b6b2a48079bd59f2c392ee3308cc1a5e41ce5088642e1146f374c03c94cc9fbf",
                            "id": 3,
                            "integrity": "ModifiedFiles"
                    }
            ],
            "summary": {
 		"summary": {
 			"files_total_count": 64,
 			"files_validated": 63
 		}
            }
    },
    "open_source": {
            "packages": [
                    {
                            "id": "36f7d5d7940b930239a5aead",
                            "integrity": "Not_Covered",
                            "name": "yarn",
                            "package_manager": "npm",
                            "root_path": "/opt/yarn-v1.22.15",
                            "version": "1.22.15"
                    },
                    {
                            "id": "add9b300692d4c5da83714f0",
                            "integrity": "Not_Covered",
                            "name": "mongo-express",
                            "package_manager": "npm",
                            "root_path": "/node_modules/mongo-express",
                            "version": "1.0.0-alpha.4"
                    }
                //    ## OMITTED ....
            ],
            "summary": {
                "files_total_count": 64,
                "files_validated": 63
            },
            "files": [
                    {
                            "name": "cli.js",
                            "full_path": "/opt/yarn-v1.22.15/lib/cli.js",
                            "integrity": "Not_Covered",
                            "package_id": "36f7d5d7940b930239a5aead",
                            "rel_path": "lib/cli.js"
                    },
                    {
                            "name": "config.js",
                            "full_path": "/node_modules/mongo-express/config.js",
                            "integrity": "Not_Covered",
                            "package_id": "add9b300692d4c5da83714f0",
                            "rel_path": "config.js"
                    }
                //    ## OMITTED ....

            ],
            "files-summary": {
                "files_not_validated": 2,
                "files_total_count": 6199,
                "files_validated": 6197
            }
    },
    "analyze": {
            "access_time": "0001-01-01T00:00:00.000Z",
            "created_at": "2022-06-19T08:42:41.876Z",
            "file_id": 43247,
            "metadata": {
                    "git_branch": "master",
                    "git_commit": "904ee9d78e2c265a8630caba7eeff0319a13e763",
                    "git_ref": "904ee9d78e2c265a8630caba7eeff0319a13e763 refs/heads/master",
                    "git_tag": "v2.1.94",
                    "git_url": "https://github.com/scribe-security/bomber.git",
                    "hostname": "mikey-Latitude-5520",
                    "name": "scribe",
                    "sbomgroup": "image",
                    "sbomhashs": [
                            "sha256-2a25aafdf23296823b06bc9a0a2af2656971262041b8dbf11b40444804fdc104",
                            "sha256-2d2fb2cabc8fa6b894bd7c82158dd7a9dd5815d240f75a93db0d853f008cfd20"
                    ],
                    "sbomname": "index.docker.io/library/mongo-express",
                    "sbomversion": "sha256:2d2fb2cabc8fa6b894bd7c82158dd7a9dd5815d240f75a93db0d853f008cfd20",
                    "timestamp": "2022-06-19T11:42:2103:00",
                    "user": "mikey"
            },
            "params": {
                    "file_id": 43247,
                    "purls": [
                            "pkg:alpine/libgcc@9.3.0-r0?arch=x86_64\u0026upstream=gcc\u0026distro=alpine-3.11.12",
                            "pkg:npm/npm-cli-docs@0.1.0",
                            "pkg:alpine/alpine-baselayout@3.2.0-r3?arch=x86_64\u0026upstream=alpine-baselayout\u0026distro=alpine-3.11.12",
                            "pkg:alpine/zlib@1.2.11-r3?arch=x86_64\u0026upstream=zlib\u0026distro=alpine-3.11.12",
                            "pkg:alpine/busybox@1.31.1-r10?arch=x86_64\u0026upstream=busybox\u0026distro=alpine-3.11.12",
                            "pkg:alpine/musl-utils@1.1.24-r3?arch=x86_64\u0026upstream=musl\u0026distro=alpine-3.11.12",
                            "pkg:alpine/ncurses-terminfo-base@6.1_p20200118-r4?arch=x86_64\u0026upstream=ncurses\u0026distro=alpine-3.11.12",
                            "pkg:alpine/ca-certificates-cacert@20191127-r2?arch=x86_64\u0026upstream=ca-certificates\u0026distro=alpine-3.11.12",
                            "pkg:alpine/apk-tools@2.10.8-r0?arch=x86_64\u0026upstream=apk-tools\u0026distro=alpine-3.11.12",
                            "pkg:alpine/bash@5.0.11-r1?arch=x86_64\u0026upstream=bash\u0026distro=alpine-3.11.12",
                            "pkg:alpine/scanelf@1.2.4-r0?arch=x86_64\u0026upstream=pax-utils\u0026distro=alpine-3.11.12",
                            "pkg:alpine/musl@1.1.24-r3?arch=x86_64\u0026upstream=musl\u0026distro=alpine-3.11.12",
                            "pkg:alpine/ssl_client@1.31.1-r10?arch=x86_64\u0026upstream=busybox\u0026distro=alpine-3.11.12",
                            "pkg:alpine/readline@8.0.1-r0?arch=x86_64\u0026upstream=readline\u0026distro=alpine-3.11.12",
                            "pkg:alpine/alpine-keys@2.1-r2?arch=x86_64\u0026upstream=alpine-keys\u0026distro=alpine-3.11.12",
                            "pkg:alpine/libstdc@9.3.0-r0?arch=x86_64\u0026upstream=gcc\u0026distro=alpine-3.11.12",
                            "pkg:alpine/libtls-standalone@2.9.1-r0?arch=x86_64\u0026upstream=libtls-standalone\u0026distro=alpine-3.11.12",
                            "pkg:alpine/ncurses-libs@6.1_p20200118-r4?arch=x86_64\u0026upstream=ncurses\u0026distro=alpine-3.11.12",
                            "pkg:alpine/libcrypto1.1@1.1.1l-r0?arch=x86_64\u0026upstream=openssl\u0026distro=alpine-3.11.12",
                            "pkg:npm/npm-init@0.0.0",
                            "pkg:alpine/libc-utils@0.7.2-r0?arch=x86_64\u0026upstream=libc-dev\u0026distro=alpine-3.11.12",
                            "pkg:alpine/libssl1.1@1.1.1l-r0?arch=x86_64\u0026upstream=openssl\u0026distro=alpine-3.11.12",
                            "pkg:alpine/tini@0.18.0-r0?arch=x86_64\u0026upstream=tini\u0026distro=alpine-3.11.12"
                    ]
            },
            "project_id": 8,
            "request_id": 648,
            "result": {
                    "result_id": 367
            },
            "status": "checked",
            "type": "analyze:sbom",
            "updated_at": "2022-06-19T08:42:41.876Z"
    }
}
```