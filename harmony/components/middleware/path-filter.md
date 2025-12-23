---
sidebar_label: Path Filter
---

# Path Filter

Filters incoming requests based on URL path patterns. Requests that don't match configured rules are rejected with HTTP 404.

## Configuration

```toml
[middleware.imagingstudy_filter]
type = "path_filter"
[middleware.imagingstudy_filter.options]
rules = ["/ImagingStudy", "/Patient", "/Patient/{id}"]
```

## Options

- `rules` (array of strings, required) - Path patterns to allow using matchit syntax

## Behavior

- Only applies to incoming requests
- Path matching uses subpath after endpoint's path_prefix
- Trailing slashes are normalized (`/ImagingStudy/` matches `/ImagingStudy`)
- On rejection: returns 404 with empty body and skips backend calls
- Supports matchit patterns: wildcards, parameters (`{id}`), catch-all (`*path`)

## Use cases

- Whitelist specific FHIR resource types
- Restrict access to certain API paths
- Implement coarse-grained authorization

## Example pipeline

```toml
[pipelines.restricted_fhir]
description = "FHIR API with path restrictions"
networks = ["default"]
endpoints = ["fhir_api"]
middleware = ["path_filter"]
backends = ["fhir_server"]

[endpoints.fhir_api]
service = "http"

[middleware.path_filter]
type = "path_filter"
[middleware.path_filter.options]
rules = ["/Patient", "/Patient/{id}", "/ImagingStudy", "/ImagingStudy/{id}"]

[backends.fhir_server]
service = "http"
```

## Related

- [← Middleware](../middleware.md)
