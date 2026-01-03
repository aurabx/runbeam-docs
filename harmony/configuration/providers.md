---
sidebar_position: 5
---

# Providers

Providers define how Harmony resolves and synchronizes resources. A provider can be local (configuration files on disk) or remote (a cloud service like Runbeam Cloud).

## Overview

Providers serve two main purposes:

1. **Resource Resolution**: Resolve references to resources like ingresses, egresses, and meshes
2. **Configuration Sync**: Poll remote APIs for configuration changes (remote providers only)

Every Harmony gateway has an implicit `local` provider that resolves resources from local configuration files. You can configure additional providers to connect to remote services.

## Primary Provider

The `primary_provider` setting in the `[proxy]` section determines which provider is used for cloud polling:

```toml
[proxy]
id = "my-gateway"
primary_provider = "runbeam"  # Default
```

### Options

| Value | Description |
|-------|-------------|
| `runbeam` | Use Runbeam Cloud for configuration sync (default) |
| `local` | Disable cloud polling, use only local configuration |
| `<custom>` | Use a custom provider defined in `[provider.*]` |

### Example: Local-Only Gateway

```toml
[proxy]
id = "standalone-gateway"
primary_provider = "local"
```

This gateway will not poll any remote service for configuration changes.

## Provider Configuration

Configure providers using `[provider.*]` sections:

```toml
[provider.runbeam]
api = "https://api.runbeam.cloud"
poll_interval_secs = 30
```

### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `api` | string | Yes* | - | Base URL for the provider API |
| `poll_interval_secs` | integer | No | `30` | Polling interval in seconds (0 = disabled) |

\* Required for remote providers. The `local` provider doesn't need an `api` field.

### Polling

The `poll_interval_secs` controls how frequently Harmony checks the provider for configuration changes:

- **Minimum**: 0 (disables polling)
- **Maximum**: 3600 (1 hour)
- **Recommended**: 30 seconds for active development, 60-300 for production

```toml
[provider.runbeam]
api = "https://api.runbeam.cloud"
poll_interval_secs = 60  # Check every minute
```

Set to `0` to disable polling while keeping the provider available for reference resolution:

```toml
[provider.runbeam]
api = "https://api.runbeam.cloud"
poll_interval_secs = 0  # No polling, but can still resolve references
```

## Built-in Providers

### Local Provider

The `local` provider is always available implicitly. It resolves resources from your local configuration files.

```toml
# These are equivalent - local provider is implicit
[proxy]
primary_provider = "local"

# No [provider.local] section needed
```

Local provider characteristics:
- No API URL required
- No polling (poll_interval_secs = 0)
- Resolves resources from `pipelines/`, `mesh/`, and other config directories

### Runbeam Provider

The Runbeam provider connects to Runbeam Cloud for centralized configuration management:

```toml
[provider.runbeam]
api = "https://api.runbeam.cloud"
poll_interval_secs = 30
```

When the Runbeam provider is your primary provider and polling is enabled:
- Configuration changes sync automatically from Runbeam Cloud
- Gateway must be authorized via the Management API
- Changes are hot-reloaded without restart

## Current Limitations

Currently, Harmony supports only a single remote provider at a time. The `primary_provider` setting determines which provider is active for both polling and reference resolution.

You can switch between:
- `local` - Use only local configuration files
- `runbeam` - Use Runbeam Cloud

## Migration from Legacy Configuration

If you're using the legacy `[runbeam]` section, migrate to providers:

### Before (Legacy)

```toml
[runbeam]
enabled = true
cloud_api_base_url = "https://api.runbeam.cloud"
poll_interval_secs = 30
```

### After (Provider-based)

```toml
[proxy]
id = "my-gateway"
primary_provider = "runbeam"

[provider.runbeam]
api = "https://api.runbeam.cloud"
poll_interval_secs = 30
```

The legacy `[runbeam]` section is still supported for backward compatibility but is deprecated.

## Cloud Integration

When using a remote provider like Runbeam:

1. **Authorization**: The gateway must be authorized before polling works
2. **Token Storage**: Machine tokens are stored securely in `~/.runbeam/<proxy_id>/`
3. **Hot Reload**: Configuration changes are applied without restart

See [Connecting to Runbeam](../components/connecting-to-runbeam.md) for authorization details.

## Next Steps

- [Resource References →](./references.md) - Learn how to reference resources across providers
- [Data Mesh →](./mesh.md) - Configure mesh networking with providers
- [Connecting to Runbeam →](../components/connecting-to-runbeam.md) - Authorize your gateway
