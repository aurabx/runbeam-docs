---
sidebar_position: 6
---

# MCP Service

Runbeam Cloud exposes a Model Context Protocol (MCP) server so AI agents and LLM-powered tools can manage Harmony gateway configuration programmatically.

## Overview

The Runbeam MCP server:

- Uses the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) over Streamable HTTP
- Requires a Runbeam Sanctum API token for authentication
- Scopes all operations to the authenticated user's current team
- Exposes tools covering the lifecycle of gateways, pipelines, endpoints, backends, middleware, transforms, services, networks, and sharing

## Endpoint

```http
POST /mcp/runbeam
```

Hosted Runbeam Cloud URL:

```text
https://app.runbeam.io/mcp/runbeam
```

If you are self-hosting, replace `https://app.runbeam.io` with your instance URL.

## Authentication

The MCP endpoint requires a valid Sanctum token:

```bash
curl -X POST https://app.runbeam.io/mcp/runbeam \
  -H "Authorization: Bearer {sanctum_token}" \
  -H "Content-Type: application/json"
```

Rate limiting applies via standard API throttling.

## Client Setup

The server uses the Streamable HTTP transport. Configure your MCP client to send `POST` requests to the MCP endpoint with an `Authorization: Bearer ...` header.

### Generating a Token

Create a Sanctum API token from the Runbeam Cloud UI.

### Claude Code

Add to your project's `.mcp.json` (or `~/.claude/mcp.json` for global config):

```json
{
  "mcpServers": {
    "runbeam": {
      "type": "url",
      "url": "https://app.runbeam.io/mcp/runbeam",
      "headers": {
        "Authorization": "Bearer your-sanctum-token"
      }
    }
  }
}
```

Or via the CLI:

```bash
claude mcp add runbeam \
  --transport http \
  --url https://app.runbeam.io/mcp/runbeam \
  --header "Authorization: Bearer your-sanctum-token"
```

### Cursor

Add to your project's `.cursor/mcp.json` (or `~/.cursor/mcp.json` globally):

```json
{
  "mcpServers": {
    "runbeam": {
      "url": "https://app.runbeam.io/mcp/runbeam",
      "headers": {
        "Authorization": "Bearer your-sanctum-token"
      }
    }
  }
}
```

You can also configure this in Cursor under Settings > MCP by selecting the Streamable HTTP type.

### OpenAI Codex

Add to your project's `codex.json`:

```json
{
  "mcpServers": {
    "runbeam": {
      "type": "url",
      "url": "https://app.runbeam.io/mcp/runbeam",
      "headers": {
        "Authorization": "Bearer your-sanctum-token"
      }
    }
  }
}
```

Or via the CLI:

```bash
codex --mcp-server-url "https://app.runbeam.io/mcp/runbeam" \
      --mcp-header "Authorization: Bearer your-sanctum-token"
```

### OpenCode

Add to your project's `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "runbeam": {
      "type": "remote",
      "enabled": true,
      "url": "https://app.runbeam.io/mcp/runbeam",
      "headers": {
        "Authorization": "Bearer your-sanctum-token"
      }
    }
  }
}
```

## Core Concepts

| Concept | Description |
|---|---|
| Gateway | A Harmony proxy instance that polls for config and routes traffic. |
| Pipeline | A traffic flow linking endpoints to backends through ordered middleware. |
| Endpoint | An ingress definition (how traffic enters via a gateway). |
| Backend | An egress definition (where traffic is routed). |
| Middleware | A processing step in a pipeline (auth, transform, policies, filtering, etc.). |
| Transform | A JOLT transformation rule (stored as JSON instructions) attached via middleware. |
| Service | A protocol definition that constrains valid endpoint/backend types. |
| Network | An optional network configuration (including WireGuard tunneling). |

## Typical Workflow: Build a Pipeline

1. Ensure a gateway exists (`list-gateways`, `create-gateway`)
2. Ensure the service exists (`list-services`, `create-service`)
3. Create endpoints and backends
4. Create the pipeline and attach endpoints/backends
5. Add middleware for transforms/auth/policies
6. Generate TOML (`generate-pipeline-toml`, `generate-gateway-toml`) to review the final configuration

## Notes

- Tools include both read-only and mutating operations, and some tools are destructive. Your MCP client will surface which tools are safe to call.
- All resources are team-scoped based on the authenticated user.
