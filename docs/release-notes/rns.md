# Scribe Hub  
*Last modified: May 29, 2025*

---

## Version 1.43.2 (May 29, 2025)

### Improvements
- Under **Products ▸ `<product version>` ▸ Findings**, users can now review uploaded findings from third-party application-security scanners.  
- Added simplified policies for handling scanner findings to the catalog.  
- Support for ingesting CycloneDX v1.6 SBOMs.  
- Vulnerability tables enhancements:  
  - Filter by dependency-relationship type (Direct vs. Transitive).  
  - Display full vulnerability description.  
  - Show associated CWEs.  
- **Analytics (Early Access)** improvements:  
  - New Vulnerability Risk dashboard.  
  - Pull end-of-life data from endoflife.date.  
- **Usability**:  
  - New sidebar filter on the Products page.  
  - Minor improvements to email alerts.  

---

## Version 1.30.3 (January 29, 2025)

### Improvements
- **Team Homepage**  
  - Relocated the **Overview** dashboard (formerly under Reports) to become the team’s home page.  
- **Account**  
  - Renamed **Settings** to **Account**.  
  - Moved the **User Logs** dashboard from Reports into Accounts.  
- **SBOMs (SBOM Inventory)**  
  - Renamed the **Reports** section to **SBOMs**.  
  - In the SBOM dashboard:  
    - Added a **Relation** column showing whether a dependency is direct or transitive.  
    - “More” dialog now displays related dependencies (parent or child).  
  - Added a new funnel chart under SBOMs ▸ Vulnerabilities to visualize issue prioritization.  
- **Policy**  
  - Moved the Evidence dashboard (formerly under Reports) into Policy.  
  - Added filtering by Evidence ID.  
  - Exposed Evidence ID in the “More” dialog.  
  - Discovery-collected evidence now shows **Signer ID** like other evidence types.  

### Behavior Changes
- Deprecated the SLSA dashboard under Reports; SLSA findings are now accessible via the Policy ▸ Evaluation dashboard.  

---

## Version 1.23.0 (November 4, 2024)

### Improvements
- **Discovery**  
  - In the Asset table:  
    - Added **Parent asset** as a column.  
    - Replaced the Lineage tab with a “More” link for extended info.  
  - Improved load times for tables, filters, and graphs.  

---

## Version 1.21.0

### Improvements
- **Attestation**  
  - Sign attestations with AWS KMS keys.  
- **SLSA Verification**  
  - Client-side validation for SLSA Levels 1 & 2 standardized via a policy-as-code model, replacing the previous implementation.  
