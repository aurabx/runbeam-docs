---
sidebar_position: 4
---

# Resource References

Resource references enable gateways to connect to resources managed by other teams in Runbeam Cloud through mesh networking. References are used within mesh configurations to connect ingresses and egresses across teams.

## How References Work in Meshes

When you create resources (ingresses, egresses) in Runbeam, they become available for other gateways to reference **within mesh configurations**. References use a standardized format that identifies the provider, resource type, team, and resource name.

Shared resources only work when both teams add them to a common mesh. A mesh acts as the trust boundary and authentication layer for cross-team communication.

## Reference Format

References support several formats:

```
runbeam.<team>.<type>.id.<id>
runbeam.<team>.<type>.name.<name>
runbeam.<team>.id.<id>
runbeam.id.<id>
```

### Formats

| Format | Description | Example |
|--------|-------------|---------|
| `runbeam.<team>.<type>.id.<id>` | Full reference by ID | `runbeam.acme-corp.ingress.id.abc123` |
| `runbeam.<team>.<type>.name.<name>` | Full reference by name | `runbeam.acme-corp.ingress.name.fhir-api` |
| `runbeam.<team>.id.<id>` | Team-scoped reference by ID | `runbeam.acme-corp.id.abc123` |
| `runbeam.id.<id>` | Provider-scoped reference by ID (IDs are unique) | `runbeam.id.abc123` |

### Example References

```
runbeam.acme-healthcare.ingress.name.fhir-api
runbeam.partner-imaging.egress.name.dicom-store
runbeam.id.abc123def456
```

## Sharing Resources

### Making Resources Available

Resources you create in Runbeam (ingresses and egresses) are discoverable by other gateways, but they only become usable when both teams add them to a shared mesh.

Your team name is used in references:
- Team: `acme-healthcare`
- Ingress: `patient-api`
- Reference: `runbeam.acme-healthcare.ingress.name.patient-api`

### Using Shared Resources

To use a resource from another team, you must add it to a mesh that both teams are members of:

```toml
[mesh.partner-integration]
type = "http3"
provider = "runbeam"
ingress = [
    "my-local-ingress",                                # Your local ingress
    "runbeam.partner-team.ingress.name.their-api"     # Partner's ingress (must be in this mesh)
]
```

Without the mesh context, resources cannot be accessed, even if the reference is valid.

## Cross-Team Mesh Networking

References enable gateways from different teams to form meshes:

### Scenario

- **Team A** (`radiology-dept`): Has a DICOMweb API
- **Team B** (`ai-analytics`): Needs to access Team A's images

### Team A Configuration

Team A creates an ingress for their DICOMweb API:

```toml
# Team A's pipeline
[pipelines.dicom-api.mesh.ingress.dicomweb]
type = "http3"
urls = ["https://dicom.radiology.example.com"]
```

### Team B Configuration

Team B references Team A's ingress in their mesh:

```toml
# Team B's mesh
[mesh.imaging-integration]
type = "http3"
provider = "runbeam"
egress = ["runbeam.radiology-dept.ingress.name.dicomweb"]
```

### Result

Team B's gateway can now send authenticated requests to Team A's DICOMweb API through the mesh.

## Reference Resolution

When a gateway encounters a provider reference:

1. **Parse**: Extract provider, type, team, and name from the reference
2. **Lookup**: Query Runbeam API for the resource details
3. **Cache**: Store the result to avoid repeated API calls
4. **Connect**: Use the resource's connection details for routing

### Resolution Timing

- **Startup**: References are validated (provider must exist)
- **Runtime**: Actual resource details are fetched when needed
- **Refresh**: Cache is invalidated when configuration changes

## Access Control

### Current Behavior

All resources within Runbeam are accessible to all authorized gateways. Teams can reference any resource by using the correct reference format.

### Best Practices

- Use descriptive resource names that indicate purpose
- Document which resources are intended for external use
- Coordinate with partner teams before referencing their resources
- Monitor access patterns through Runbeam Cloud

## Troubleshooting

### Reference Not Found

**Symptom**: Gateway logs show "Resource not found" errors

**Causes**:
- Incorrect team name in reference
- Resource doesn't exist or was deleted
- Typo in resource name

**Solution**: Verify the reference matches exactly with the resource in Runbeam

### Provider Not Configured

**Symptom**: "Unknown provider" error at startup

**Causes**:
- Missing `[provider.runbeam]` section in gateway config
- Gateway not authorized with Runbeam

**Solution**: Ensure provider is configured and gateway is authorized

### Permission Denied

**Symptom**: 403 errors when accessing referenced resources

**Causes**:
- Gateway not authorized
- Mesh JWT authentication failed
- Network connectivity issues

**Solution**: Re-authorize gateway and check mesh configuration

## Next Steps

- [Providers →](./providers.md) - Configure Runbeam as a provider
- [Meshes →](./meshes.md) - Create meshes with cross-team references
