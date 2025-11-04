---
sidebar_position: 1
---

# Harmony Proxy

A secure, pluggable proxy for data meshes — with first-class healthcare support (FHIR, DICOM/DICOMweb, JMIX).

## Overview

Harmony Proxy is a production-ready, extensible data mesh proxy/gateway for heterogeneous systems. It routes requests through configurable endpoints, middleware, and services/backends to connect systems that speak HTTP/JSON, FHIR, DICOM/DICOMweb, and JMIX.

## Key Features

### Multi-Protocol Support
- **HTTP/JSON** - Standard REST API passthrough
- **FHIR** - Healthcare interoperability standard
- **DICOM/DICOMweb** - Medical imaging (QIDO-RS/WADO-RS)
- **JMIX** - Custom medical data packaging

### Configurable Pipelines
- Define endpoints with ordered middleware chains
- Connect to multiple backend services
- Transform data with JOLT and custom adapters
- Bridge between different protocols

### Hot Configuration Reload
- Update configuration without downtime
- Zero-restart for most config changes
- Safe deployment of updates

### Secure Authentication
- JWT validation (RS256 recommended for production)
- Optional Basic authentication
- Runbeam Cloud integration for gateway authorization
- 30-day machine tokens for autonomous operation

### Operationally Sound
- Structured logging for observability
- Local ./tmp storage convention
- Secure token storage (OS keyring or encrypted filesystem)
- Docker and Docker Compose support

## Who Is This For?

- **Platform teams** building data meshes or integration hubs (healthcare and beyond)
- **Developers** integrating HTTP/JSON services and healthcare protocols (FHIR, DICOM/DICOMweb)
- **Operators** who need auditable, configurable request/response pipelines

## Architecture

Harmony uses a pipeline architecture:

```
Request → Endpoint → Middleware Chain → Backend → Response
```

1. **Endpoints** - Define public-facing routes and protocols
2. **Middleware** - Process and transform requests/responses in order
3. **Backends** - Perform the actual work (HTTP calls, DICOM operations, etc.)

All components are configured via TOML files and can be hot-reloaded.

## Status

Harmony Proxy is under active development and ready for production use. For more information, visit [harmonyproxy.com](https://harmonyproxy.com).

## Next Steps

- [Quick Start →](./quickstart) - Get Harmony running in 5 minutes
- [Installation →](./installation) - Detailed installation guide
- [Configuration →](./configuration) - Learn about configuration options
