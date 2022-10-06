---
sidebar_position: 9
sidebar_label: "CVE Reports"
---

# Monitoring Security Reports of your version 
Make an informed decision about deploying your build version by analyzing the information about Common Vulnerabilities and Exposures (CVEs) Scribe found in your build. 

Details, such as the specific packages and versions where vulnerabilities were found and their severity score, can support your risk analysis and decision of whether to deploy and what mitigations to employ.

## Before you begin
1. Login to your [Scribe Hub account]("https://scribesecurity.com/" "Login or register to Scribe Hub"), or register for a new account. 
1. Go to **Home>Products**.
1. Click on a product from the list to access the detailed report of CVEs (Common Vulnerabilities and Exposures).
## Product version report page
Scribe provides security validation for each version of your product. 

### Validation Report Summary
| Card | Description |  
| --- | --- | 
| Packages | Number of Packages checked |
| Layers | Number of base layers identified in your Docker image. (such as operating systems, databases). Click to see details of layers. |  
| Licenses | Number of Licenses (such as OS, Packages) found in your Docker image. Click to see details of license types. |   
| OS | Operating System identified in Image. Click to see details of OS found. |  
| CVEs High+ | Number of high and critical vulnerabilities found compared to previous version checked. Additional vulnerablities (+, red), vulnerabilities no longer in current version (-, green)  |  
| Policies | Number of policies checked: Policies complied with (green), not complied with (red). | 
| Integrity | Automated final validation verdict | 


###  Validation Report details

* **Integrity Report**
    
    Summary of the validation status appears in the window. 
    If all packages passed validation, a **Validated** (green) indicator is set. 

   * For the detailed report, Click **More**. A Report page opens with the number of validated files and a list of file details including:
      * Name 
      * Destination path 
      * Unique hash value 
      * Integrity state 
  
 
 * **Software Bill of Materials (SBOM)**

    For details of the SBOM, click **More**. A Report page opens with the number of validated packages and a list of package details including:
    * Name 
    * Package Manager
    * Version
    * Path
 
* **Vulnerabilities** 

    Displays the most severe identified vulnerability. 
    * Both **Critical** and **High** are marked red, **Medium**, **Low** and **Negligible** are marked grey. 
    * For details, click **More**. A list opens, sorted by descending severity.
    * Filtering options: 
        * **High+** (default): view only high and critical vulnerabilities.
        * **All**: view all vulnerabilities.Search filter according to search results.
    * Details of vulnerabilities: 
        * Unique identifier of vulnerability from the open source vulnerabilities database. 
        * Component name
        * Component version installed
        * Date vulnerability was identified
        * To view details in the open-source vulnerability database, click anywhere on the vulnerability details.
        * Advisory notes
        
            Add or read information written by version stakeholders regarding the vulnerability found. 
            * To add an advisory note, go to the right end or row. Click the three dots>**Add Advisory**. A new note form opens. Add text and **Save** to save, or **Cancel**.
            * To edit or delete an existing advisory note, click the three dots>**Edit Advisory**. Edit and **Save** or **Cancel**. 
            
                To delete, click the red bin icon.
