#!/bin/bash


submodules_dir="sub"
[ ! -d "${submodules_dir}" ] && mkdir "${submodules_dir}"
base="git@github.com:scribe-security"
supported_repos=( "gensbom" "valint" "actions" "JSL" "misc" )

pull_submodules() {
    repos=$1
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

checkout_submodules() {
    repos=$1
    for repo in "${repos[@]}"
    do
        echo "Download repo $${repo}"
        repo_url="${base}/${repo}"
        repo_dir="${submodules_dir}/${repo}"
        [[ ! -d "${repo_dir}" ]] && git clone --depth 1 "${repo_url}" "${repo_dir}"
        pushd "${repo_dir}"
        git pull origin master || git pull origin main
        git branch -D doc_export
        git checkout -b doc_export
        popd
    done
}

status_submodules() {
    repos=$1
    for repo in "${repos[@]}"
    do
        echo "Download repo $${repo}"
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
        echo "Download repo $${repo}"
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
}

export_file() {
    repo=$1
    src_dir=$2
    dst_dir=$3
    repo_dir="${submodules_dir}/${repo}"
    cp ${dst_dir}/${src_dir}/README.md ${repo_dir}/${src_dir}/
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


import_actions() {
    repo="actions"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/ci-cd-integrations/github/actions"
    import_file ${repo} "" "${dst_dir}"
    import_file ${repo} "valint/report" "${dst_dir}"
    import_file ${repo} "gensbom/bom" "${dst_dir}"
    import_file ${repo} "gensbom/verify" "${dst_dir}"
}

export_actions() {
    repo="actions"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/ci-cd-integrations/github/actions"
    export_file ${repo} "" "${dst_dir}"
    export_file ${repo} "valint/report" "${dst_dir}"
    export_file ${repo} "gensbom/bom" "${dst_dir}"
    export_file ${repo} "gensbom/verify" "${dst_dir}"
}

import_JSL() {
    repo="JSL"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/ci-cd-integrations/jenkins/JSL"
    import_file ${repo} "" "${dst_dir}"
    cp -r "${repo_dir}/imgs" "${dst_dir}"
}

export_JSL() {
    repo="JSL"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/ci-cd-integrations/jenkins/JSL"
    export_file ${repo} "" "${dst_dir}"
    cp -r "${repo_dir}/imgs" "${dst_dir}"
}

import_misc() {
    repo="misc"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/other-integrations/"
    import_file_rename ${repo} "docker-cli-plugin" "${dst_dir}/docker-cli-plugin.md"
}

export_misc() {
    repo="misc"
    repo_dir="${submodules_dir}/${repo}"
    dst_dir="docs/other-integrations/"
    export_file_rename ${repo} "docker-cli-plugin" "${dst_dir}/docker-cli-plugin.md"
}

import_cli() {
    repo=$1
    repo_dir="${submodules_dir}/${repo}"
    cp "${repo_dir}/README.md" "docs/cli/${repo}"
    cp -r "${repo_dir}/docs" "docs/cli/${repo}"
}

import_gensbom() {
    import_cli gensbom
}

export_gensbom() {
    export_cli gensbom
}

import_valint() {
    import_cli valint
}

export_valint() {
    export_cli valint
}

export_cli() {
    repo=$1
    repo_dir="${submodules_dir}/${repo}"
    cp "docs/cli/${repo}/README.md" "${repo_dir}" 
    cp -r "docs/cli/${repo}/docs" "${repo_dir}"
}


usage() {
  this=$1
  cat <<EOF
$this: Sync docs with submodules
Usage: $this [-b] bindir [-d] [-t tool]
  -I import docs from submodules
  -E export docs to submodules
  -S status of submodules"
EOF
  exit 2
}


parse_args() {
  while getopts "r:IESLdh?x" arg; do
    case "$arg" in
      x) set -x ;;
      r) repos+=(${OPTARG});;
      I) COMMAND="import";;
      E) COMMAND="export";;
      S) COMMAND="status";;
      L) LOCAL="true";;
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
    echo "EMPTY"
    repos=("${supported_repos[@]}")                  #copy the array in another one 
fi 


case $COMMAND in
  import)
    echo -n "import"
    if [ ! -z "$LOCAL" ]; then
        pull_submodules "${repos}"
    fi
    for repo in "${repos[@]}"
    do
        importFunction="import_${repo}"
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



