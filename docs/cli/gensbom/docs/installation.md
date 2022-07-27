
## Insallation
CLI installation options

<details>
  <summary> Pull binary </summary>

Get the gensbom tool
```bash
curl https://www.scribesecurity.com/getscribe | sh
```

</details>

<details>
  <summary> Apt repository </summary>

Download agent DEB package from https://scribesecuriy.jfrog.io/artifactory/scribe-debian-local/gensbom

```bash
wget -qO - https://scribesecuriy.jfrog.io/artifactory/api/security/keypair/scribe-artifactory/public | sudo apt-key add -
sudo sh -c "echo 'deb https://scribesecuriy.jfrog.io/artifactory/scribe-debian-local stable non-free' >> /etc/apt/sources.list"
apt-get install gensbom -t stable
```

</details>

<details>
  <summary> Docker image </summary>

You can pull the cli release binary wrapped in its relevant docker image (tag should equal the version).

```bash
docker pull scribesecuriy.jfrog.io/scribe-docker-public-local/gensbom:latest
```

</details>


<details>
  <summary> Release packages </summary>

Download a `.deb` or `.rpm` file from the [releases page](https://github.com/scribe-security/gensbom/releases)
and install with `dpkg -i` and `rpm -i` respectively.

```bash
dpkg -i <gensbom_package.deb>
gensbom --version
```

</details>