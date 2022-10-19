# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

### DEV
* Branch `dev` is deployed (updated on each push).
Access it by `dev--<docs_domain>.com`
Each PR opens a preview site.
* `https://deploy-preview-<PR NUMBER>--<docs_domain>.com`
* Branch dev will include the entire site.
* Master will include only the public site. (See docusaurus.config.js for full list).
* PR preview - will show preview will deploy only the public part.
* PR including `dev-preview` prefix will show the preview of the entire site.

### Git flow - create feature

1) Create new feature from latest `dev`.
```bash git-flow/checkout_feature.sh <feature_name>```

2) Add changes to feature
```
git add ...
git commit -m ...
```
**vscode**
* select `Source control` on Left Bar
* select `Source control` on Left Bar
* press Plus sign next to files modified.
* Enter commit message
* Select commit

3) Publish feature 
```
bash git-flow/publish_feature.sh <feature_name>
```

4) Create PR on github or vscode plugin from feature branch to dev.
**vscode**
* select `Github extension` on Left Bar
* Select `Create Pull request`
* Change Into branch to `dev`
* Add discription
* Select Create

5) Reviews. comments

6) Fixs to PR

Move to feature branch first - 
If currently checkout out another feature please first commit current changes (you don't have to publish if you don't want to change remote)
then run ```bash git-flow/checkout_feature.sh <feature_name>```

Add Needed changes to PR

7) Republish feature (will update the PR)
```
bash git-flow/publish_feature.sh <feature_name>
```

9) PR is approved - select sqaush merge PR

### Dev was updated while working on feature branch
Note: if don't need the updates in your feature branch you don't need to do this!

1) rebase from dev
```bash git-flow/refresh_feature.sh <feature_name>```
Rebasing dev may require to solve some conflicts if updated dev files are also changed in the feature branch.
2) Force publish feature branch
```git push -f origin dev-preview/<feature_name>```