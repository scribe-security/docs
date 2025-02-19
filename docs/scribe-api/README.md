---
sidebar_label: "Using Scribe API"
title: Using Scribe API
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# Accessing the Scribe Security API  

Scribe provides a **Swagger API**, which you can explore **[here](https://api.scribesecurity.com/v1/swaggerui)**.  

For working usage examples, visit our **[GitHub repository](https://github.com/scribe-security/api-examples)**.  

## Steps to Access the API  

Follow these steps to authenticate and start using the Scribe API:  

1. **Generate an API Token**  
   - Navigate to **[Scribe Hub > Settings > Tokens](https://app.scribesecurity.com/settings/tokens)**.  
   - Create a new API token.  

2. **Obtain a JWT Token**  
   - Call the `/v1/login` API endpoint.  
   - Refer to the **[Swagger documentation](https://api.scribesecurity.com/v1/swaggerui#/login)** for request details.  
   - The `access_token` in the response is your API key.  

Once authenticated, you can use this token to access other API endpoints securely.  
