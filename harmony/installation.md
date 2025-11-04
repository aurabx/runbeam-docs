---
sidebar_position: 3
---

# Installation

Detailed installation instructions for Harmony Proxy.

## System Requirements

### Runtime Environment
- **Operating System**: macOS or Linux
- **Architecture**: x86_64 or ARM64 (Apple Silicon)

### For DICOM DIMSE Features
If you plan to use DICOM DIMSE operations (SCU/SCP), install DCMTK:

#### macOS (Homebrew)
```bash
brew install dcmtk
```

#### Debian/Ubuntu
```bash
sudo apt-get install dcmtk
```

## Installation Methods

### Docker (Recommended for Production)

#### Option 1: Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  harmony:
    image: ghcr.io/aurabx/harmony:latest
    ports:
      - "8080:8080"
      - "9090:9090"
    volumes:
      - ./config:/etc/harmony:ro
      - ./data:/data
    environment:
      - RUST_LOG=info
      - RUNBEAM_ENCRYPTION_KEY=${RUNBEAM_ENCRYPTION_KEY}
    restart: unless-stopped
```

Start the service:

```bash
docker compose up -d
```

#### Option 2: Published Image

```bash
# Pull the latest image
docker pull ghcr.io/aurabx/harmony:latest

# Run with your configuration
docker run -d \
  -p 8080:8080 \
  -p 9090:9090 \
  -v $(pwd)/config:/etc/harmony:ro \
  -v $(pwd)/data:/data \
  --name harmony \
  ghcr.io/aurabx/harmony:latest
```

### Building from Source

#### Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

#### Clone and Build

```bash
# Clone the repository
git clone https://github.com/aurabx/harmony.git
cd harmony

# Build release binary
cargo build --release

# The binary will be at target/release/harmony-proxy
```

#### Install System-Wide (Optional)

```bash
# Copy to system path
sudo cp target/release/harmony-proxy /usr/local/bin/

# Or create a symlink
sudo ln -s $(pwd)/target/release/harmony-proxy /usr/local/bin/harmony-proxy
```

### Prebuilt Binaries

Check the [GitHub Releases](https://github.com/aurabx/harmony/releases) page for prebuilt binaries.

```bash
# Download for your platform
wget https://github.com/aurabx/harmony/releases/download/vX.Y.Z/harmony-proxy-linux-x86_64.tar.gz

# Extract
tar -xzf harmony-proxy-linux-x86_64.tar.gz

# Make executable
chmod +x harmony-proxy

# Move to PATH
sudo mv harmony-proxy /usr/local/bin/
```

## Configuration

After installation, you need a configuration file. Start with an example:

```bash
# Copy an example configuration
cp examples/basic-echo/config.toml my-config.toml

# Edit as needed
nano my-config.toml
```

## Running Harmony

### From Binary

```bash
harmony-proxy --config /path/to/config.toml
```

### As a System Service (Linux)

Create `/etc/systemd/system/harmony.service`:

```ini
[Unit]
Description=Harmony Proxy
After=network.target

[Service]
Type=simple
User=harmony
WorkingDirectory=/opt/harmony
ExecStart=/usr/local/bin/harmony-proxy --config /etc/harmony/config.toml
Restart=always
RestartSec=5
Environment=RUST_LOG=info

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable harmony
sudo systemctl start harmony
sudo systemctl status harmony
```

## Environment Variables

### Required for Production

- `RUNBEAM_ENCRYPTION_KEY` - Encryption key for secure token storage

### Optional

- `RUST_LOG` - Logging level (debug, info, warn, error)
- `RUNBEAM_MACHINE_TOKEN` - Pre-provisioned machine token (JSON format)
- `RUNBEAM_JWT_SECRET` - Shared secret for JWT validation

See the [Security Guide](./security) for details on generating and managing these values.

## Verification

Test that Harmony is running:

```bash
# Health check (if management API is enabled)
curl http://localhost:9090/health

# Test an endpoint (adjust based on your config)
curl http://localhost:8080/echo
```

## Next Steps

- [Configure Harmony →](./configuration)
- [Set up authentication →](./authentication)
- [Deploy to production →](./deployment)
