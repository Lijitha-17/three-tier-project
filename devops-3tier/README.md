# 🚀 3-Tier DevOps Project

A production-ready, cloud-native 3-tier application with full CI/CD pipeline.

```
┌─────────────────────────────────────────────────────────────┐
│  TIER 1: PRESENTATION LAYER                                 │
│  React 18 + Nginx  →  Docker  →  K8s Deployment (2 pods)   │
├─────────────────────────────────────────────────────────────┤
│  TIER 2: APPLICATION LAYER                                  │
│  Node.js + Express →  Docker  →  K8s Deployment (2 pods)   │
│  Auto-scales to 10 pods via HPA                             │
├─────────────────────────────────────────────────────────────┤
│  TIER 3: DATA LAYER                                         │
│  PostgreSQL 16     →  AWS RDS  (Multi-AZ, auto backup)     │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
devops-3tier/
├── frontend/               # Tier 1 — React + Nginx
│   ├── src/App.jsx
│   ├── Dockerfile          # Multi-stage build
│   └── nginx.conf
├── backend/                # Tier 2 — Node.js + Express
│   ├── src/index.js
│   └── Dockerfile
├── infra/
│   ├── terraform/          # AWS (VPC, EKS, RDS, ECR)
│   ├── k8s/                # Kubernetes manifests
│   ├── monitoring/         # Prometheus + Grafana
│   └── db/                 # SQL init scripts
├── .github/workflows/      # CI/CD pipeline
└── docker-compose.yml      # Local dev environment
```

## 🛠️ Quick Start (Local)

```bash
# Clone and start all services
git clone <your-repo>
cd devops-3tier
docker-compose up --build

# Access:
# Frontend  → http://localhost:3000
# Backend   → http://localhost:5000
# Grafana   → http://localhost:3001  (admin/admin123)
# Prometheus→ http://localhost:9090
```

## ☁️ AWS Deployment

### Prerequisites
- AWS CLI configured
- Terraform >= 1.5
- kubectl
- Docker

### Step 1 — Provision Infrastructure
```bash
cd infra/terraform
terraform init
terraform plan -var="db_username=appuser" -var="db_password=SecurePass123"
terraform apply
```

### Step 2 — Push Docker Images
```bash
# Authenticate to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t devops-3tier/frontend ./frontend
docker build -t devops-3tier/backend  ./backend
docker push <ECR_URL>/devops-3tier/frontend:latest
docker push <ECR_URL>/devops-3tier/backend:latest
```

### Step 3 — Deploy to Kubernetes
```bash
# Update kubeconfig
aws eks update-kubeconfig --name devops-3tier-cluster

# Create secrets
kubectl create secret generic db-secret \
  --from-literal=host=<RDS_ENDPOINT> \
  --from-literal=password=SecurePass123 \
  -n app

# Apply manifests
kubectl apply -f infra/k8s/deployment.yaml
kubectl get pods -n app
```

## 🔄 CI/CD Pipeline (GitHub Actions)

On every push to `main`:

```
Test → Security Scan → Build & Push ECR → Deploy to EKS
```

Set these GitHub Secrets:
- `AWS_ACCOUNT_ID`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## 📊 API Endpoints

| Method | Path          | Description       |
|--------|---------------|-------------------|
| GET    | /health       | Health check      |
| GET    | /api/users    | List all users    |
| POST   | /api/users    | Create user       |
| GET    | /api/users/:id| Get user by ID    |
| DELETE | /api/users/:id| Delete user       |

## 🔐 Security Features

- Non-root Docker user
- Helmet.js security headers
- ECR image scanning on push
- Trivy vulnerability scanning in CI
- Kubernetes Secrets for credentials
- RDS in private subnets

## 📈 Monitoring

- **Prometheus** — metrics collection
- **Grafana** — dashboards (port 3001)
- **K8s HPA** — auto-scaling on CPU > 70%
