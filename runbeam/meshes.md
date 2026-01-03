---
sidebar_position: 5
---

# Meshes

Meshes enable secure, authenticated communication between Harmony gateways and Runbeam-managed resources. Meshes group ingresses and egresses together with shared authentication.

## Mesh Basics

A mesh has three key components:

- **Mesh**: A named grouping with authentication settings (provider, JWT configuration)
- **Ingress**: An entry point with URLs that route requests to a pipeline
- **Egress**: An exit point for requests to reach other resources

Meshes in Runbeam are created within your team and can reference resources from other teams via [resource references](./references.md).

## Creating Meshes

Meshes are managed in Runbeam Cloud. You can create meshes through the Runbeam UI.

### Mesh Configuration

Each mesh requires:
- **Name**: Unique identifier within your team
- **Type**: Protocol type (`http` or `http3`)
- **Provider**: Authentication provider (`local` or `runbeam`)
- **Enabled**: Whether the mesh is active

Optional JWT configuration depends on the provider:
- **runbeam**: JWT is managed by Runbeam Cloud
- **local**: You must provide either a JWT secret or RSA key paths

## Ingresses and Egresses

### Ingress

An ingress binds URLs to an endpoint in a pipeline. It can require mesh authentication via the `mode` setting:
- `default`: Accepts all requests
- `mesh`: Requires valid mesh JWT authentication

### Egress

An egress defines how requests exit through a backend. The `mode` setting controls authentication:
- `default`: All requests allowed
- `mesh`: Only requests with mesh context allowed

## Cross-Team Meshes

To use resources from other teams, add them to a mesh using [resource references](./references.md):

```
runbeam.partner-team.ingress.name.their-api
runbeam.partner-team.egress.name.their-backend
```

Both teams must add their resources to a common mesh for communication to work. The mesh provides the trust boundary and authentication context.

## Next Steps

- [References →](./references.md) - Understand how to reference cross-team resources
- [Providers →](./providers.md) - Learn about provider configuration
- [Harmony Mesh Docs →](/harmony/configuration/mesh) - Technical TOML configuration reference
