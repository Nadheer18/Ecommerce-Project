📘 PROJECT REPORT
CI/CD Pipeline With Docker, Jenkins, and Kind Kubernetes Cluster Deployment
End-to-End Implementation — From Scratch to Production-Ready Setup
✨ 1. Project Overview

This project demonstrates a complete DevOps workflow for deploying a full-stack e-commerce application (Frontend + Backend + Database) using:

Jenkins CI/CD Pipeline

Docker containerization

Kind (Kubernetes in Docker)

Kubernetes Deployments, Services, and Ingress

DockerHub container registry

Automated build → test → image push → deployment pipeline

The entire system runs fully automated, enabling smooth and reliable deployments.

✨ 2. Objectives

Containerize frontend and backend applications using Docker

Host images on DockerHub

Build a full Jenkins CI/CD pipeline

Deploy the application into a Kind Kubernetes cluster

Use Nginx Ingress for domain-based routing

Automate cluster creation and Kubeconfig updates

Deliver a fully functional e-commerce system on local Kubernetes

✨ 3. Technologies Used
DevOps Tools

Jenkins (Pipeline-as-Code)

Docker & DockerHub

Kubernetes (Kind)

Kubectl CLI

Nginx Ingress Controller

GitHub Repository

Programming Stack

NodeJS Backend

ReactJS Frontend

MySQL Database

✨ 4. Project Architecture
GitHub  →  Jenkins  →  Docker Build  → DockerHub Push
                                     ↓
                   Kind Kubernetes Cluster (local)
                                     ↓
                 Deployments + Services + Ingress
                                     ↓
                      http://ecommerce.local

Kubernetes Components
Namespace: ecom

frontend-deployment.yaml

backend-deployment.yaml

mysql-deployment.yaml

Service files for each component

Nginx ingress routing

✨ 5. Major Milestones
✅ Milestone 1: Source Code Setup

Frontend React app and backend Node API in GitHub

Directory structure prepared

Jenkins connected to GitHub via polling

✅ Milestone 2: Dockerization

Created Dockerfiles:

Backend Dockerfile
FROM node:16
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

Frontend Dockerfile
FROM nginx:alpine
COPY build/ /usr/share/nginx/html
EXPOSE 80


Images tested locally → pushed manually.

✅ Milestone 3: DockerHub Setup

Created repositories:

ecommerce-frontend

ecommerce-backend

Added DockerHub credentials in Jenkins (Docker_cred)

✅ Milestone 4: Jenkins Pipeline Implementation
Pipeline stages:

Checkout

Install Node dependencies

Run tests

Build frontend and backend

Build Docker images

DockerHub login (via credential binding)

Push images to DockerHub

Deploy to Kubernetes using kubectl

Pipeline executed successfully.

✅ Milestone 5: Kind Cluster Setup
Problems encountered:

Port 80 already in use → Kind failed

Ingress pod stuck in Pending

kubeconfig mismatch after cluster recreation

Solutions:

Stopped system nginx

Created custom Kind config:

extraPortMappings:
- containerPort: 80
  hostPort: 80


Added node labels ingress-ready=true

Installed ingress-nginx (Kind provider version)

Auto-updated kubeconfig for root + Jenkins

Cluster became fully operational.

✅ Milestone 6: Kubernetes Deployment

Created K8s manifests:

Deployments:

Backend (exposing port 3000)

Frontend (exposing port 80)

MySQL (port 3306)

Services:

NodePort not used

Only ClusterIP

Ingress handles external access

Ingress:
Host: ecommerce.local
/api → backend
/    → frontend


Ingress tested successfully using:

curl http://ecommerce.local

✅ Milestone 7: Application Validation

Pods running:

backend - Running
frontend - Running
mysql - Running
ingress - Running


Frontend accessible at:

http://ecommerce.local


Backend reachable via:

http://ecommerce.local/api


Everything is functioning perfectly.

✨ 6. Final Outcome

The system is now fully automated:

✔ CI/CD pipeline builds and pushes Docker images
✔ Automatic deployment into Kubernetes
✔ Nginx ingress handles routing
✔ Full-stack application live at ecommerce.local
✔ Jenkins + Kind + Docker pipeline runs without errors
✔ Local Kubernetes behaves like production cluster

You now have a complete DevOps pipeline, used in real industry setups.

✨ 7. Key Achievements

Deployment automated end-to-end

Learned Docker, Kubernetes, Jenkins pipelines

Solved complex networking issues

Integrated Ingress Controller

Successfully delivered full infra using local cluster

Built production-style workflow using only Docker + Kind

✨ 8. Next Level Enhancements (Future Work)

ArgoCD GitOps deployment

Helm chart packaging

Monitoring (Prometheus + Grafana)

Logging (Loki)

SSL certificates (Let's Encrypt)

Blue/Green deployment using Argo Rollouts

Terraform-based EKS deployment

Horizontal Pod Autoscaling (HPA)

❤️ 9. Conclusion

This project demonstrates end-to-end DevOps capability, covering:
containerization, CI/CD, Kubernetes orchestration, ingress routing, cluster automation, and service deployment.

You successfully built and deployed a full e-commerce app using modern DevOps practices. This is portfolio-ready and interview-ready.
