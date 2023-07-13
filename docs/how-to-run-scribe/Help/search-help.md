---
sidebar_label: "Search"
title: Search Help
sidebar_position: 1
---

In various places on our platform you'll find the very familiar search bar.

<img src='../../../../img/help/search-bar.png' alt='search bar' width='40%'/>

The first place you might encounter it is probably at the <b>products</b> page but it's a safe bet you'll find it in most pages.

The search bar is meant to help you find what you're looking for no matter where you are on the platform. If you're looking at the products' page you can obviously search your products by their name but more importantly you can search you're products by other things that might be part of their information such as a string of 'cve-2019' or a more specific CVE such as 'CVE-2019-19781'.

The result would be whatever products contain that CVE. Think how easy it would make searching for the next log4j or Log4Shell!
All you have to do is run a search and you can tell immediately which of your projects is effected. The same logic holds true for most other search bars as well such as the one found in the <b>Vulnerabilities</b> page.

The one search bar I wanted to expand on is the <b>Evidence</b> search bar.

This page describes all the various evidence collected over all your projects in a single location making it ideal for searching purposes.

The page allows you to auto-filter the table by clicking on any one column. For example, clicking on the <b>project</b> column would filter the table by that column. The nice thing is that you can combine filters in this way. For example, if you want to see all projects that originated in GitLab, for projects that use the name 'testing_mock_repo' with the content type of evidence being SBOM, you need to enter into the search bar:  

contextType:"Gitlab" pipelineRunGitUrl:"https://github.com/scribe-security/testing_mock_repo.git" contentType:"SBOM CycloneDX"

Note that the 'and' in this complex search is implied and that the column names as they appear in the search bar do not fully match the column names in the table. That inconsistency will be fixed shortly.

Columns that present as gray cannot be used as filters at this time. If there is demand for that capability we'll work on adding it.

In my example, running that search gave me 3 results out of several dozen lines I started out with.

<img src='../../../../img/help/search-example.png' alt='search example'/>
