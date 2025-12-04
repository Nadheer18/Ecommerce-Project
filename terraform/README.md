📘 README.md — Terraform Infrastructure for E-Commerce Project
# 🚀 Terraform Infrastructure — E-Commerce Kubernetes + Jenkins Project

This Terraform project deploys a complete AWS-based infrastructure for running a full E-Commerce application with:

- Kubernetes Cluster (kubeadm)
- Master + Multiple Worker Nodes
- Jenkins CI/CD Server
- MetalLB LoadBalancer
- Ingress-NGINX Controller
- Reverse Proxy NGINX EC2 Server
- Automated Infrastructure Provisioning

---

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


# 📂 Project Structure

 terraform /
 
    ├── ec2-master.tf
    ├── ec2-workers.tf
    ├── jenkins-server.tf
    ├── main.tf
    ├── outputs.tf
    ├── provider.tf
    ├── README.md
    ├── routing.tf
    ├── scripts
    │   ├── jenkins.sh
    │   ├── master.sh
    │   └── worker.sh
    ├── security-groups.tf
    ├── subnets.tf
    ├── variables.tf
    └── vpc.tf


---

# 🛠️ Requirements

- Terraform ≥ 1.5
- AWS CLI configured
- SSH Key Pair in AWS
- Ubuntu 22.04 AMI (default provided)
- Git installed
- Your `my-new-aws-key.pem`

---

# ⚙️ Terraform Commands

### Initialize project
```bash
terraform init

Validate configuration
terraform validate

See plan
terraform plan

Apply and deploy everything
terraform apply -auto-approve

Destroy everything
terraform destroy -auto-approve

📤 Outputs

After apply, Terraform prints:

master_public_ip = "x.x.x.x"
worker_public_ips = ["x.x.x.x", "x.x.x.x"]
jenkins_public_ip = "x.x.x.x"
jenkins_url = "http://x.x.x.x:8080"

🚀 Kubernetes Setup After Terraform
1️⃣ Initialize Kubernetes Master

SSH to master:

ssh -i my-new-aws-key.pem ubuntu@<master-ip>


Run:

sudo kubeadm init --pod-network-cidr=10.244.0.0/16


Set up kubectl:

mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

🟦 Install Flannel Networking
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
kubectl get pods -n kube-flannel

🔑 PRINT JOIN TOKEN ANYTIME
kubeadm token create --print-join-command


Example output:

kubeadm join 10.0.1.220:6443 --token abcd12.xyzk5890asd \
--discovery-token-ca-cert-hash sha256:xxxxxxxx

🧩 Join Worker Nodes

On each worker:

sudo kubeadm reset pre-flight checks
kubeadm Token Print Command
To generate a join command at any time:

kubeadm token create --print-join-command


Example output:

kubeadm join 10.0.1.220:6443 --token abcd12.xyzk5890asd \
--discovery-token-ca-cert-hash sha256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Then paste the join command from master.


Check:

kubectl get nodes

🌐 Install MetalLB
Install required components:
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.14.5/config/manifests/metallb-native.yaml

metallb-ip-pool.yaml
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: public-ip-pool
  namespace: metallb-system
spec:
  addresses:
    - 10.0.1.200-10.0.1.205


Apply:

kubectl apply -f metallb-ip-pool.yaml

metallb-l2.yaml
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: l2-advertisement
  namespace: metallb-system
spec:
  ipAddressPools:
    - public-ip-pool


Apply:

kubectl apply -f metallb-l2.yaml

🔥 Install Ingress-NGINX
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
kubectl get svc -n ingress-nginx

🌍 Setup Nginx Reverse Proxy EC2

SSH into your Nginx EC2:

sudo apt update
sudo apt install nginx -y


Create config:

sudo nano /etc/nginx/sites-available/ecommerce


Paste:

upstream ecommerce_backend {
    server 10.0.1.200:80;
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


Enable:

sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

💻 Add Hosts Entry on Your Laptop

Open:

C:\Windows\System32\drivers\etc\hosts


Add:

<nginx-public-ip> ecommerce.local


Open in browser:

http://ecommerce.local


Your app loads through Kubernetes LoadBalancer → Ingress → Pods 🎉

✔️ Jenkins CI/CD (Optional)

Jenkins is pre-installed by Terraform and available at:

http://<jenkins-public-ip>:8080
