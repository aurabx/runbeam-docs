---
sidebar_position: 6
---

# Resource References

Resource references allow you to use resources from different providers in your Harmony configuration. This enables cross-gateway and cross-team resource sharing.

## Overview

A reference is a string that identifies a resource by its provider, type, team, and name. References are resolved at runtime, allowing you to connect to resources managed by external systems.

## Reference Syntax

References support several formats depending on how you want to identify the resource:

```
<name>                                  # Bare name (shorthand for local.name.<name>)
local.name.<name>                       # Explicit local lookup
<provider>.id.<id>                      # Provider-wide ID lookup
<provider>.<team>.id.<id>               # Team-scoped ID lookup
<provider>.<team>.<type>.name.<name>    # Full path by name
<provider>.<team>.<type>.id.<id>        # Full path by ID
```

### Formats

| Format | Description | Example |
|--------|-------------|---------|
| `<name>` | Bare name (shorthand for local lookup) | `api-ingress` |
| `local.name.<name>` | Explicit local resource by name | `local.name.api-ingress` |
| `<provider>.id.<id>` | Provider-scoped reference by ID (IDs are unique) | `runbeam.id.abc123` |
| `<provider>.<team>.id.<id>` | Team-scoped reference by ID | `runbeam.acme-corp.id.abc123` |
| `<provider>.<team>.<type>.name.<name>` | Full reference by name | `runbeam.acme-corp.ingress.name.fhir-api` |
| `<provider>.<team>.<type>.id.<id>` | Full reference by ID | `runbeam.acme-corp.ingress.id.abc123` |

### Components

| Component | Description | Example |
|-----------|-------------|---------|
| `<provider>` | Name of the configured provider | `runbeam`, `local` |
| `<team>` | Team/organization that owns the resource | `acme-corp`, `my-team` |
| `<type>` | Type of resource | `ingress`, `egress` |
| `id.<id>` | Resource identifier by unique ID | `id.abc123` |
| `name.<name>` | Resource identifier by name | `name.fhir-api` |

### Examples

```
my-ingress                                        # Bare name (local)
local.name.my-ingress                             # Explicit local
runbeam.id.abc123def456                           # Provider ID lookup
runbeam.acme-healthcare.ingress.name.fhir-api     # Full path by name
runbeam.partner-team.egress.name.dicom-store      # Full path by name
```

## Local References

For resources defined in your local configuration, use bare names or the explicit `local.name.<name>` format:

```toml
[mesh.my-mesh]
type = "http"
provider = "local"
ingress = ["api-ingress", "webhook-ingress"]       # Bare names (recommended)
egress = ["local.name.partner-egress"]             # Explicit local format
```

Local references are resolved against your local `pipelines/` and `mesh/` configuration directories.

## Provider References

To reference resources from a remote provider, use the provider reference syntax:

```toml
[mesh.cross-org-mesh]
type = "http3"
provider = "runbeam"
ingress = [
    "local.name.local-ingress",                         # Local resource
    "runbeam.partner-team.ingress.name.their-api"       # Remote resource
]
egress = [
    "runbeam.partner-team.egress.name.their-backend"
]
```

## Using References in Mesh Configuration

References are most commonly used in mesh configurations to connect ingresses and egresses across gateways:

### Example Mesh

```toml
# mesh/production.toml
[mesh.production]
type = "http3"
provider = "runbeam"
auth_type = "jwt"
ingress = [
    "api-ingress",                                      # Local
    "runbeam.partner.ingress.name.partner-ingress"      # From partner team
]
egress = [
    "backend-egress",                                   # Local
    "runbeam.partner.egress.name.partner-backend"       # To partner team
]
```

## Reference Resolution

References are resolved at different times depending on the context:

### Startup Resolution

When Harmony starts, it validates that:
- All referenced providers exist in configuration
- The reference syntax is valid

Remote references are **not** fetched at startup—they're resolved when needed.

### Runtime Resolution

When a mesh needs to route to a referenced resource:
1. Harmony parses the reference string
2. Looks up the provider configuration
3. Calls the provider's API to resolve the resource
4. Caches the result for subsequent requests

### Resolution Caching

Resolved references are cached to avoid repeated API calls:
- Cache duration depends on provider configuration
- Configuration changes trigger cache invalidation
- Failed resolutions are not cached

## Validation

Harmony validates references at configuration load time:

### Valid References

```toml
ingress = [
    "local-ingress",                                  # ✓ Bare name (local)
    "local.name.local-ingress",                       # ✓ Explicit local reference
    "runbeam.my-team.ingress.name.api-ingress",       # ✓ Full provider reference by name
    "runbeam.id.abc123"                               # ✓ Provider reference by ID
]
```

### Invalid References

```toml
ingress = [
    "unknown.team.ingress.name.api",       # ✗ Unknown provider
    "runbeam.team.invalid.name.api",       # ✗ Invalid resource type
    "runbeam.team.ingress",                # ✗ Incomplete reference
]
```

Invalid references cause configuration validation to fail at startup.

## Error Handling

When reference resolution fails at runtime:

| Error | Cause | Result |
|-------|-------|--------|
| Provider unavailable | API unreachable | Request fails with 503 |
| Resource not found | Resource doesn't exist | Request fails with 404 |
| Permission denied | No access to resource | Request fails with 403 |
| Invalid reference | Malformed reference string | Configuration fails to load |

## Best Practices

### Use Local References When Possible

Local references are faster and don't require network calls:

```toml
# Prefer bare names for local resources
ingress = ["my-local-ingress"]

# Use provider references only for external resources
ingress = ["runbeam.partner.ingress.name.their-api"]
```

### Validate Provider Configuration

Ensure providers are configured before using references:

```toml
# config.toml
[provider.runbeam]
api = "https://api.runbeam.cloud"
poll_interval_secs = 30

# mesh/production.toml - can now use runbeam references
[mesh.production]
ingress = ["runbeam.partner.ingress.name.api"]
```

### Document Cross-Team References

When referencing resources from other teams, document the dependency:

```toml
# mesh/partner-integration.toml
# Depends on: partner-team's api-ingress (contact: partner@example.com)
[mesh.partner-integration]
type = "http3"
provider = "runbeam"
ingress = ["runbeam.partner-team.ingress.name.api-ingress"]
```

## Next Steps

- [Providers →](./providers.md) - Configure providers for reference resolution
- [Data Mesh →](./mesh.md) - Use references in mesh configurations
