// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

var branch = require('child_process')
  .execSync('git branch --show-current')
  .toString().trim();
branch = branch ? branch : process.env.HEAD?.toString() ?? "";
var isPullRequest = process.env.PULL_REQUEST === "true";
// console.log(process.env);

/** @type {import('@docusaurus/types').Config} */
const config = {
  /*scripts: [
    {
      src: 'https://cdn.gtranslate.net/widgets/latest/dwf.js',
      defer: true
    }
  ],*/
  clientModules: [
    require.resolve('./static/js/gTranslate.js'),
  ],
  plugins: [
    require.resolve('docusaurus-lunr-search'),
    [
      '@docusaurus/plugin-sitemap', 
      {
        id: 'sitemap',
        changefreq: 'weekly',
        priority: 0.5,
        ignorePatterns: ['/tags/**'],
        filename: 'sitemap.xml',
      }
    ]
    // [
    //   "@docusaurus/plugin-client-redirects",
    //     {
    //       createRedirects(existingPath) {
    //         if (existingPath.includes('docs/advanced-guide/ssc-regulations')) {
    //           // Redirect from /docs/team/X to /community/X and /docs/support/X to /community/X
    //           return [
    //             existingPath.replace('/advanced-guide/ssc-regulations/ssdfpolicies', '/ssdfpolicies'),
    //             existingPath.replace('/advanced-guide/ssc-regulations/slsapolicies', '/slsapolicies'),
    //           ];
    //         }  
    //       }
    //     }
    // ]
  ],

  title: 'The Scribe Documentation Site',
  tagline: 'Four legs good. Two legs bad.',
  url: 'https://profound-wisp-8a86b9.netlify.app/',
  baseUrl: '/',
  //onBrokenLinks: 'throw',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          include: [
            ...((isPullRequest && branch.includes("dev-preview") || 
              (!isPullRequest && branch == "dev") )) ? [
              '**/*.md',
              ] : [
                "introducing-scribe/what-is-scribe.md",
                "introducing-scribe/scribe-hub.md",
                "introducing-scribe/stand-alone.md",
                "quick-start/README.md",
                "guides/manag-sbom-and-vul.md",
                "guides/secure-sfw-slsa/README.md",
                "guides/secure-sfw-slsa/slsa-lvl-1.md",
                "guides/secure-sfw-slsa/slsa-lvl-2.md",
                "guides/secure-sfw-slsa/slsa-on-scale.md",
                "guides/secure-sfw-slsa/slsa-lvl-3.md",
                "guides/secure-sfw-slsa/customizing-provenance.md",
                "guides/secure-sfw-slsa/basic-examples.md",
                // "guides/secure-sfw-slsa/cosign-keyverno.md",
                "guides/secure-sfw-slsa/slsapolicies.md",
                "guides/enforcing-sdlc-initiative.md",
                "guides/ssdf-compliance/README.md",
                "guides/ssdf-compliance/ssdfpolicies.md",
                "guides/enforcing-sdlc-policy.md",
                "guides/securing-builds.md",
                "integrating-scribe/ci-integrations/README.md",
                "integrating-scribe/ci-integrations/github/github.md",
                "integrating-scribe/ci-integrations/github/action-slsa.md",
                "integrating-scribe/ci-integrations/github/action-bom.md",
                "integrating-scribe/ci-integrations/github/action-verify.md",
                "integrating-scribe/ci-integrations/github/action-evidence.md",
                "integrating-scribe/ci-integrations/github/action-installer.md",
                "integrating-scribe/ci-integrations/jenkins.md",
                "integrating-scribe/ci-integrations/example.md",
                "integrating-scribe/ci-integrations/general.md",
                "integrating-scribe/ci-integrations/azure.md",
                "integrating-scribe/ci-integrations/bitbucket.md",
                "integrating-scribe/ci-integrations/circleci.md",
                "integrating-scribe/ci-integrations/gitlabci.md",
                "integrating-scribe/ci-integrations/travis.md",
                "integrating-scribe/ci-integrations/tekton.md",
                "integrating-scribe/ci-integrations/valint-ci-configuration.md",
                "integrating-scribe/other-evidence-stores.md",
                "integrating-scribe/vulnerability-scanners.md",
                "integrating-scribe/jira.md",
                // "integrating-scribe/git-repositories.md",
                // "integrating-scribe/package-repositories.md",
                "valint/README.md",
                "valint/overview.md",
                "valint/getting-started-valint.md",
                "valint/attestations.md",
                "valint/generic.md",
                "valint/pram_summary.md",
                "valint/policy-results.md",
                "valint/policies.md",
                "valint/sbom.md",
                "valint/cosign.md",
                "valint/configuration.md",
                "valint/pram_summary.md",
                "valint/help/reference.md",
                "valint/help/valint.md",
                "valint/help/valint_bom.md",
                "valint/help/valint_verify.md",
                "valint/help/valint_slsa.md",
                "valint/help/valint_list.md",
                "valint/help/valint_discard.md",
                "valint/help/valint_download.md",
                "valint/help/valint_evidence.md",
                "valint/initiatives.md",
                "integrating-scribe/admission-controller/gatekeeper-provider.md",
                "integrating-scribe/admission-controller/kyverno.md",
                "scribe-hub-reports/README.md",
                "scribe-hub-reports/product.md",
                "scribe-hub-reports/compliance.md",
                "scribe-hub-reports/context.md",
                // "scribe-hub-reports/evidence.md",
                "scribe-hub-reports/advisories.md",
                "scribe-hub-reports/investigation.md",
                "scribe-hub-reports/licenses.md",
                "scribe-hub-reports/sbom.md",
                "scribe-hub-reports/vulnerabilities.md",                                                                               
                "scribe-api/README.md",
                "platforms/gitlab-integration.md",
                "platforms/github-integration.md",
                "platforms/jenkins-integration.md",
                "platforms/overview.md",
                "platforms/discover.md",
                "platforms/bom.md",
                "platforms/evidence.md",
                "platforms/verify.md",
                "platforms/generate_k8s_token.md",
                "platforms/usage.md",
                "platforms/hooks.md",
                "release-notes/rns.md",
                "configuration/**/*.md",
                "configuration/*.md",


                // "advanced-guide/generating-sboms.md",
                // "advanced-guide/source-code-integrity.md",
                // "advanced-guide/standalone-deployment/README.md",
                // "advanced-guide/standalone-deployment/signVerify.md",
                // "advanced-guide/standalone-deployment/action-bom.md",
                // "advanced-guide/standalone-deployment/action-verify.md",
                // "advanced-guide/standalone-deployment/action-installer.md",
                // "advanced-guide/standalone-deployment.md",
                // "advanced-guide/action-bom.md",
                // "advanced-guide/action-verify.md",
                // "advanced-guide/action-installer.md",
                // "advanced-guide/ssc-regulations/README.md",
                // "advanced-guide/ssc-regulations/slsapolicies.md",
                // "advanced-guide/ssc-regulations/ssdfpolicies.md"
              ],
            ],
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //  'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },


      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
    //   announcementBar: {
    //   id: 'new_documentation',
    //   content:
    //     'The new Scribe documentation website is live!',
    //   backgroundColor: '#fafbfc',
    //   textColor: '#091E42',
    //   isCloseable: false,
    // },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 5,
    },
    navbar: {
      // title: 'My Site',
      logo: {
        alt: 'Scribe Security Logo',
        src: 'img/Scribe_dark.svg',
        srcDark: 'img/Scribe_white.svg',
        href: 'https://scribesecurity.com/',
      },
      items: [
        {
          type: 'html',
          position: 'right',
          value: '<div id="gtranslateBlock"><div class="gtranslate_wrapper"></div></div>',
        },
        // {
        //   type: 'doc',
        //   docId: 'overview',
        //   position: 'left',
        //   label: 'Overview',
        // },
        // {
        //   type: 'doc',
        //   docId: 'intro',
        //   position: 'left',
        //   label: 'Getting Started',
        // },
        // {to: 'docs/introducing-scribe/what-is-scribe', label: 'What Is Scribe', position: 'left'},
        // {to: 'docs/quick-start/demo', label: 'Quick Start', position: 'left'},
        // {to: 'docs/guides/manag-sbom-and-vul', label: 'Guides', position: 'left'},
        // {to: 'docs/integrating-scribe/ci-integrations', label: 'Integrating with Scribe', position: 'left'},  
        // {to: 'docs/advanced-guide/standalone-deployment', label: 'Advanced Guide', position: 'left'},  
        // {to: 'docs/scribe-hub-reports', label: 'Scribe Hub Reports', position: 'left'},
        // {to: 'docs/scribe-api', label: 'Scribe API', position: 'left'},
        // {
        //   type: 'doc',
        //   docId: 'sampleproject',
        //   position: 'left',
        //   label: 'Sample Project',
        // },
        // {
        //   type: 'doc',
        //   docId: 'cves',
        //   position: 'left',
        //   label: 'Detecting CVEs',
        // },
        // {
        //   type: 'doc',
        //   docId: 'readingoutput',
        //   position: 'left',
        //   label: 'Reading Analysis',
        // },
        // {
        //   type: 'doc',
        //   docId: 'cveReports',
        //   position: 'left',
        //   label: 'CVE Reports',
        // },
        // {
        //   type: 'doc',
        //   docId: 'glossary',
        //   position: 'left',
        //   label: 'Glossary',
        // }
        // {to: '/blog', label: 'Blog', position: 'left'},
        // {
        //   href: 'https://github.com/facebook/docusaurus',
        //   label: 'GitHub',
        //   position: 'right',
        // },
        ],
      },
      // footer: {
      //   style: 'dark',
      //   links: [
      //     {
      //       title: 'Docs',
      //       items: [
      //         {
      //           label: 'Tutorial',
      //           to: '/docs/intro',
      //         },
      //       ],
      //     },
      //     {
      //       title: 'Community',
      //       items: [
      //         {
      //           label: 'Stack Overflow',
      //           href: 'https://stackoverflow.com/questions/tagged/docusaurus',
      //         },
      //         {
      //           label: 'Discord',
      //           href: 'https://discordapp.com/invite/docusaurus',
      //         },
      //         {
      //           label: 'Twitter',
      //           href: 'https://twitter.com/docusaurus',
      //         },
      //       ],
      //     },
      //     {
      //       title: 'More',
      //       items: [
      //         {
      //           label: 'GitHub',
      //           href: 'https://github.com/facebook/docusaurus',
      //         },
      //       ],
      //     },
      //   ],
      //   copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      // },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
