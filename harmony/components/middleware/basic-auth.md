---
sidebar_label: Basic Auth
---

# Basic Auth

Validates username/password combinations from `Authorization: Basic` headers.

## Configuration

```toml
[middleware.basic_auth_example]
type = "basic_auth"
username = "test_user"
password = "test_password"
# token_path = "/tmp/test_token"  # optional
```

## Options

- `username` (string, required) - Username to validate
- `password` (string, required) - Password to validate
- `token_path` (string, optional) - File path for pre-shared token

## Error handling

Authentication failures return HTTP `401 Unauthorized`.

## Notes

Only use with HTTPS in production.

## Example pipeline

```toml
[pipelines.secure_api]
description = "API with basic authentication"
networks = ["default"]
endpoints = ["http_api"]
middleware = ["auth"]
backends = ["api_server"]

[endpoints.http_api]
service = "http"

[middleware.auth]
type = "basic_auth"
username = "admin"
password = "secure_password"

[backends.api_server]
service = "http"
```

## Related

- [← Middleware](../middleware.md)
