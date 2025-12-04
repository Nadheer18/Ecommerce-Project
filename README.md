##### 📘 E-Commerce Project — Full Stack + Kubernetes + Terraform + CI/CD



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


##### **🧰 Tech Stack**



###### **Frontend**



* React.js
* Axios
* NGINX (production)



###### **Backend**



* Node.js
* Express.js
* JWT Auth
* Sequelize ORM
* MySQL



###### **Infrastructure**



* Docker
* Kubernetes (kubeadm)
* Flannel CNI
* MetalLB LoadBalancer
* Ingress NGINX
* Nginx Reverse Proxy
* AWS EC2



###### **CI/CD**



* Jenkins Freestyle + Pipeline
* GitHub Webhooks
* kubectl-based deployment



###### **IaC**



* Terraform
* VPC, Subnet, Routing, SG
* EC2 for Master, Workers, Jenkins



##### **📂** **Repository Structure**

Ecommerce-Project/

│

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



##### **🚀 1. Deploy Infrastructure (Terraform)**

cd terraform

terraform init

terraform plan

terraform apply -auto-approve



###### Outputs:

* Master IP
* Worker IPs
* Jenkins public IP
* Jenkins URL



##### **🚀 2. Configure Kubernetes Cluster**

###### On the master:

sudo kubeadm init --pod-network-cidr=10.244.0.0/16



Configure kubectl:

mkdir -p $HOME/.kube

sudo cp /etc/kubernetes/admin.conf $HOME/.kube/config

sudo chown $(id -u):$(id -g) $HOME/.kube/config





###### Install Flannel:

kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml



###### Print join token anytime:

kubeadm token create --print-join-command



##### **🚀 3. Join Worker Nodes**



###### On each worker:

sudo kubeadm reset pre-flight checks

Then:

kubeadm join <master-ip>:6443 --token <token> --discovery-token-ca-cert-hash sha256:<hash>



##### **🌐 4. Install MetalLB**

###### Install required components:

kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.14.5/config/manifests/metallb-native.yaml

###### 

###### create metallb-ip-pool.yaml:-

apiVersion: metallb.io/v1beta1

kind: IPAddressPool

metadata:

&nbsp; name: public-ip-pool

&nbsp; namespace: metallb-system

spec:

&nbsp; addresses:

&nbsp;   - 10.0.1.200-10.0.1.205



###### create metallb-l2.yaml

apiVersion: metallb.io/v1beta1

kind: L2Advertisement

metadata:

&nbsp; name: l2-advertisement

&nbsp; namespace: metallb-system

spec:

&nbsp; ipAddressPools:

&nbsp;   - public-ip-pool



kubectl apply -f metallb-ip-pool.yaml

kubectl apply -f metallb-l2.yaml



##### **🌍 5. Install Ingress-NGINX**

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml

kubectl get svc -n ingress-nginx



##### **🔁 6. Setup Nginx Reverse Proxy EC2 (Public EC2)**

###### SSH into your Nginx EC2:

sudo apt update

sudo apt install nginx -y

###### Create config:

sudo nano /etc/nginx/sites-available/ecommerce





###### Paste:



upstream ecommerce\_backend {

&nbsp;   server 10.0.1.200:80; 	   #kubectl get svc -n ingress-nginx

}



server {

&nbsp;   listen 80;

&nbsp;   server\_name ecommerce.local;



&nbsp;   location / {

&nbsp;       proxy\_pass http://ecommerce\_backend;

&nbsp;       proxy\_set\_header Host $host;

&nbsp;       proxy\_set\_header X-Real-IP $remote\_addr;

&nbsp;       proxy\_set\_header X-Forwarded-For $proxy\_add\_x\_forwarded\_for;

&nbsp;       proxy\_set\_header X-Forwarded-Proto $scheme;

&nbsp;   }

}





###### Enable:



sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/

sudo rm /etc/nginx/sites-enabled/default

sudo nginx -t

sudo systemctl restart nginx





Add to your laptop hosts:



<nginx-public-ip> ecommerce.local



##### **🤖 7. Jenkins CI/CD Pipeline**



Jenkins installed via Terraform.



###### Access:

http://<jenkins-ip>:8080



###### Pipeline runs:

1. Clone GitHub
2. kubectl apply -f k8s/
3. Deploy updated pods in cluster



##### **💻 8. Add Hosts Entry on Your Laptop**



###### Open:



C:\\Windows\\System32\\drivers\\etc\\hosts



###### Add:

<nginx-public-ip> ecommerce.local



###### Open in browser:

http://ecommerce.local





Your app loads through Kubernetes LoadBalancer → Ingress → Pods 🎉



##### **🎯 Future Enhancements (Planned)**



* Full Monitoring (Prometheus + Grafana)
* EKS migration
* ArgoCD GitOps pipeline
* Helm Chart packaging
* Terraform modules + backend



##### **👨‍💻 Author**



###### **Nadheer KV**

DevOps | Cloud | Kubernetes | Terraform Engineer

