// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
var branch = require('child_process')
  .execSync('git branch --show-current')
  .toString().trim();
branch = branch ? branch : process.env.HEAD?.toString() ?? "";
var isPullRequest = process.env.PULL_REQUEST === "true";
// console.log(process.env);

/** @type {import('@docusaurus/types').Config} */
const config = {
  plugins: [
    require.resolve('docusaurus-lunr-search'),
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
                "getting-started/quick-start/demo.md",
                "getting-started/quick-start/set-up-integration/set-up-github.md",
                "guides/manag-sbom-and-vul.md",
                "guides/secure-sfw-slsa.md",
                "guides/enforcing-sdlc-policy.md",
                "guides/ssdf-compliance.md",
                "integrating-scribe/ci-integrations/README.md",
                "integrating-scribe/ci-integrations/github.md",
                "integrating-scribe/ci-integrations/jenkins.md",
                "integrating-scribe/ci-integrations/example.md",
                "integrating-scribe/ci-integrations/general.md",
                "integrating-scribe/ci-integrations/azure.md",
                "integrating-scribe/ci-integrations/bitbucket.md",
                "integrating-scribe/ci-integrations/circleci.md",
                "integrating-scribe/ci-integrations/gitlabci.md",
                "integrating-scribe/ci-integrations/travis.md",
                "integrating-scribe/git-repositories.md",
                "integrating-scribe/package-repositories.md",
                "integrating-scribe/valint/README.md",
                "integrating-scribe/valint/getting-started-valint.md",
                "integrating-scribe/valint/valint-command-summary.md",
                "integrating-scribe/valint/configuration.md",
                "integrating-scribe/valint/policies.md",
                "integrating-scribe/valint/docs/attestations.md",
                "integrating-scribe/valint/docs/configuration.md",
                "integrating-scribe/valint/docs/command/valint.md",
                "integrating-scribe/valint/docs/command/valint_bom.md",
                "integrating-scribe/valint/docs/command/valint_verify.md",
                "integrating-scribe/k8s-admission-controller.md",
                "advanced-guide/generating-sboms.md",
                "advanced-guide/source-code-integrity.md",
                "advanced-guide/standalone-deployment/signVerify.md",
                "advanced-guide/standalone-deployment/github-actions/action-bom.md",
                "advanced-guide/standalone-deployment/github-actions/action-verify.md",
                "advanced-guide/standalone-deployment/github-actions/action-installer.md",
                "advanced-guide/ssc-regulations/README.md",
                "advanced-guide/ssc-regulations/slsapolicies.md",
                "advanced-guide/ssc-regulations/ssdfpolicies.md",
                "advanced-guide/scribe-hub-reports/README.md",
                "advanced-guide/scribe-hub-reports/compliance.md",
                "advanced-guide/scribe-hub-reports/context.md",
                "advanced-guide/scribe-hub-reports/evidence.md",
                "advanced-guide/scribe-hub-reports/investigation.md",
                "advanced-guide/scribe-hub-reports/licenses.md",
                "advanced-guide/scribe-hub-reports/sbom.md",
                "advanced-guide/scribe-hub-reports/vulnerabilities.md"                                                                               
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
        {to: 'docs/introducing-scribe/what-is-scribe', label: 'What Is Scribe', position: 'left'},
        {to: 'docs/getting-started/quick-start/demo', label: 'Quick Start', position: 'left'},
        {to: 'docs/guides/manag-sbom-and-vul', label: 'Guides', position: 'left'},
        {to: 'docs/integrating-scribe/ci-integrations', label: 'Integrating with Scribe', position: 'left'},  
        {to: 'docs/advanced-guide/generating-sboms', label: 'Advanced Guide', position: 'left'},  
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
