# GitHub Workflows

This directory contains the CI/CD pipeline configurations for the Widget Server.

## Main Workflow (`main.yml`)

The main workflow is triggered on pushes to the `main` branch and handles the build, security scanning, and deployment process.

### Pipeline Steps

1. **Build Setup**
   - Uses Ubuntu latest
   - Sets up Node.js 20
   - Configures pnpm 8
   - Installs dependencies

2. **AWS Configuration**
   - Configures AWS credentials
   - Logs into Amazon ECR

3. **Docker Build & Security**
   - Sets up Docker Buildx
   - Builds test image
   - Runs Trivy security scanner
     - Scans for CRITICAL and HIGH vulnerabilities
     - Checks both OS and library vulnerabilities
     - Ignores unfixed issues

4. **Deployment**
   - Builds and pushes final image to ECR
   - Updates ECS task definition
   - Deploys to Amazon ECS
     - Service: widget-server
     - Cluster: rocketseat-ecs-ftr-widget-server
     - Waits for service stability

### Alternative Deployment (Commented)

The workflow includes a commented configuration for AWS App Runner deployment as an alternative to ECS:
- Service defined by `APP_RUNNER_SERVICE_NAME` variable
- Configured with 1 CPU and 2GB memory
- Uses port 3333
- 180 seconds stability wait time

### ECS Task Definition (`.aws/task-definition.json`)

The ECS deployment uses a Fargate-compatible task definition with the following specifications:
- CPU: 1024 units (1 vCPU)
- Memory: 2048 MB
- Platform: Linux/X86_64
- Network Mode: awsvpc
- Container Configuration:
  - CPU: 799 units
  - Memory: 1024 MB
  - Port: 3333 (HTTP)
  - Logging: AWS CloudWatch Logs
    - Log Group: `/ecs/rocketseat-widget-server`
    - Region: us-east-2

#### Environment Variables

The container requires the following Cloudflare-related environment variables:
- `CLOUDFLARE_PUBLIC_URL`
- `CLOUDFLARE_BUCKET`
- `CLOUDFLARE_ACCESS_KEY_ID`
- `CLOUDFLARE_SECRET_ACCESS_KEY`
- `CLOUDFLARE_ACCOUNT_ID`

### Required Secrets

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_ROLE_ARN` (for App Runner deployment)

### Required Variables

- `AWS_REGION`
- `ECR_REPOSITORY`
- `APP_RUNNER_SERVICE_NAME` (for App Runner deployment)

### Notes

- Uses GitHub Actions cache for Docker builds
- Generates short SHA (7 characters) for image tags
- Container port: 3333
