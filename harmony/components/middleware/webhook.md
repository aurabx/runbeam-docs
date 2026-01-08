---
sidebar_label: Webhook
---

# Webhook

Sends HTTP POST notifications to external webhooks when requests pass through the pipeline. Useful for event tracking, auditing, and integration with external monitoring systems.

## Overview

The webhook middleware operates asynchronously (fire-and-forget) to avoid blocking the request pipeline. Failed webhook deliveries are logged but do not affect request processing.

**Use cases:**
- Event logging to external systems
- Request/response auditing
- Real-time notifications for API activity
- Integration with monitoring or alerting platforms

## Configuration

```toml
[middleware.my_webhook]
type = "webhook"
[middleware.my_webhook.options]
endpoint = "https://webhook.example.com/events"
apply = "left"                    # Optional: "left", "right", or "both" (default: "left")
timeout_secs = 5                  # Optional: request timeout (default: 5)
redact_headers = ["authorization", "x-api-key"]  # Optional: headers to redact
redact_metadata = ["jwt_token"]   # Optional: metadata to redact
```

## Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `endpoint` | string | Yes | - | URL to POST webhook payloads |
| `apply` | string | No | `"left"` | When to fire: `"left"` (request), `"right"` (response), or `"both"` |
| `timeout_secs` | integer | No | `5` | HTTP timeout for webhook POST |
| `redact_headers` | array | No | `[]` | List of header names to redact (case-insensitive) |
| `redact_metadata` | array | No | `[]` | List of metadata keys to redact (case-insensitive) |
| `authentication_def` | object | No | - | Authentication configuration for webhook endpoint |

## Payload Structure

### Left Side (Request)

```json
{
  "middleware": "webhook",
  "name": "my_webhook",
  "side": "left",
  "request": {
    "method": "POST",
    "uri": "/api/patients",
    "headers": {
      "content-type": "application/json",
      "authorization": "<redacted>"
    },
    "cookies": {},
    "query_params": {},
    "metadata": {
      "user_id": "123"
    },
    "content_metadata": {
      "content_type": "application/json",
      "size": 1024
    }
  },
  "extra": null
}
```

### Right Side (Response)

```json
{
  "middleware": "webhook",
  "name": "my_webhook",
  "side": "right",
  "request": {
    "method": "POST",
    "uri": "/api/patients",
    "headers": {
      "content-type": "application/json",
      "authorization": "<redacted>"
    },
    "cookies": {},
    "query_params": {},
    "metadata": {
      "user_id": "123"
    },
    "content_metadata": {
      "content_type": "application/json",
      "size": 1024
    }
  },
  "extra": null
}
```

## Behavior

### Fire-and-Forget

Webhook POSTs are spawned as background tasks and do not block the request pipeline:

- Requests continue immediately without waiting for webhook response
- Webhook failures are logged but don't affect the request
- Response latency is unaffected by webhook delivery time

### Redaction

Sensitive data can be redacted before sending to webhooks:

```toml
[middleware.audit_webhook.options]
endpoint = "https://audit.example.com/events"
redact_headers = ["authorization", "x-api-key", "cookie"]
redact_metadata = ["jwt_token", "ssn"]
```

Redacted values appear as `"<redacted>"` in the payload.

### Authentication

Webhooks can include authentication for secured endpoints:

```toml
[middleware.secure_webhook.options]
endpoint = "https://secure-webhook.example.com/events"

[middleware.secure_webhook.options.authentication_def]
type = "basic"
username = "webhook_user"
password = "webhook_password"
```

Supported authentication types:
- `basic` - HTTP Basic authentication
- `bearer` - Bearer token authentication

### Extra Metadata

You can pass custom data to webhooks via request metadata. Use the key `webhook.{instance_name}`:

```toml
# Middleware named "audit_webhook"
[middleware.audit_webhook]
type = "webhook"
```

In a transform middleware (or other middleware that sets metadata):

```json
{
  "webhook.audit_webhook": "{\"tenant\":\"acme\",\"priority\":\"high\"}"
}
```

This appears in the webhook payload's `extra` field.

## Error Handling

- **Connection failures**: Logged as warnings, request continues
- **Timeouts**: After `timeout_secs`, the webhook task terminates, request continues
- **Non-2xx responses**: Logged but ignored, request continues

All errors are logged to the `harmony.webhook` target:

```
WARN harmony.webhook: webhook post failed: connection refused
```

## Examples

### Basic Event Logging

```toml
[pipelines.api_with_logging]
description = "API with webhook event logging"
networks = ["default"]
endpoints = ["api"]
backends = ["backend"]
middleware = ["event_logger"]

[middleware.event_logger]
type = "webhook"
[middleware.event_logger.options]
endpoint = "https://logs.example.com/events"
apply = "left"
```

### Request and Response Auditing

```toml
[middleware.audit_both]
type = "webhook"
[middleware.audit_both.options]
endpoint = "https://audit.example.com/api/events"
apply = "both"
redact_headers = ["authorization"]
timeout_secs = 10
```

### Authenticated Webhook

```toml
[middleware.secure_notification]
type = "webhook"
[middleware.secure_notification.options]
endpoint = "https://secure.example.com/notify"
apply = "right"

[middleware.secure_notification.options.authentication_def]
type = "bearer"
token = "${WEBHOOK_TOKEN}"
```

### Response-Only Webhook

```toml
[middleware.response_tracker]
type = "webhook"
[middleware.response_tracker.options]
endpoint = "https://metrics.example.com/responses"
apply = "right"
```

## Performance Considerations

- Webhook POSTs are non-blocking and run in background tasks
- No impact on request latency (unless webhook blocks due to middleware order - always configure appropriately)
- Failed webhooks do not retry automatically
- For high-throughput systems, consider webhook endpoint capacity

## Related

- [← Middleware](../middleware.md)
- [Log Dump →](./log-dump.md)
