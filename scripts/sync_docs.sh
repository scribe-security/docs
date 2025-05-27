#!/bin/bash

submodules_dir="sub"
[ ! -d "${submodules_dir}" ] && mkdir "${submodules_dir}"
base="git@github.com:scribe-security"
base_public="git@github.com:scribe-public"
supported_repos=(  "valint" "platforms_lib" "action-bom" "action-verify" "action-slsa" "action-installer" "orbs" "azure-tasks" "helm-charts" "valint-pipe" "gatekeeper-provider" "sample-policies" )

pull_submodules() {
    repos=$1
    for repo in "${repos[@]}"
    do
        echo "Download repo $${repo}"
        if [ "$repo" == "sample-policies" ]; then
            repo_url="${base_public}/${repo}"
        else
            repo_url="${base}/${repo}"
        fi
        repo_dir="${submodules_dir}/${repo}"
            if [ ! -z "$BRANCH" ]; then
                git clone --depth 1 --branch "$BRANCH" "${repo_url}" "${repo_dir}"
            else
                git clone --depth 1 "${repo_url}" "${repo_dir}"
            fi
        pushd "${repo_dir}"
        # if BRANCH
        if [ ! -z "$BRANCH" ]; then
            git fetch origin $BRANCH
            git checkout $BRANCH
            git config pull.rebase false  # Or `true` if you prefer rebasing
            git pull origin $BRANCH
        else
            git checkout master || git checkout main
            git pull origin master || git pull origin main
        fi
        
        popd
    done
}

checkout_submodules() {
    repos=$1
    for repo in "${repos[@]}"
    do
        echo "#### Checkout repo $${repo} ####"
        repo_url="${base}/${repo}"
        repo_dir="${submodules_dir}/${repo}"
        [[ ! -d "${repo_dir}" ]] && git clone --depth 1 "${repo_url}" "${repo_dir}"
        pushd "${repo_dir}"
        if [ ! -z "$BRANCH" ]; then
            git branch -D $BRANCH
            git checkout -b $BRANCH
        else
            git checkout master || git checkout main
            git pull origin master || git pull origin main
        fi

        git branch -D doc_export
        git checkout -b doc_export
        popd
    done
}

status_submodules() {
    repos=$1
    for repo in "${repos[@]}"
    do
        echo -e "\n#### Status repo ${repo} "####
        repo_url="${base}/${repo}"
        repo_dir="${submodules_dir}/${repo}"
        [[ ! -d "${repo_dir}" ]] && git clone --depth 1 "${repo_url}" "${repo_dir}"
        pushd "${repo_dir}"
        git status
        git diff
        popd
    done
}

add_push_submodules() {
    for repo in "${repos[@]}"
    do
        echo "#### Push repo $${repo} ####\n"
        repo_url="${base}/${repo}"
        repo_dir="${submodules_dir}/${repo}"
        [[ ! -d "${repo_dir}" ]] && git clone --depth 1 "${repo_url}" "${repo_dir}"
        pushd "${repo_dir}"
        git add *.md
        git commit -m "export docs"
        git push -f origin doc_export
        popd
    done
}

import_file() {
    repo=$1
    src_dir=$2
    dst_dir=$3
    repo_dir="${submodules_dir}/${repo}"
    mkdir -p ${dst_dir}/${src_dir}
    cp  ${repo_dir}/${src_dir}/README.md ${dst_dir}/${src_dir}

    if [ ! -z "$src_dir" ]; then
        cp  ${repo_dir}/${src_dir}/README.md ${dst_dir}/${src_dir}
    else
        cp  ${repo_dir}/README.md ${dst_dir}/
    fi
}

export_file() {
    repo=$1
    src_dir=$2
    dst_dir=$3
    repo_dir="${submodules_dir}/${repo}"
    if [ ! -z "$src_dir" ]; then
        cp ${dst_dir}/${src_dir}/README.md ${repo_dir}/${src_dir}/
    else
        cp ${dst_dir}/README.md ${repo_dir}/
    fi
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

export_file_rename() {
    repo=$1
    src_dir=$2
    dst_file=$3
    repo_dir="${submodules_dir}/${repo}"
    dst_dir=$(dirname $dst_file)
    cp  ${dst_file} ${repo_dir}/${src_dir}/README.md
}

import_action() {
    repo=$1
    repo_dir="${submodules_dir}/${repo}"

    dst_dir="docs/integrating-scribe/ci-integrations/github"
    import_file_rename ${repo} "" "${dst_dir}/${repo}.md"
}

import_action_extra() {
    repo=$1
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/integrating-scribe/ci-integrations/github"
    cp -r "${repo_dir}/docs" "${dst_dir}" || true
    cp -r "${repo_dir}/docs" "${dst_dir}/../" || true
}


export_action() {
    repo=$1
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/integrating-scribe/ci-integrations/github"
    export_file_rename ${repo} "" "${dst_dir}/${repo}.md"
}

export_action_extra() {
    repo=$1
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/integrating-scribe/ci-integrations/github"
    cp -r "${dst_dir}/../docs" "${repo_dir}" || true
}

import_platforms_lib() {
    repo="platforms_lib"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/platforms/"
    cp -r "${repo_dir}/docs/cli/*" "${dst_dir}" || true}
}
export_platforms_lib() {
    echo "pass"
}

