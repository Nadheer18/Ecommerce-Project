# 📘 E-Commerce Project — Full Stack + Kubernetes + Terraform + CI/CD



This repository contains a complete E-Commerce application built using modern technologies and deployed using a full DevOps pipeline, including:



* React Frontend
* Node.js + Express Backend
* MySQL Database
* Docker containerization
* Kubernetes deployment (kubeadm)
* MetalLB LoadBalancer
* Ingress NGINX
* Jenkins CI/CD
* Terraform AWS Infrastructure Automation



This project represents an end-to-end DevOps workflow from coding → building → deployment → production-ready infrastructure.
# 🖼️ Architecture Diagram (Clean, GitHub-Friendly ASCII)

                               ┌────────────────────────┐
                               │      GitHub Repo       │
                               └────────────┬───────────┘
                                            │
                                            ▼
                               ┌────────────────────────┐
                               │       Jenkins EC2      │
                               │  - Docker              │
                               │  - kubectl             │
                               │  - CI/CD Pipeline      │
                               └────────────┬───────────┘
                                            │ kubectl apply
                                            ▼
           ┌───────────────────────────────────────────────────────────────────────────────┐
           │                  AWS Infrastructure (VPC 10.0.0.0/16)                         │
           │                                                                               │
           │  ┌─────────────────── Public Subnet (10.0.1.0/24) ─────────────────────────┐  │    
           │  │  ┌───────────────────────────────┐     ┌─────────────────────────────┐  │  │
           │  │  │     Kubernetes Master EC2     │     │     Jenkins Server EC2      │  │  │
           │  │  │       10.0.1.220              │     │     Public + Private IP     │  │  │
           │  │  └───────────────────────────────┘     └─────────────────────────────┘  │  │
           │  │                                                                         │  │
           │  │  ┌───────────────────────────────┐     ┌─────────────────────────────┐  │  │
           │  │  │     Worker Node 1 EC2         │     │     Worker Node 2 EC2       │  │  │
           │  │  │     10.0.1.x                  │     │     10.0.1.x                │  │  │
           │  │  └───────────────────────────────┘     └─────────────────────────────┘  │  │
           │  └─────────────────────────────────────────────────────────────────────────┘  │
           └───────────────────────────────────────────────────────────────────────────────┘
                            ┌────────────────────────────────┐
                            │      Nginx Reverse Proxy       │
                            │        Public EC2 Server       │
                            │ (maps ecommerce.local → LB IP) │
                            └──────────────┬─────────────────┘
                                           │ HTTP
                                           ▼
                                MetalLB LoadBalancer (10.0.1.200)
                                           │
                                           ▼
                                 Ingress-NGINX Controller
                                           │
                                           ▼
                           Frontend / Backend Kubernetes Pods


# **🧰 Tech Stack**

### **Frontend**
* React.js
* Axios
* NGINX (production)
  
### **Backend**
* Node.js
* Express.js
* JWT Auth
* Sequelize ORM
* MySQL

### **Infrastructure**
* Docker
* Kubernetes (kubeadm)
* Flannel CNI
* MetalLB LoadBalancer
* Ingress NGINX
* Nginx Reverse Proxy
* AWS EC2

### **CI/CD**

* Jenkins Freestyle + Pipeline
* GitHub Webhooks
* kubectl-based deployment

### **IaC**

* Terraform
* VPC, Subnet, Routing, SG
* EC2 for Master, Workers, Jenkins

## **📂** **Repository Structure**

Ecommerce-Project/

├── frontend/             # React App
├── backend/              # Node.js API
│
├── k8s/                  # All Kubernetes Manifests
│   ├── namespace.yaml
│   ├── frontend-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── ingress.yaml
│   ├── mysql-deployment.yaml
│   ├── mysql-service.yaml
│   ├── Install NGINX Ingress Controller
│
├── terraform/            # Full AWS automation
│   ├── main.tf
│   ├── vpc.tf
│   ├── ec2-master.tf
│   ├── ec2-workers.tf
│   ├── jenkins-server.tf
│   └── scripts/
│       ├── master.sh
│       ├── worker.sh
│       └── jenkins.sh
│
└── Jenkinsfile           # CI/CD Pipeline

---

## **🚀 1. Deploy Infrastructure (Terraform)**

```bash
cd terraform
terraform init
terraform plan
terraform apply -auto-approve
```

###### Outputs:
* Master IP
* Worker IPs
* Jenkins public IP
* Jenkins URL

## **🚀 2. Configure Kubernetes Cluster**

#### On the master:
```bash
sudo kubeadm init --pod-network-cidr=10.244.0.0/16
```

#### Configure kubectl:
```bash
mkdir -p $HOME/.kube
sudo cp /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

#### Install Flannel:
```bash
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml

```

#### Print join token anytime:
```bash
kubeadm token create --print-join-command
```

## **🚀 3. Join Worker Nodes**



#### On each worker:
```bash
sudo kubeadm reset pre-flight checks
```
##### Then:
```bash
kubeadm join <master-ip>:6443 --token <token> --discovery-token-ca-cert-hash sha256:<hash>

```

## **🌐 4. Install MetalLB**

###### Install required components:
```bash
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.14.5/config/manifests/metallb-native.yaml
```
 

###### create metallb-ip-pool.yaml:-
```bash
vi metallb-ip-pool.yaml
```
###### Paste:
```bash
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: public-ip-pool
  namespace: metallb-system
spec:
  addresses:
    - 10.0.1.200-10.0.1.205
```

###### create metallb-l2.yaml
```bash
vi metallb-l2.yaml
```
###### Paste:
```bash
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: l2-advertisement
  namespace: metallb-system
spec:
  ipAddressPools:
    - public-ip-pool
```

```bash
kubectl apply -f metallb-ip-pool.yaml
kubectl apply -f metallb-l2.yaml
```


## **🌍 5. Install Ingress-NGINX**
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
kubectl get svc -n ingress-nginx
```

## **🔁 6. Setup Nginx Reverse Proxy EC2 (Public EC2)**

#### SSH into your Nginx EC2:
```bash
sudo apt update
sudo apt install nginx -y
systemctl status nginx
```
###### Create Reverse Proxy Config:
```bash
sudo nano /etc/nginx/sites-available/ecommerce
```
###### Paste:

```bash
upstream ecommerce_backend {
    server 10.0.1.200:80; # Kubernetes LoadBalancer EXTERNAL-IP (from `kubectl get svc -n ingress-nginx`)
}

server {
    listen 80;
    server_name ecommerce.local;

    location / {
        proxy_pass http://ecommerce_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```


###### Enable:


```bash
sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```
## **🤖 7. Jenkins CI/CD Pipeline**
Jenkins installed via Terraform.



###### Access:
http://jenkins-ip:8080

###### Pipeline runs:

1. Clone GitHub
2. kubectl apply -f k8s/
3. Deploy updated pods in cluster

## **💻 8. Add Hosts Entry on Your Laptop**

###### Open:

C:\\Windows\\System32\\drivers\\etc\\hosts

###### Add:

<nginx-public-ip> ecommerce.local

###### Open in browser:

http://ecommerce.local

Your app loads through Kubernetes LoadBalancer → Ingress → Pods 🎉



## **🎯 Future Enhancements (Planned)**

* Full Monitoring (Prometheus + Grafana)
* EKS migration
* ArgoCD GitOps pipeline
* Helm Chart packaging
* Terraform modules + backend



## **👨‍💻 Author**
### **Nadheer KV**

DevOps | Cloud | Kubernetes | Terraform Engineer

