---
sidebar_position: 6
---

# Questions and Answers

Following is a list of Q & A. If you can't find an answer please ping us on the web messenger.

 


**Q**: I ran Scribe integrity validation and viewed the results. Now what?  
**A**: Next thing to do is to incorporate Scribe as part of your pipeline security tests. We plan to release this capability soon. If you are interested in more information, please leave us feedback through our web messenger.  

<br/>

**Q**: My project has Node.js but also includes other languages such as Python. How can I benefit from using Scribe?  
**A**: In this release, Scribe validates Node.js and npm code. Scribe also generates an SBOM of all the dependencies in your project, regardless of the type of packages.

<br/> 
 

**Q**: Does Scribe report CVEs found in my project?  
**A**: Yes, please see the instructions here. 

<br/>  


**Q**: How can I access past integrity validation reports?  
**A**: In the current version you can view only the last report. We plan to release a full report management capability soon. If you are interested in more information, please leave us feedback through our web messenger.

<br/> 


**Q**: I ran Scribe on my source code and docker image, yet the report is mostly empty. Why is that?  
**A**: Scribe currently validates the integrity of Node.js+npm projects. If your project is not written in JavaScript you won’t see validation results.

<br/>  


**Q**: Why is the *gensbom* run taking a long time?   
**A**: *gensbom* analyzes the dependencies in your project's container image. A large number of dependencies takes a longer time. 

<br/>  


**Q**: *gensbom* issues warnings when it runs. What should I do?  
**A**: As long as the run ended successfully and the resulting SBOM has been uploaded to Scribe you can safely ignore warnings.

<br/>   

**Q**: Can I use Scribe just to produce an SBOM (breakdown of my open-source dependencies) without validating integrity?  
**A**: You can run *gensbom* on a container image to produce an SBOM. You can either download the SBOM from the Scribe web application or you can produce it on your machine as explained here.

