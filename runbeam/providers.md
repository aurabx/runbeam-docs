---
sidebar_position: 3
---

# Providers

Runbeam acts as a provider for Harmony gateways, enabling centralized configuration management and cross-gateway resource sharing.

## What is a Provider?

A provider is a source of configuration and resources for Harmony gateways. When you connect a gateway to Runbeam Cloud, Runbeam becomes a provider that can:

- **Sync Configuration**: Push configuration changes to connected gateways
- **Share Resources**: Allow gateways to reference resources managed by other teams
- **Manage Authentication**: Handle JWT token generation for mesh networking

## Runbeam as a Provider

When a gateway is authorized with Runbeam Cloud, it can use Runbeam as its primary provider:

```toml
# Gateway config.toml
[proxy]
id = "my-gateway"
primary_provider = "runbeam"

[provider.runbeam]
api = "https://api.runbeam.cloud"
poll_interval_secs = 30
```

### What This Enables

| Feature | Description |
|---------|-------------|
| Configuration Sync | Changes made in Runbeam UI are automatically pushed to the gateway |
| Resource References | Gateway can reference resources from other teams via Runbeam |
| Mesh Authentication | Runbeam handles JWT token generation for mesh requests |
| Hot Reload | Configuration changes apply without gateway restart |

## Primary Provider Setting

The gateway's Primary Provider setting determines which provider handles cloud polling:

### In Runbeam UI

When editing a gateway in Runbeam, the Primary Provider dropdown appears in the gateway settings:

- **Runbeam Cloud**: Gateway polls Runbeam for configuration changes (default)
- **Local**: Gateway operates standalone, no cloud polling

### Effect on Gateway Behavior

| Primary Provider | Configuration Source | Cloud Polling | Resource References |
|-----------------|---------------------|---------------|-------------------|
| Runbeam Cloud | Runbeam + local files | Active | From Runbeam and local |
| Local | Local files only | Disabled | Local only |

## Team Resources

Resources in Runbeam are scoped to teams. When other gateways reference your resources, they use your team name:

```
runbeam.<your-team>.<type>.name.<resource-name>
```

### Example

If your team is `acme-healthcare` and you have an ingress called `fhir-api`:

```
runbeam.acme-healthcare.ingress.name.fhir-api
```

Other gateways can include this reference in their mesh configuration to connect to your API.

## Provider Configuration in Gateways

Gateways managed by Runbeam automatically receive provider configuration.

### Default Configuration

When a gateway is authorized, Runbeam configures itself as a provider:

```toml
[provider.runbeam]
api = "https://api.runbeam.cloud"
poll_interval_secs = 30
```

### Custom Polling Interval

Adjust the polling interval in gateway settings:

- **Development**: 30 seconds (default) - faster iteration
- **Production**: 60-300 seconds - reduced API calls

### Disabling Polling

Set polling to 0 to disable automatic sync while keeping reference resolution:

```toml
[provider.runbeam]
api = "https://api.runbeam.cloud"
poll_interval_secs = 0  # Manual sync only
```

## Authorization

Gateways must be authorized before they can use Runbeam as a provider.

See [Authorizing Gateways](./runbeam-authorization.md) for the authorization process.

## Current Limitations

Currently, Harmony supports only a single remote provider at a time. You can switch between:

- **Runbeam Cloud** - Centralized configuration and cross-team resource sharing
- **Local** - Standalone operation with local configuration files only

## Next Steps

- [Authorizing Gateways →](./runbeam-authorization.md) - Connect gateways to Runbeam
- [Resource References →](./references.md) - Share resources across teams
- [Meshes →](./meshes.md) - Configure mesh networking