import_action-bom() {
    repo="action-bom"
    import_action  ${repo}
    import_action_extra ${repo}
}
import_action-verify() {
    repo="action-verify"
    import_action  ${repo}
}
import_action-installer() {
    import_action "action-installer"
}
import_action-slsa() {
    import_action "action-slsa"
}

export_action-bom() {
    repo="action-bom"
    export_action ${repo}
    export_action_extra ${repo}
}
export_action-verify() {
    repo="action-verify"
    export_action ${repo}
    export_action_extra ${repo}
}
export_action-installer() {
    set -x
    export_action "action-installer"
}
export_action-slsa() {
    repo="action-slsa"
    export_action ${repo}
    export_action_extra ${repo}
}

import_valint-pipe() {
    repo="valint-pipe"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/integrating-scribe/ci-integrations"

    # Hack to remove header not supported by bitbucket
    echo "---
sidebar_label: "Bitbucket"
title: "Bitbucket Pipelines Pipe: Scribe evidence generator"
sidebar_position: 7
---
" > "${dst_dir}/bitbucket.md"
    cat ${repo_dir}/README.md >>  "${dst_dir}/bitbucket.md"
    # import_file_rename ${repo} "" "${dst_dir}/bitbucket.md"
}

export_valint-pipe() {
    repo="valint-pipe"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/integrating-scribe/ci-integrations"
    
    # Hack to remove header not supported by bitbucket
    sed -n '/^# Bitbucket Pipelines Pipe/,$p' ${dst_dir}/bitbucket.md > ${repo_dir}/README.md    
    # export_file_rename ${repo} "" "${dst_dir}/bitbucket.md"
}

import_orbs() {
    repo="orbs"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/integrating-scribe/ci-integrations"
    import_file_rename ${repo} "" "${dst_dir}/circleci.md"
}

export_orbs() {
    repo="orbs"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/integrating-scribe/ci-integrations"
    export_file_rename ${repo} "" "${dst_dir}/circleci.md"
}

import_sample-policies() {
    repo="sample-policies"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/guides"

# Copy sample policy docs
    cp -r "${repo_dir}/docs/v2/*" "docs/configuration/"

    # Create a temporary file to hold the table content from index.md
    tmpfile=$(mktemp)

    # Extract everything between <!-- START TABLE --> and <!-- END TABLE --> from index.md
    # (excluding the markers themselves) into tmpfile
    sed -n '/<!-- START TABLE -->/,/<!-- END TABLE -->/ {
        /<!-- START TABLE -->/d
        /<!-- END TABLE -->/d
        p
    }' docs/configuration/initiatives/index.md > "${tmpfile}"

    # Replace the block in enforcing-sdlc-initiative.md with the table content from tmpfile
    sed -i '/<!-- START TABLE -->/,/<!-- END TABLE -->/{
        /<!-- START TABLE -->/!{ /<!-- END TABLE -->/!d; }
        /<!-- START TABLE -->/r '"${tmpfile}"'
    }' "${dst_dir}/enforcing-sdlc-initiative.md"

    # Clean up
    rm "${tmpfile}"
}

export_sample-policies() {
    repo="sample-policies"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/guides"
    export_file_rename ${repo} "" "${dst_dir}/enforcing-sdlc-initiative.md"
    sed -i '/^---$/,/^---$/c\
# Sample policies' "${repo_dir}/README.md"
}

import_helm-charts() {
    repo="helm-charts"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/integrating-scribe/admission-controller"
    import_file_rename ${repo}/charts/admission-controller "" "${dst_dir}/k8s-admission-controller.md"
}

export_helm-charts() {
    repo="helm-charts"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/integrating-scribe/admission-controller"
    export_file_rename ${repo}/charts/admission-controller "" "${dst_dir}/k8s-admission-controller.md"
}

import_gatekeeper-provider() {
    repo="helm-charts"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/integrating-scribe/admission-controller"
    import_file_rename ${repo}/charts/admission-controller "" "${dst_dir}/gatekeeper-provider.md"
}

