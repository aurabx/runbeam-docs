---
sidebar_label: DICOM to DICOMweb
---

# DICOM to DICOMweb

:::warning Experimental
This middleware is experimental and under active development. The API and behavior may change in future releases. Use with caution in production environments.
:::

The DICOM to DICOMweb middleware bridges traditional DICOM network protocols (DIMSE) to modern DICOMweb RESTful APIs. This allows legacy DICOM clients like PACS workstations and modalities to communicate seamlessly with cloud-based DICOMweb servers without modification.

This middleware is the inverse of the [DICOMweb to DICOM](./dicomweb-bridge.md) middleware, which converts DICOMweb requests to DIMSE operations.

## Configuration

Add the middleware to your pipeline with minimal configuration:

```toml
[middleware.dicom_to_dicomweb]
type = "dicom_to_dicomweb"
```

No additional options are required. The middleware automatically detects DIMSE operations and transforms them appropriately.

## How it works

The middleware operates bidirectionally, transforming both incoming requests and outgoing responses:

1. **Incoming (left side)**: DIMSE operations from DICOM clients are converted to DICOMweb HTTP requests
2. **Outgoing (right side)**: DICOMweb HTTP responses are converted back to DIMSE-compatible format

This transparent translation ensures DICOM clients receive responses in the format they expect.

## Request transformation (DICOM → DICOMweb)

### Querying studies with C-FIND

When a DICOM client performs a C-FIND query, the middleware transforms it into a QIDO-RS GET request. DICOM query identifiers are mapped to URL query parameters using standard hex tag notation.

For example, a C-FIND query for patient ID becomes a GET request to `/studies?00100020=PATIENT123`. The middleware handles Person Name (PN) attributes specially, extracting the Alphabetic field for cleaner query strings.

### Storing images with C-STORE

C-STORE operations are converted to STOW-RS POST requests. The middleware reads the DICOM file from disk, constructs a proper `multipart/related` body with the `application/dicom` content type, and includes the appropriate boundary parameters.

Binary DICOM data is Base64-encoded within the request envelope for safe HTTP transport, then decoded by the backend service.

### Retrieving images with C-GET and C-MOVE

Both C-GET and C-MOVE operations are transformed into WADO-RS GET requests. The middleware extracts Study, Series, and Instance UIDs from the DICOM identifiers and constructs hierarchical URLs:

- Study level: `/studies/1.2.3.4.5`
- Series level: `/studies/1.2.3.4.5/series/1.2.3.4.6`
- Instance level: `/studies/1.2.3.4.5/series/1.2.3.4.6/instances/1.2.3.4.7`

The middleware sets the Accept header to `multipart/related; type="application/dicom"` to request DICOM instances in the response.

## Response transformation (DICOMweb → DICOM)

### Query results from QIDO-RS

QIDO-RS returns query results as JSON arrays. The middleware validates the response structure and ensures it's properly formatted for DIMSE. Single object responses are automatically wrapped in arrays for consistency.

The middleware also handles the HTTP 404 status specially for C-FIND operations: a 404 from the backend indicates no matches were found, which is translated to a successful DICOM response with zero results.

### Store confirmations from STOW-RS

STOW-RS responses contain metadata about stored instances. The middleware parses the ReferencedSOPSequence to identify successfully stored instances and the FailedSOPSequence to detect any failures.

Partial success scenarios are handled gracefully: if some instances were stored successfully while others failed, the middleware returns an appropriate DICOM warning status.

### Instance retrieval from WADO-RS

WADO-RS responses can contain single DICOM instances, multipart responses with multiple instances, or JSON metadata. The middleware handles all three formats:

**Multipart responses** are parsed by extracting the boundary parameter from the Content-Type header, then splitting the body into individual DICOM parts. Each part is Base64-encoded and stored for the DIMSE response.

**Single instance responses** (content type `application/dicom`) are handled directly without multipart parsing.

**JSON metadata responses** (content type `application/dicom+json`) are passed through for metadata-only queries.

## Status code mapping

The middleware intelligently maps HTTP status codes to DICOM status codes, ensuring DICOM clients receive meaningful responses:

| HTTP Status | DICOM Status | Meaning |
|------------|--------------|----------|
| 200-299 | 0x0000 | Success |
| 400 | 0xA900 | Identifier Does Not Match |
| 404 | 0x0000 (C-FIND) / 0xC000 (others) | No matches (success for queries) / Not Found |
| 409 | 0xB000 | Warning - Sub-operations Complete with Failures |
| 413 | 0xA700 | Out of Resources |
| 500-599 | 0xC000 | Unable to Process |

Note that HTTP 404 is treated differently for C-FIND operations: it indicates no matches were found, which is a successful query with zero results. For other operations, 404 represents a failure.

## Use cases

This middleware solves the challenge of integrating legacy DICOM infrastructure with modern cloud-based medical imaging platforms:

**Legacy integration**: Connect existing PACS workstations, modalities, and viewing software to cloud DICOMweb archives without requiring software updates or replacements.

**Hybrid architectures**: Build systems where on-premise DICOM devices communicate with cloud storage backends through a single gateway running Harmony.

**Vendor-neutral archives**: Create VNA solutions that accept both traditional DICOM connections and modern DICOMweb APIs, providing flexibility for diverse healthcare IT environments.

**Migration path**: Gradually migrate from DIMSE-based infrastructure to DICOMweb while maintaining backward compatibility with devices that haven't been upgraded yet.

## Example pipeline

```toml
[pipelines.dimse_to_dicomweb_bridge]
description = "Bridge DIMSE clients to DICOMweb backend"
networks = ["default"]
endpoints = ["dicom_scp"]
middleware = ["to_dicomweb"]
backends = ["dicomweb_server"]

[endpoints.dicom_scp]
service = "dicom_scp"
[endpoints.dicom_scp.options]
local_aet = "BRIDGE_SCP"
enable_echo = true
enable_find = true
enable_store = true
enable_get = true
enable_move = true

[middleware.to_dicomweb]
type = "dicom_to_dicomweb"

[backends.dicomweb_server]
service = "http"
[backends.dicomweb_server.options]
host = "dicomweb.example.com"
port = 443
protocol = "https"
base_path = "/dicomweb"
```

## Related

- [← Middleware](../middleware.md)
- [DICOMweb to DICOM →](./dicomweb-bridge.md) - Inverse middleware (DICOMweb → DICOM)
