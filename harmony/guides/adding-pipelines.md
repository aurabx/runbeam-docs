---
sidebar_position: 5
---

# Adding a New Pipeline

This guide explains how to add a new pipeline to your running Harmony instance without downtime.

## Quick Start

1. Create a new TOML file in your `pipelines/` directory
2. Define your pipeline configuration
3. Save the file
4. Harmony automatically detects and loads it

## Step-by-Step

### 1. Create the Pipeline File

Create a new file in your `pipelines/` directory:

```bash
# Example: Add a new FHIR search pipeline
touch pipelines/fhir-search.toml
```

Files in the `pipelines/` directory are automatically discovered. You can organize them however you prefer:

```
pipelines/
  ├── api.toml           # Existing pipeline
  ├── fhir.toml          # Existing pipeline
  └── fhir-search.toml   # New pipeline
```

### 2. Write Your Pipeline Configuration

Open the file and define your pipeline. Here's a minimal example:

```toml
# pipelines/fhir-search.toml

[pipelines.fhir_search]
description = "FHIR patient search endpoint"
networks = ["http_net"]
endpoints = ["fhir_search_endpoint"]
middleware = ["fhir_auth"]
backends = ["fhir_backend"]

[endpoints.fhir_search_endpoint]
service = "fhir"

[endpoints.fhir_search_endpoint.options]
path_prefix = "/fhir/search"

[middleware.fhir_auth]
type = "jwt_auth"

[middleware.fhir_auth.options]
public_key_path = "/etc/harmony/jwt_public.pem"

[backends.fhir_backend]
service = "http"

[backends.fhir_backend.options]
url = "https://fhir-server.example.com"
timeout_secs = 30
```

For detailed configuration options, see the [Pipelines reference](../configuration/pipelines.md).

### 3. Save and Harmony Reloads Automatically

When you save the file:

1. Harmony's hot-reload system detects the new file
2. Configuration is validated
3. The pipeline is loaded into the running instance
4. **No restart required** (most changes apply without downtime)

### 4. Verify the Pipeline

Check your Harmony logs to confirm the pipeline loaded successfully:

```bash
# Look for confirmation in logs
tail -f /var/log/harmony/harmony.log
```

You should see output like:
```
[INFO] Pipeline fhir_search loaded successfully
```

Make a test request to verify the endpoint is responding:

```bash
curl -H "Authorization: Bearer <your_jwt_token>" \
  http://localhost:8080/fhir/search/Patient?name=Smith
```

## Reusing Existing Components

You don't need to redefine middleware or backends if they already exist in other pipeline files. Reference them by name:

```toml
# pipelines/new-endpoint.toml

# Reuse existing auth middleware and backend from other pipelines
[pipelines.new_service]
networks = ["http_net"]
endpoints = ["new_endpoint"]
middleware = ["fhir_auth"]        # Defined elsewhere
backends = ["fhir_backend"]        # Defined elsewhere

[endpoints.new_endpoint]
service = "http"

[endpoints.new_endpoint.options]
path_prefix = "/new-service"
```

## Common Patterns

### Multiple Endpoints in One Pipeline

```toml
[pipelines.multi_endpoint]
endpoints = ["endpoint1", "endpoint2", "endpoint3"]
middleware = ["auth"]
backends = ["backend1"]

[endpoints.endpoint1]
service = "fhir"
[endpoints.endpoint1.options]
path_prefix = "/fhir"

[endpoints.endpoint2]
service = "http"
[endpoints.endpoint2.options]
path_prefix = "/api"

[endpoints.endpoint3]
service = "dicomweb"
[endpoints.endpoint3.options]
path_prefix = "/dicom"
```

### Middleware Chain

Middleware executes in order. Define a chain for complex request processing:

```toml
[pipelines.secure_api]
middleware = [
    "auth",           # 1. Authenticate first
    "policies",       # 2. Check authorization
    "transform",      # 3. Transform data
    "rate_limit"      # 4. Rate limiting
]
```

### Multiple Backends

Some pipeline use cases may require routing to different backends:

```toml
[pipelines.hybrid_api]
backends = ["primary_backend", "fallback_backend"]
```

## Troubleshooting

### Pipeline Not Loading

Check the following:

1. **File syntax** - Ensure valid TOML syntax. Use a TOML validator if unsure.
2. **Referenced components** - Verify all networks, endpoints, middleware, and backends exist.
3. **File location** - Confirm the file is in the `pipelines_path` directory specified in `config.toml`.
4. **Permissions** - Ensure Harmony has read access to the file.

### Validation Errors

Harmony logs validation errors when loading fails:

```bash
# Check logs for detailed error messages
grep -i "error\|invalid" /var/log/harmony/harmony.log
```

Common validation errors:

- **Unknown network** - Network defined in pipeline doesn't exist in `config.toml`
- **Unknown service** - Service type (e.g., `fhir`, `http`) is not recognized
- **Missing middleware** - Middleware referenced in pipeline isn't defined
- **Invalid options** - Middleware or backend options are invalid for that service type

### Reload Not Detected

If Harmony isn't detecting file changes:

1. Verify `hot_reload` is enabled in `config.toml`
2. Check file permissions (Harmony needs read access)
3. Restart Harmony if needed (changes will apply on startup)

## Next Steps

- [Pipeline Configuration Reference →](../configuration/pipelines.md)
- [Configure Middleware →](../components/middleware.md)
- [Configure Authentication →](../components/authentication.md)
- [View Examples →](https://github.com/aurabx/harmony/tree/main/examples)
