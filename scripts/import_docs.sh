#!/bin/bash


submodules_dir="sub"
[ ! -d "${submodules_dir}" ] && mkdir "${submodules_dir}"
base="git@github.com:scribe-security"
repos=( "gensbom" "valint" "actions" "JSL" "misc" )

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

import_file() {
    repo=$1
    src_dir=$2
    dst_dir=$3
    repo_dir="${submodules_dir}/${repo}"
    mkdir -p ${dst_dir}/${src_dir}
    cp  ${repo_dir}/${src_dir}/README.md ${dst_dir}/${src_dir}
}

import_file_rename() {
    repo=$1
    src_dir=$2
    dst_file=$3
    repo_dir="${submodules_dir}/${repo}"
    dst_dir=$(dirname $dst_file)
    mkdir -p ${dst_dir}
    cp  ${repo_dir}/${src_dir}/README.md ${dst_file}
}

import_action() {
    repo="actions"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/integrations/github"
    import_file ${repo} "" "${dst_dir}"
    import_file ${repo} "valint/report" "${dst_dir}"
    import_file ${repo} "gensbom/bom" "${dst_dir}"
    import_file ${repo} "gensbom/verify" "${dst_dir}"
}

import_JSL() {
    repo="JSL"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/integrations/jenkins/JSL"
    import_file ${repo} "" "${dst_dir}"
    cp -r "${repo_dir}/imgs" "${dst_dir}"
}

import_misc() {
    repo="misc"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/integrations/"
    import_file_rename ${repo} "docker-cli-plugin" "${dst_dir}/docker-cli-plugin.md"
}

pull_submodules
import_misc
import_cli gensbom
import_cli valint
import_action
import_JSL
