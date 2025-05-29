# Scribe Hub
*Last modified May 29, 2025*

# Scribe Hub Version 1.43.2
*May 29, 2025*

## Improvements  

User can review the 3rd party application security scanners' uploaded findings under Products \ <product version> \ Findings tab
Simplified policies to handle scanner findings were added to the catalog.
Support ingestion of CycloneDX v1.6
Vulnerability tables improvements: 
  Filter dependency relationship type (Direct or Transitive) to the vulnerability tables
  Vulnerbaility Description
  Vulnerbaility CWEs
Analytics (Early Access) improvements
  Vulnerability Risk dashboard
  End of life data from endoflife.date website 
Usability
  New sidebar filter in Products page
  Email alerts minor improvements

# Scribe Hub Version 1.30.3
*January 29, 2025*

## Improvements  
### Team Homepage  
- The 'Overview' dashboard, previously under 'Reports' was relocated to become the team's home page.
### Account
- The 'Settings' section was renamed to 'Account.'
- The 'User Logs' dashboard, previously under the 'Reports' section, was relocated to 'Accounts.'
### SBOMs (SBOM Inventory)
- The 'Reports' section was renamed to 'SBOMs.'
- The 'SBOM' dashboard displays a new 'Relation' column denoting whether a dependency is direct or transitive. The 'More' dialog displays the related dependencies (parent or child) in the SBOM.
- A new chart in the 'Vulnerabilities' dashboard under the SBOMs section visualizes the funnel of prioritized issues.
### Evidence dashbaord
- The Evidence dashboard previously under 'Reports' was relocated to 'Policy.'
- User can filter Evidence by 'Evidence ID.'
- 'Evidence ID' appears in the 'More' dialog in the evidence table.
- Evidence collected from the Discovery process displays the 'Signer ID' as other types of Evidence already do.
---
## Behavior Changes
- The SLSA dashboard under the 'Reports' section was deprecated. SLSA findings are accessible from the 'Policy', Evaluation dashboard.

## Scribe Hub Version 1.23.0 
*November 4, 2024*

### Improvements
#### Discovery Asset table
- Added Parent asset as property in the Asset table.

- Added 'More' link to asset line for extended info.
- Canceled the Lineage tab which became redundant due to the above change.
- Improved loading time of tables, filters, and graphs. 

## Scribe Hub Version 1.21.0
### Improvements
#### Attestation Signing
- Sign with AWS KMS keys.
#### SLSA Verification
- Compliance with SLSA levels 1 and 2 is validated by the client (valint). This replaces the previous implementation and standardizes the policy as a code model.

