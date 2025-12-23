---
sidebar_label: Metadata Transform
---

# Metadata Transform

Applies JOLT transformations to request metadata (key-value pairs used for routing decisions).

## Configuration

```toml
[middleware.fhir_dimse_meta]
type = "metadata_transform"
[middleware.fhir_dimse_meta.options]
spec_path = "transforms/metadata_set_dimse_op.json"
apply = "left"
fail_on_error = true
```

## Options

- `spec_path` (string, required) - Path to JOLT specification file
- `apply` (string, optional) - When to apply: `"left"`, `"right"`, or `"both"` (default: `"left"`)
- `fail_on_error` (bool, optional) - Whether to fail on transform errors (default: true)

## Behavior

- Converts metadata to JSON for JOLT processing
- Only string-valued outputs are written back to metadata
- Preserves existing metadata fields not modified by transform
- Common use case: setting `dimse_op` field to control DICOM operations

## Example pipeline

```toml
[pipelines.fhir_to_dicom]
description = "FHIR to DICOM bridge with metadata routing"
networks = ["default"]
endpoints = ["fhir_api"]
middleware = ["set_dicom_op"]
backends = ["dicom_scp"]

[endpoints.fhir_api]
service = "http"

[middleware.set_dicom_op]
type = "metadata_transform"
[middleware.set_dicom_op.options]
spec_path = "transforms/metadata_set_dimse_op.json"
apply = "left"

[backends.dicom_scp]
service = "dicom_scp"
```

## Related

- [← Middleware](../middleware.md)
