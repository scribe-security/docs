<p><a target="_blank" href="https://app.eraser.io/workspace/WWib046210zoFoo8PhD0" id="edit-in-eraser-github-link"><img alt="Edit in Eraser" src="https://firebasestorage.googleapis.com/v0/b/second-petal-295822.appspot.com/o/images%2Fgithub%2FOpen%20in%20Eraser.svg?alt=media&amp;token=968381c8-a7e7-472a-8ed6-4a6626da5501"></a></p>

---

## sidebar_label: "Using Scribe API"
title: Using Scribe API
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 5
The first step in accessing Scribe's API is getting an API key. Scribe uses the auth0 [﻿client credentials flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-client-credentials-flow) to enable you to retrieve an API key.

To request a token run this script:

```
curl --request POST \
--url 'https://scribe-hub-production.us.auth0.com/oauth/token' \
--header 'content-type: application/x-www-form-urlencoded' \
--data grant_type='client_credentials' \
--data client_id=YOUR_CLIENT_ID \
--data client_secret=YOUR_CLIENT_SECRET \
--data audience='api.production.scribesecurity.com'
```
The `CLIENT_ID` and `CLIENT_SECRET` in this script are the same `CLIENT_ID` and `CLIENT_SECRET` you can retrieve from your [﻿Scribe Hub](https://scribehub.scribesecurity.com/) **Integrations** page. 

![Scribe Integration Secrets](../../img/ci/integrations-secrets.jpg "")

The response to the token request looks like this:

```
{
  "access_token":"eyJz93a...k4laUWw",
  "token_type":"Bearer",
  "expires_in":86400
}
```
The `access_token` in the response is your API key.

Scribe uses [﻿swagger-client](https://www.npmjs.com/package/swagger-client) to enable access to our API. Swagger-client is a JavaScript module that allows you to fetch, resolve, and interact with OpenAPI documents to resolve API calls.

To use it you should first download and install swagger-client. If the Python package is hosted on GitHub, you can install it directly from GitHub

```sh
pip install git+https://github.com//.git
```
(you may need to run `pip` with root permission: `sudo pip install git+https://github.com//.git`)

Then import the package:

```python
import swagger_client
```
### Setuptools
Install via [﻿Setuptools](http://pypi.python.org/pypi/setuptools).

```sh
python setup.py install --user
```
(or `sudo python setup.py install` to install the package for all users)

Then import the package:

```python
import swagger_client
```
## Getting Started
Please follow the installation procedure and then run the following:

```python
from __future__ import print_function
import time
import swagger_client
from swagger_client.rest import ApiException
from pprint import pprint

# Configure API key authorization: JWT
configuration = swagger_client.Configuration()
configuration.api_key['Authorization'] = 'YOUR_API_KEY'
# Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
# configuration.api_key_prefix['Authorization'] = 'Bearer'

# create an instance of the API class
api_instance = swagger_client.DatasetApi(swagger_client.ApiClient(configuration))
body = swagger_client.LoginRequest() # LoginRequest |  (optional)

try:
    # This endpoint is used to get an admin token, either use client-id and secret OR the refresh token.
    api_response = api_instance.get_admin_token_action(body=body)
    pprint(api_response)
except ApiException as e:
    print("Exception when calling DatasetApi->get_admin_token_action: %s\n" % e)
```
## Documentation for API Endpoints
All URIs are relative to [﻿http://localhost:4000](http://localhost:4000/) 

| Class | Method | HTTP request | Description |
| ----- | ----- | ----- | ----- |
| _DatasetApi_ | get_admin_token_action | <p>**GET**</p><p> /dataset/token</p> | This endpoint is used to get an admin token, either use client-id and secret OR the refresh token. |
| _DatasetApi_ | get_datasets_action | <p>**POST**</p><p> /dataset/data</p> | This endpoint is used to retrieve data from a dataset with a filter. |
| _DatasetApi_ | list_datasets_input_action | <p>**GET**</p><p> /dataset</p> | This endpoint is used to list the available datasets with their schema. |
| _DefaultApi_ | dataset | <p>**POST**</p><p> /dataset/token</p> | This endpoint is used to exchange a team product key with a superset data-access token. |
| _EvidenceApi_ | delete_evidence_action | <p>**DELETE**</p><p> /evidence/{file_id}</p> | Delete evidence object. |
| _EvidenceApi_ | download_evidence_action | <p>**GET**</p><p> /evidence/{file_id}</p> | Create pre-signed URL to POST file content. |
| _EvidenceApi_ | finish_upload_evidence_action | <p>**POST**</p><p> /evidence/finish</p> | Mark file transfer as finished. |
| _EvidenceApi_ | list_evidence_action | <p>**POST**</p><p> /evidence/list</p> | Get a list of processes for specific queries. |
| _EvidenceApi_ | upload_evidence_action | <p>**POST**</p><p> /evidence</p> | Create pre-signed URL to POST file content. |
### API Usage Examples
You can find working usage examples [﻿here](https://github.com/scribe-security/api-examples).



<!--- Eraser file: https://app.eraser.io/workspace/WWib046210zoFoo8PhD0 --->