---
sidebar_position: 2
---

# Quick Start

Get Harmony Proxy running in 5 minutes.

## Prerequisites

Choose one of the following:

### Option 1: Local Development
- Rust (stable) via [rustup](https://rustup.rs/)
- macOS or Linux

### Option 2: Docker
- Docker and Docker Compose
- No Rust toolchain required

## Running with Docker Compose (Recommended)

The fastest way to try Harmony:

```bash
# Clone the repository
git clone https://github.com/aurabx/harmony.git
cd harmony

# Start with Docker Compose
docker compose up

# Test the service
curl -i http://localhost:8080/echo
```

### Ports

- **8080** - Main service endpoints
- **9090** - Management API (if enabled)

## Running from Source

If you prefer to build from source:

```bash
# Clone the repository
git clone https://github.com/aurabx/harmony.git
cd harmony

# Build
cargo build --release

# Run with example configuration
cargo run --release -- --config examples/basic-echo/config.toml
```

Test the basic echo endpoint:

```bash
curl -i http://127.0.0.1:8080/echo
```

## Try the Examples

Harmony includes several example configurations:

```bash
# Basic HTTP echo
cargo run -- --config examples/basic-echo/config.toml

# FHIR with authentication
cargo run -- --config examples/fhir/config.toml

# JSON transformations
cargo run -- --config examples/transform/config.toml

# FHIR to DICOM translation
cargo run -- --config examples/fhir-to-dicom/config.toml
```

Each example includes:
- A README explaining the use case
- A `config.toml` file
- Pipeline definitions
- Sample requests

Explore the `examples/` directory to see more.

## Next Steps

Now that you have Harmony running:

1. [Learn about configuration →](./configuration)
2. [Understand authentication →](./authentication)
3. [Deploy to production →](./deployment)
4. [Integrate with Runbeam Cloud →](./runbeam-integration)
