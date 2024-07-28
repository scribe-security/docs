<p><a target="_blank" href="https://app.eraser.io/workspace/CbwUwWKT4LLrqLrmnEVC" id="edit-in-eraser-github-link"><img alt="Edit in Eraser" src="https://firebasestorage.googleapis.com/v0/b/second-petal-295822.appspot.com/o/images%2Fgithub%2FOpen%20in%20Eraser.svg?alt=media&amp;token=968381c8-a7e7-472a-8ed6-4a6626da5501"></a></p>

---

## sidebar_label: "Products"
title: Products and Builds
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 5
This is the main page of the Scribe Hub. All of your products managed by the platform are presented here for easy access. 

![Products page](../../img/start/products-start.jpg "")

At the top of the page there is a search bar to help you find the product you're looking for. You can search for a product by its name, a CVE it might contain, the date it was updated, etc.

Some of the information you can see about each product is:

- Whether the source code integrity was validated (based on the last build)
- How many subscribers does the product have
- When was the latest build version uploaded
- How many components does the product contains (based on the last build)
- How many High and Critical vulnerabilities does the product contains (based on the last build)
- How does the product measure up in regards to compliance with SSDF and SLSA
Clicking on a product would present that product information details including all its builds:

![Product builds page](../../img/start/builds-start.jpg "")

For each of the product's builds you can see:

- The build's version ID
- When the build happened (Build date)
- Whether the build's source code integrity was validated
- How many High and Critical vulnerabilities are in the build
- Each component included in the build (assuming there are multiple components comprising each build) 
- Whether the build is signed or not and 
- Whether the build has been published
### Subscribers
The subscriber's for a product see the security information of a build only once it's been published. All the other builds' information is strictly private.

On the right side of the build's screen you can see the **Subscribers** information. 

![Product builds page subscribers information](../../img/start/subscribers.jpg "")

You can add subscribers to this product by clicking on the **invite** button. A potential subscriber needs to approve the invitation before they are subscribed to the product. You can see all the product's subscribers by clicking on the **Subscribers** tab at the top of the build page.

![Product builds page subscribers information](../../img/start/subscribers-1.jpg "")

Once you invite a subscriber they'll get an email similar to this one:

![subscriber invite email](../../img/start/subscriber-invite-b.jpg "")

A subscriber must have an account in **Scribe Hub** to be able to access information. Once they join they get a screen listing all the products they are subscribed to:

![subscriber screen](../../img/start/subscriber-screen-b.jpg "")

Once a software producer publishes a build version, all of the product's subscribers get this email:

![subscriber publish email](../../img/start/subscriber-publish-b.jpg "")

Clicking on the **View Release** will take them to the build information on their subscriber screen:

![subscriber screen](../../img/start/subscriber-release-1-b.jpg "")

Clicking on the build will take the subscriber to a more in-depth information screen:

![subscriber publish email](../../img/start/subscriber-release-2.jpg "")

Each of the **More>>** links leads to a full report about that topic.

### Build dashboard
Clicking on a build will take us to the main build dashboard - an overview screen that concentrates access to most of the build's information and reports. 

![Product build dashboard page](../../img/start/dashboard-start.jpg "")

The dashboard presents:

- The compliance level to each of the policies we check by default (SLSA up to level 3 and the SSDF)
- How many source files and OSS packages are in this build
- How many low, medium, high, and critical vulnerabilities are in this build
From this dashboard, at the top of the screen, you can access the following build reports:

- [﻿Products Page](product) 
- [﻿Compliance Report](compliance) 
- [﻿Vulnerabilities Report](vulnerabilities) 
- [﻿Advisories Report](advisories) 
- [﻿SBOM Report](sbom) 
- [﻿Licenses Report](licenses) 
- [﻿Context Report](context) 
- [﻿Investigation Page](investigation) 




<!--- Eraser file: https://app.eraser.io/workspace/CbwUwWKT4LLrqLrmnEVC --->