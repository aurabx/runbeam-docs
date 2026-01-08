---
sidebar_position: 4
---

# Pipelines

Pipelines connect endpoints to middleware chains and backends. Each pipeline file in the `pipelines/` directory defines how requests flow through your gateway.

## Pipeline Files

Pipeline files are stored in the directory specified by `pipelines_path` in `config.toml` (typically `pipelines/`):

```
config.toml
pipelines/
  ├── api.toml
  ├── fhir.toml
  └── transforms.toml
```

## Basic Pipeline Structure

A pipeline file defines endpoints, middleware, backends, and how they connect:

```toml
# pipelines/api.toml

[pipelines.api_gateway]
description = "Public API gateway"
networks = ["http_net"]
endpoints = ["api_endpoint"]
middleware = ["api_auth", "rate_limit"]
backends = ["api_backend"]

[endpoints.api_endpoint]
service = "http"

[endpoints.api_endpoint.options]
path_prefix = "/api"

[middleware.api_auth]
type = "jwt_auth"

[middleware.api_auth.options]
public_key_path = "/etc/harmony/jwt_public.pem"

[middleware.rate_limit]
type = "policies"

[middleware.rate_limit.options]
policies = ["rate_limiting"]

[backends.api_backend]
service = "http"

[backends.api_backend.options]
url = "http://backend.example.com"
```

## Pipeline Definition

The `[pipelines.<name>]` section binds everything together:

```toml
[pipelines.my_pipeline]
description = "Pipeline description"
networks = ["http_net"]           # Networks to listen on
endpoints = ["endpoint1"]         # Endpoints to expose
middleware = ["auth", "transform"] # Middleware chain (in order)
backends = ["backend1"]           # Available backends
```

### Multiple Pipelines

You can define multiple pipelines in a single file:

```toml
# Public API
[pipelines.public_api]
networks = ["public"]
endpoints = ["api_endpoint"]
middleware = ["public_auth"]
backends = ["api_backend"]

# Internal API
[pipelines.internal_api]
networks = ["internal"]
endpoints = ["admin_endpoint"]
middleware = ["internal_auth"]
backends = ["admin_backend"]
```

## Endpoints

Endpoints define public-facing routes:

```toml
[endpoints.fhir_endpoint]
service = "fhir"

[endpoints.fhir_endpoint.options]
path_prefix = "/fhir"
```

### HTTP Endpoint

```toml
[endpoints.http_endpoint]
service = "http"

[endpoints.http_endpoint.options]
path_prefix = "/api"
```

### FHIR Endpoint

```toml
[endpoints.fhir_endpoint]
service = "fhir"

[endpoints.fhir_endpoint.options]
path_prefix = "/fhir"
base_url = "https://fhir.example.com"
```

### DICOMweb Endpoint

```toml
[endpoints.dicomweb_endpoint]
service = "dicomweb"

[endpoints.dicomweb_endpoint.options]
path_prefix = "/dicomweb"
```

## Middleware

Middleware processes requests in the order listed in the pipeline:

```toml
[middleware.jwt_validator]
type = "jwt_auth"

[middleware.jwt_validator.options]
public_key_path = "/etc/harmony/jwt_public.pem"
issuer = "https://auth.example.com"
audience = "harmony-api"
```

### Ordering Matters

Middleware executes in the order defined in the pipeline:

```toml
[pipelines.secure_api]
middleware = [
    "authenticate",   # 1. Verify identity first
    "authorize",      # 2. Check permissions
    "transform"       # 3. Transform data
]
```

### Split Middleware Configuration (v0.9.0+)

You can configure different middleware for request and response paths using split configuration:

```toml
[pipelines.my_pipeline]
description = "Pipeline with split middleware"
networks = ["default"]
endpoints = ["api"]
backends = ["backend"]

[pipelines.my_pipeline.middleware]
left = ["auth", "validate"]      # Request path only
right = ["transform", "log"]     # Response path only
```

**Execution order:**
- **Left chain (request)**: Executes in order as request flows to backend
- **Right chain (response)**: Executes in exact order specified (not reversed)

**Use cases:**
- Request-only validation: `left = ["auth", "rate_limit"]` with empty right chain
- Response-only transforms: Empty left chain with `right = ["flatten", "log"]`
- Asymmetric processing: Different middleware on each side

**Note:** When using split configuration, middleware `apply` options (like `apply = "left"` in transform middleware) are ignored—the pipeline configuration controls which side the middleware runs on.

## Backends

Backends define where requests are sent:

```toml
[backends.api_backend]
service = "http"

[backends.api_backend.options]
url = "http://api.example.com"
timeout_secs = 30
```

### HTTP Backend

```toml
[backends.http_api]
service = "http"

[backends.http_api.options]
url = "http://backend.example.com"
timeout_secs = 30
```

### Echo Backend

For testing:

```toml
[backends.test_echo]
service = "echo"
```

### DICOMweb Backend

```toml
[backends.pacs]
service = "dicomweb"

[backends.pacs.options]
base_url = "https://pacs.example.com/dicomweb"
```

## Complete Example

Here's a complete pipeline configuration:

```toml
# pipelines/fhir-api.toml

# Pipeline definition
[pipelines.fhir_gateway]
description = "FHIR API with JWT authentication"
networks = ["http_net"]
endpoints = ["fhir_endpoint"]
middleware = [
    "fhir_auth",
    "fhir_policies",
    "patient_transform"
]
backends = ["fhir_backend"]

# Endpoints
[endpoints.fhir_endpoint]
service = "fhir"

[endpoints.fhir_endpoint.options]
path_prefix = "/fhir"

# Middleware
[middleware.fhir_auth]
type = "jwt_auth"

[middleware.fhir_auth.options]
public_key_path = "/etc/harmony/jwt_public.pem"
issuer = "https://auth.example.com"
audience = "fhir-api"

[middleware.fhir_policies]
type = "policies"

[middleware.fhir_policies.options]
policies = ["fhir_security"]

[middleware.patient_transform]
type = "transform"

[middleware.patient_transform.options]
spec_path = "patient_to_fhir.json"
apply = "left"
fail_on_error = true

# Backends
[backends.fhir_backend]
service = "http"

[backends.fhir_backend.options]
url = "https://fhir-server.example.com"
timeout_secs = 30
```

## Hot Reload

Pipeline files are automatically reloaded when changed:

1. Edit a pipeline file in `pipelines/`
2. Save the file
3. Harmony detects the change
4. Configuration reloads automatically

**Note**: Most pipeline changes apply without downtime. Network changes may require a brief restart.

## Validation

Harmony validates pipeline configuration on startup and reload:

- Networks must exist in `config.toml`
- Endpoints must reference valid services
- Middleware must reference valid middleware types
- Backends must reference valid services

Invalid configurations are rejected and logged with error details.

## Examples

See the [harmony-proxy repository](https://github.com/aurabx/harmony/tree/main/examples) for complete examples:

- `basic-echo/pipelines/` - Simple echo pipeline
- `transform/pipelines/` - Transform middleware example
- `fhir/pipelines/` - FHIR with authentication

## Next Steps

- [Configure Services →](../components/services.md) - Connect to backends
- [Configure Middleware →](../components/middleware.md) - Set up request/response processing
- [Configure Authentication →](../components/authentication.md) - Secure your gateway
- [Configure Transforms →](../components/transforms.md) - Transform data
