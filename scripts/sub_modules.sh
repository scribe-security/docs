#!/bin/bash


submodules_dir="sub"
[ ! -d "${submodules_dir}" ] && mkdir "${submodules_dir}"
base="git@github.com:scribe-security"
repos=( "gensbom" "valint" )

pull_submodules() {
    for repo in "${repos[@]}"
    do
        echo "Download repo $${repo}"
        repo_url="${base}/${repo}"
        repo_dir="${submodules_dir}/${repo}"
        [[ ! -d "${repo_dir}" ]] && git clone --depth 1 "${repo_url}" "${repo_dir}"
        pushd "${repo_dir}"
        git pull origin master || git pull origin main
        popd
    done
}

import_cli() {
    repo=$1
    repo_dir="${submodules_dir}/${repo}"
    cp "${repo_dir}/README.md" docs/cli/${repo}
    cp -r "${repo_dir}/docs" docs/cli/${repo}
}

import_cli gensbom
import_cli valint