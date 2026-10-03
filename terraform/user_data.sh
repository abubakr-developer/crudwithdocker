#!/bin/bash
set -euxo pipefail

# Install Git and Docker Compose for the React + Node + MySQL stack.
apt-get update
apt-get install -y ca-certificates curl git docker.io docker-compose-v2
systemctl enable --now docker

# Clone the Docker project as the default Ubuntu account.
APP_DIR=/opt/docker-project
sudo -u ubuntu git clone "${repo_url}" "$APP_DIR"

# Run the project's existing React frontend, Node API, and MySQL services.
cat > /etc/systemd/system/docker-project.service <<'EOF'
[Unit]
Description=React, Node, and MySQL Docker Compose stack
Requires=docker.service
After=docker.service network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/docker-project
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now docker-project.service
