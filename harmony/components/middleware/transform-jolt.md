---
sidebar_label: Transform (JOLT)
---

# Transform (JOLT)

Applies JSON-to-JSON transformations using JOLT specifications.

## Configuration

```toml
[middleware.transform_example]
type = "transform"
[middleware.transform_example.options]
spec_path = "transforms/patient.json"
apply = "left"
fail_on_error = true
```

## Options

- `spec_path` (string, required) - Path to JOLT specification file
- `apply` (string, optional) - When to apply: `"left"` (request), `"right"` (response), or `"both"` (default: `"left"`)
- `fail_on_error` (bool, optional) - Whether to fail request on transform errors (default: true)

## Use cases

- Transform FHIR resource formats
- Normalize API request/response structures
- Extract or reshape data fields

## Example pipeline

```toml
[pipelines.fhir_transform]
description = "Transform FHIR resources"
networks = ["default"]
endpoints = ["fhir_api"]
middleware = ["transform_request", "transform_response"]
backends = ["fhir_server"]

[endpoints.fhir_api]
service = "http"

[middleware.transform_request]
type = "transform"
[middleware.transform_request.options]
spec_path = "transforms/patient_request.json"
apply = "left"

[middleware.transform_response]
type = "transform"
[middleware.transform_response.options]
spec_path = "transforms/patient_response.json"
apply = "right"

[backends.fhir_server]
service = "http"
```

## Related

- [← Middleware](../middleware.md)