export_gatekeeper-provider() {
    repo="gatekeeper-provider"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/integrating-scribe/admission-controller"
    export_file_rename ${repo}/charts/admission-controller "" "${dst_dir}/gatekeeper-provider.md"
}

import_azure-tasks() {
    repo="azure-tasks"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/integrating-scribe/ci-integrations"

    # Hack to remove header not supported by bitbucket
    echo "---
sidebar_label: "Azure Pipelines"
title: Azure Pipelines
sidebar_position: 4
---
" > ${dst_dir}/azure.md
    cat ${repo_dir}/README.md >>  "${dst_dir}/azure.md"
    # import_file_rename ${repo} "" "${dst_dir}/azure.md"
}

export_azure-tasks() {
    repo="azure-tasks"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/integrating-scribe/ci-integrations"

    sed -n '/^# Azure Pipelines Task/,$p' ${dst_dir}/azure.md > ${repo_dir}/README.md    
}

import_cli() {
    set -x
    repo=$1
    repo_dir="${submodules_dir}/${repo}"
    cp "${repo_dir}/README.md" "docs/integrating-scribe/${repo}"
    cp -r "${repo_dir}/docs" "docs/integrating-scribe/${repo}/"
}

export_cli() {
    repo=$1
    repo_dir="${submodules_dir}/${repo}"

    dst_dir="docs/integrating-scribe/${repo}"
    cp -r "${dst_dir}/docs" "${repo_dir}"
    # mv "docs/how-to-run-scribe/${repo}/README.md" "${repo_dir}/README.md" 
    export_file_rename "${repo_dir}/README.md" ${dst_dir}/getting-started-valint.md "" 
    cp -r ${dst_dir}/* "${repo_dir}/docs/"
}

import_valint() {
    set -x
    repo=valint
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/${repo}"

    cp -r ${repo_dir}/docs/command/* "docs/${repo}/help/"
    cp -r "${repo_dir}/docs/configuration.md" "docs/${repo}/configuration.md"
    # mv "${repo_dir}}/README.md" "docs/${repo}/getting-started-valint.md"
}

export_valint() {
    repo=valint
    set -x
    repo_dir="${submodules_dir}/${repo}"

    dst_dir="docs/integrating-scribe/${repo}"
    cp -r "${dst_dir}/docs" "${repo_dir}"
    # mv "ddst_dirocs/how-to-run-scribe/${repo}/README.md" "${repo_dir}/README.md" 
    export_file_rename "${repo}" "" ${dst_dir}/getting-started-valint.md
    cp -r ${dst_dir}/* "${repo_dir}/docs/"

    dst_dir="docs/guides/secure-sfw-slsa"
    cp -r ${dst_dir}/* "${repo_dir}/docs/"
}



usage() {
  this=$1
  cat <<EOF
$this: Sync docs with submodules
Usage: $this [-b] bindir [-d] [-r repo]
  -I import docs from submodules
  -E export docs to submodules
  -S status of submodules"
  -r repo to import or export
EOF
  exit 2
}


parse_args() {
  while getopts "b:r:IESLdh?x" arg; do
    case "$arg" in
      x) set -x ;;
      r) repos+=(${OPTARG});;
      I) COMMAND="import";;
      E) COMMAND="export";;
      S) COMMAND="status";;
      L) LOCAL="true";;
      b) BRANCH=${OPTARG};;
      h | \?) usage "$0" ;;
    esac
  done
  shift $((OPTIND - 1))
}

function processItems
{
    local -r PROCESSING_FUNCTION=$1
    shift 1
    
    for item in "$@"
    do
        $PROCESSING_FUNCTION 
    done
}

COMMAND="unknown"
parse_args "$@"
if (( ${#repos[@]} == 0 )); then
    # repos="${supported_repos[@]}"
    repos=("${supported_repos[@]}")                  #copy the array in another one 
fi 

case $COMMAND in
  import)
    if [ ! -z "$LOCAL" ]; then
        pull_submodules "${repos}"
    fi
    for repo in "${repos[@]}"
    do
        importFunction="import_${repo}"
        echo "$importFunction"
        eval ${importFunction}
    done
    ;;

  export)
    echo -n "export"
    if [ ! -z "$LOCAL" ]; then
        checkout_submodules "${repos}"
    fi

    for repo in "${repos[@]}"
    do
        importFunction="export_${repo}"
        eval ${importFunction}
    done

    ;;
  status)
        status_submodules "${repos}"
    ;;
  *)
    echo -n "unknown"
    ;;
esac



