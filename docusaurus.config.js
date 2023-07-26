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
  plugins: [require.resolve('docusaurus-lunr-search')],

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
                "getting-started/introducing-scribe.md",
                "getting-started/how-scribe-works.md",
                "getting-started/quick-start.md",
                "use-cases/software-producer/managing-products.md",
                "use-cases/software-producer/generating-sboms.md",
                "use-cases/software-producer/importing-sboms.md",
                "use-cases/software-producer/sharing-sboms.md",
                "use-cases/software-producer/building-secure-software/source-code-integrity.md",
                "use-cases/software-producer/building-secure-software/sign-verify.md",
                "use-cases/software-producer/building-secure-software/tracking-vulnerabilities.md",
                "use-cases/software-producer/building-secure-software/complying-security-standards.md",
                "use-cases/software-consumer/managing-sboms.md",
                "use-cases/software-consumer/tracking-vulnerabilities.md",
                "use-cases/software-consumer/applying-policies.md",
                "how-to-run-scribe/README.mdx",
                "how-to-run-scribe/ci-integrations/README.md",
                "how-to-run-scribe/ci-integrations/github/README.md",
                "how-to-run-scribe/ci-integrations/github/action-bom.md",
                "how-to-run-scribe/ci-integrations/github/action-verify.md",
                "how-to-run-scribe/ci-integrations/github/action-installer.md",
                "how-to-run-scribe/ci-integrations/github/docs/attestations.md",
                "how-to-run-scribe/ci-integrations/github/docs/configuration.md",
                // "how-to-run-scribe/ci-integrations/jenkins/README.md",
                "how-to-run-scribe/ci-integrations/jenkins.md",
                "how-to-run-scribe/ci-integrations/example.md",
                "how-to-run-scribe/ci-integrations/general.md",
                "how-to-run-scribe/ci-integrations/azure.md",
                "how-to-run-scribe/ci-integrations/bitbucket.md",
                "how-to-run-scribe/ci-integrations/circleci.md",
                "how-to-run-scribe/ci-integrations/gitlabci.md",
                "how-to-run-scribe/ci-integrations/travis.md",
                // "how-to-run-scribe/sampleproject.md",
                // "how-to-run-scribe/CLI/README.md",
                "how-to-run-scribe/valint/README.md",
                "how-to-run-scribe/valint/docs/command/valint.md",
                "how-to-run-scribe/valint/docs/command/valint_bom.md",
                "how-to-run-scribe/valint/docs/command/valint_slsa.md",
                "how-to-run-scribe/valint/docs/command/valint_verify.md",
                "how-to-run-scribe/valint/docs/attestations.md",
                "how-to-run-scribe/valint/docs/configuration.md",
                "how-to-run-scribe/valint/report.md",
                "how-to-run-scribe/valint/policies.md",
                "how-to-run-scribe/valint/slsa.md",
                "how-to-run-scribe/valint/command/valint.md",
                // "how-to-run-scribe/valint/command/valint_report.md",
                // "how-to-run-scribe/gensbom/gensbomcli.md",
                "how-to-run-scribe/scribe-hub-reports/README.md",
                "how-to-run-scribe/scribe-hub-reports/compliance.md",
                "how-to-run-scribe/scribe-hub-reports/vulnerabilities.md",
                "how-to-run-scribe/scribe-hub-reports/sbom.md",
                "how-to-run-scribe/scribe-hub-reports/licenses.md",
                "how-to-run-scribe/scribe-hub-reports/context.md",
                "how-to-run-scribe/scribe-hub-reports/evidence.md",
                "how-to-run-scribe/scribe-hub-reports/investigation.md",
                "how-to-run-scribe/signVerify.md",
                "how-to-run-scribe/admission-controller.md",
                "how-to-run-scribe/Help/README.md",
                "how-to-run-scribe/Help/search-help.md",
                "ssc-regulations/README.md",
                "ssc-regulations/slsapolicies.md",
                "ssc-regulations/ssdfpolicies.md",
                "glossary.md",
                // "other-integrations/admission-controller.md",
                // "cves.md",
                // "use-cases/Use-Cases.md",
                // "use-cases/source-code-integrity.md",
                // "use-cases/compliance.md",
                // "use-cases/sboms.md",
                // "cveReports.md",
                // "signVerify.md",
                // "intro.md",
                // "sampleproject.md",
                // "gensbomcli.md",
                // "readingoutput.md",
                // "faq.md",
                // "overview.md" ,
                // "slsapolicies.md",
                // "ssdfpolicies.md",
                // "glossary.md",
                // "README.md",
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
        {to: 'docs/getting-started/introducing-scribe', label: 'Getting Started', position: 'left'},
        {to: 'docs/use-cases/software-producer/managing-products', label: 'Use Cases', position: 'left'},
        {to: 'docs/how-to-run-scribe/', label: 'How to run Scribe', position: 'left'},   
        {to: 'docs/ssc-regulations/', label: 'SSC Regulations', position: 'left'},  
        {to: 'docs/glossary', label: 'Glossary', position: 'left'},    
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
