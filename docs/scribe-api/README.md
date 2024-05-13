---
sidebar_label: "Using Scribe API"
title: Using Scribe API
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 5
---

Scribe uses **[swagger-client](https://www.npmjs.com/package/swagger-client)** to enable access to our API. Swagger-client is a JavaScript module that allows you to fetch, resolve, and interact with OpenAPI documents to resolve API calls.

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

Install via [Setuptools](http://pypi.python.org/pypi/setuptools).

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

Create an API token in [Scribe Hub > Settings > Tokens](https://app.scribesecurity.com/settings/tokens). Copy it to a safe temporary notepad until you complete the integration.

:::note Important
The token is a secret and will not be accessible from the UI after you finalize the token generation. 
:::

```python
from __future__ import print_function
import time
import swagger_client
from swagger_client.rest import ApiException
from pprint import pprint

# Configure API key authorization: JWT
configuration = swagger_client.Configuration()
configuration.api_key['Authorization'] = <scribe-token>
# Replace <scribe-token> with the actual token you generated in Scribe Hub
# Uncomment below to setup prefix (e.g. Bearer) for API Token, if needed
# configuration.api_key_prefix['Authorization'] = 'Bearer'

# create an instance of the API class
api_instance = swagger_client.DatasetApi(swagger_client.ApiClient(configuration))
body = swagger_client.LoginRequest() # LoginRequest |  (optional)

try:
    # This endpoint is used to get an admin token.
    api_response = api_instance.get_admin_token_action(body=body)
    pprint(api_response)
except ApiException as e:
    print("Exception when calling DatasetApi->get_admin_token_action: %s\n" % e)

```

## Documentation for API Endpoints

All URIs are relative to *http://localhost:4000*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*DatasetApi* | get_admin_token_action | **GET** /dataset/token | This endpoint is used to get an admin token, either use client-id and secret OR the refresh token.
*DatasetApi* | get_datasets_action | **POST** /dataset/data | This endpoint is used to retrieve data from a dataset with a filter.
*DatasetApi* | list_datasets_input_action | **GET** /dataset | This endpoint is used to list the available datasets with their schema.
*DefaultApi* | dataset | **POST** /dataset/token | This endpoint is used to exchange a team product key with a superset data-access token.
*EvidenceApi* | delete_evidence_action | **DELETE** /evidence/{file_id} | Delete evidence object.
*EvidenceApi* | download_evidence_action | **GET** /evidence/{file_id} | Create pre-signed URL to POST file content.
*EvidenceApi* | finish_upload_evidence_action | **POST** /evidence/finish | Mark file transfer as finished.
*EvidenceApi* | list_evidence_action | **POST** /evidence/list | Get a list of processes for specific queries.
*EvidenceApi* | upload_evidence_action | **POST** /evidence | Create pre-signed URL to POST file content.

<!-- You can check out this example **[GitHub repository](https://github.com/scribe-security/scribe2/tree/bd07b4f58dfc196414f8d31edced0b159a78545d/superset-api-client-example)** to learn more. -->

### API Usage Examples

You can find working usage examples **[here](https://github.com/scribe-security/api-examples)**.
