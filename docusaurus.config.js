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
                "ci-integrations/github/README.md",
                "ci-integrations/github/action-bom.md",
                "ci-integrations/github/action-verify.md",
                "ci-integrations/github/action-installer.md",
                "ci-integrations/github/docs/attestations.md",
                "ci-integrations/github/docs/configuration.md",
                "ci-integrations/jenkins/README.md",
                "ci-integrations/example.md",
                "ci-integrations/general.md",
                "ci-integrations/README.md",
                "ci-integrations/azure.md",
                "ci-integrations/bitbucket.md",
                "ci-integrations/circleci.md",
                "ci-integrations/gitlabci.md",
                "ci-integrations/travis.md",
                //"CLI/README.md",
                //"CLI/valint/README.md",
                // "CLI/valint/report.md",
                "CLI/gensbom/gensbomcli.md",
                //"CLI/valint/command/valint.md",
                //"CLI/valint/command/valint_report.md",
                // "cves.md",
                "cveReports.md",
                "signVerify.md",
                "intro.md",
                "sampleproject.md",
                //"gensbomcli.md",
                "readingoutput.md",
                "faq.md",
                "overview.md" ,
                "slsapolicies.md",
                "glossary.md",
                "README.md",
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
          type: 'doc',
          docId: 'overview',
          position: 'left',
          label: 'Overview',
        },
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Getting Started',
        },
        {to: 'docs/ci-integrations/', label: 'CI Integration', position: 'left'},          
        {
          type: 'doc',
          docId: 'sampleproject',
          position: 'left',
          label: 'Sample Project',
        },
        {
          type: 'doc',
          docId: 'cves',
          position: 'left',
          label: 'Detecting CVEs',
        },
        {
          type: 'doc',
          docId: 'readingoutput',
          position: 'left',
          label: 'Reading Analysis',
        },
        {
          type: 'doc',
          docId: 'cveReports',
          position: 'left',
          label: 'CVE Reports',
        },
        {
          type: 'doc',
          docId: 'glossary',
          position: 'left',
          label: 'Glossary',
        }
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
