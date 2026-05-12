FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y git curl gettext-base && apt-get install -y git curl jq && rm -rf /var/lib/apt/lists/*

# Match the integration-test image and avoid latest-pnpm install policy changes
# breaking the Docker dev entrypoint.
RUN npm install -g pnpm@9.15.9

# Install OpenClaw globally
RUN npm install -g openclaw@2026.4.2

# Create workspace
WORKDIR /workspace

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 18789

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
