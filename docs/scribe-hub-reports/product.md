---
sidebar_label: "Products"
# title: Products and Builds
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 5
---

### Products and Builds

This is the main page of the Scribe Hub. All of your products managed by the platform are presented here for easy access. 

<img src='../../img/start/products-start.jpg' alt='Products page'/>

At the top of the page there is a search bar to help you find the product you're looking for. You can search for a product by its name, a CVE it might contain, the date it was updated, etc.

Some of the information you can see about each product is:
* Whether the source code integrity was validated (based on the last build)
* How many subscribers does the product have
* When was the latest build version uploaded
* How many components does the product contains (based on the last build)
* How many High and Critical vulnerabilities does the product contains (based on the last build)
* How does the product measure up in regards to compliance with SSDF and SLSA

Clicking on a product would present that product information details including all its builds:

<img src='../../img/start/builds-start.jpg' alt='Product builds page'/>

For each of the product's builds you can see:
* The build's version ID
* When the build happened (Build date)
* Whether the build's source code integrity was validated
* How many High and Critical vulnerabilities are in the build
* How the build measure up in regards to compliance with SSDF and SLSA 
* Whether the build is signed or not and, if it was signed, whether the signature has been verified 
* Whether the build has been published

### Subscribers

The subscriber's for a product see the security information of a build only once it's been published. All the other builds' information is strictly private.

On the right side of the build's screen you can see the **Subscribers** information. 

<img src='../../img/start/subscribers.jpg' alt='Product builds page subscribers information' width='20%' min-width='200px'/>

You can add subscribers to this product by clicking on the **invite** button. A potential subscriber needs to approve the invitation before they are subscribed to the product. You can see all the product's subscribers by clicking on the **Subscribers** tab at the top of the build page.

<img src='../../img/start/subscribers-1.jpg' alt='Product builds page subscribers information' width='60%' min-width='500px'/>

Once you invite a subscriber they'll get an email similar to this one:

<img src='../../img/start/subscriber-invite-b.jpg' alt='subscriber invite email' width='50%' min-width='500px'/>

A subscriber must have an account in **Scribe Hub** to be able to access information. Once they join they get a screen listing all the products they are subscribed to:

<img src='../../img/start/subscriber-screen-b.jpg' alt='subscriber screen' />

Once a software producer publishes a build version, all of the product's subscribers get this email:

<img src='../../img/start/subscriber-publish-b.jpg' alt='subscriber publish email' width='50%' min-width='500px'/>

Clicking on the **View Release** will take them to the build information on their subscriber screen:

<img src='../../img/start/subscriber-release-1-b.jpg' alt='subscriber screen' />

Clicking on the build will take the subscriber to a more in-depth information screen:

<img src='../../img/start/subscriber-release-2.jpg' alt='subscriber publish email' width='60%' min-width='500px'/>

Each of the **More>>** links leads to a full report about that topic.

### Build dashboard

Clicking on a build will take us to the main build dashboard - an overview screen that concentrates access to most of the build's information and reports. 

<img src='../../img/start/dashboard-start.jpg' alt='Product build dashboard page'/>

The dashboard presents:
* The compliance level to each of the policies we check by default (SLSA up to level 3 and the SSDF)
* How many source files and OSS packages are in this build
* How many low, medium, high, and critical vulnerabilities are in this build

From this dashboard, at the top of the screen, you can access the following build reports:
* [Compliance Report](compliance)
* [Vulnerabilities Report](vulnerabilities)
* [SBOM Report](sbom)
* [Licenses Report](licenses)
* [Context Report](context)




