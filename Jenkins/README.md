## 🚀 Jenkins setup in your kubeadm Kubernetes cluster step-by-step ##
#### **📌We will do production-style setup:**

* 1.Create Namespace
* 2.Create Persistent Volume
* 3.Deploy Jenkins
* 4.Expose Jenkins using NodePort
* 5.Access Jenkins UI
* 6.Unlock Jenkins
* 7.Install Suggested Plugins
* 8.Configure Docker + kubectl inside Jenkins
* 9.Connect GitHub Repository
* 10.Build CI/CD Pipeline

### 📌 Architecture
```
GitHub
   ↓
Jenkins
   ↓
Docker Build
   ↓
DockerHub Push
   ↓
kubectl apply
   ↓
Kubernetes Deployment
```
### 🚀 STEP 1 — Create Jenkins Namespace

```bash
kubectl create namespace jenkins
```
👉 Verify:
```bash
kubectl get ns
```
### 🚀 STEP 2 — Create Persistent Volume

Create file:
```bash
vi jenkins-pv.yaml
```
Paste:
```bash
apiVersion: v1
kind: PersistentVolume
metadata:
  name: jenkins-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  hostPath:
    path: /mnt/jenkins-data
```
Apply:
```bash
kubectl apply -f jenkins-pv.yaml
```
### 🚀 STEP 3 — Create Persistent Volume Claim
Create:
```bash
vi jenkins-pvc.yaml
```
Paste:
```bash
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: jenkins-pvc
  namespace: jenkins
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```
Apply:
```bash
kubectl apply -f jenkins-pvc.yaml
```
### 🚀 STEP 4 — Create Jenkins Deployment
Create:
```bash
vi jenkins-deployment.yaml
```
Paste:
```bash
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jenkins
  namespace: jenkins
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jenkins
  template:
    metadata:
      labels:
        app: jenkins
    spec:
      securityContext:
        fsGroup: 1000
      containers:
      - name: jenkins
        image: jenkins/jenkins:lts
        ports:
        - containerPort: 8080
        - containerPort: 50000
        volumeMounts:
        - name: jenkins-data
          mountPath: /var/jenkins_home
      volumes:
      - name: jenkins-data
        persistentVolumeClaim:
          claimName: jenkins-pvc
```
Apply:
```bash
kubectl apply -f jenkins-deployment.yaml
```

### 🚀 STEP 5 — Create Jenkins Service
Create:
```bash
vi jenkins-service.yaml
```
Paste:
```bash
apiVersion: v1
kind: Service
metadata:
  name: jenkins-service
  namespace: jenkins
spec:
  type: NodePort
  selector:
    app: jenkins
  ports:
  - port: 8080
    targetPort: 8080
    nodePort: 32000
```
Apply:
```bash
kubectl apply -f jenkins-service.yaml
```
### 🚀 STEP 6 — Verify Jenkins Pod

```bash
kubectl get pods -n jenkins
```
Wait until:
```bash
STATUS = Running
```
Also verify service:
```bash
kubectl get svc -n jenkins
```
### 🚀 STEP 7 — Access Jenkins
Open browser:
```bash
http://NODE-IP:32000
```
Example:
```bash
http://13.x.x.x:32000
```

### 🚀 STEP 8 — Get Jenkins Initial Password
Run:
```bash
kubectl exec -it deployment/jenkins -n jenkins -- cat /var/jenkins_home/secrets/initialAdminPassword
```
Copy password.
Paste into Jenkins UI.

### 🚀 STEP 9 — Install Suggested Plugins
Inside Jenkins:
```
Install Suggested Plugins
```
Wait 5–10 minutes.

### 🚀 STEP 10 — Create Admin User
Create:
* Username
* Password
* Email
Then save.

### 🚀 STEP 11 — Verify Jenkins Working
Dashboard should open:
```
Manage Jenkins
New Item
Build History
```

### 📌 Useful Commands
Check all Jenkins resources:
```bash
kubectl get all -n jenkins
```
Check logs:
```bash
kubectl logs deployment/jenkins -n jenkins
```
Delete Jenkins:
```bash
kubectl delete ns jenkins
```

Jenkins is now running inside Kubernetes.
### 🚀 STEP 2 — Create Persistent Volume
Create:
```bash
vi jenkins-service.yaml
```
#### ✅ The Jenkins plugins that we are required to install for this project.
 
```
Git Plugin
```
Purpose: Clone your GitHub repo
Without this, Jenkins cannot pull your source code.

```
Pipeline Plugin
```
Purpose: Enables Jenkinsfile-based pipelines
This is the core plugin for CI/CD.
```
Docker Pipeline Plugin
```
Purpose: Allows Jenkins to:
run docker build
run docker push
integrate Docker in pipelines
Your pipeline needs this because you build Docker images.
```
Credentials Binding Plugin
```
Purpose: Pass credentials to environment variables
Used for:
Docker Hub username/password
kubeconfig
Example in your Jenkinsfile:
DOCKERHUB = credentials('dockerhub')
KUBECONFIG_FILE = credentials('kubeconfig')
```
Kubernetes CLI Plugin
```
Purpose: Allows Jenkins to run kubectl properly
Without this plugin Jenkins cannot execute:
kubectl apply -f
kubectl rollout restart
```
SSH Agent Plugin
```
Purpose: (Optional but recommended)
Needed if later you use SSH keys for GitHub or servers.
```
Workspace Cleanup Plugin
```
Purpose: Clean workspace after build
Used in Jenkinsfile:
cleanWs()
Not required but recommended.

⭐ Optional (but very useful)
```
Blue Ocean Plugin 
```
Better UI for viewing pipelines.
```
Timestamper Plugin
```
Adds timestamps to logs.
```
NodeJS
```
Global Package Management
sh 'npm install'
sh 'npm test'

### 🚀 STEP 2 — Create Persistent Volume
Create:
```bash
vi jenkins-service.yaml
```
Paste:
```bash
kubectl apply -f jenkins-deployment.yaml
```
Apply:
```bash
kubectl apply -f jenkins-deployment.yaml
```
### 🚀 STEP 2 — Create Persistent Volume
Create:
```bash
vi jenkins-service.yaml
```
Paste:
```bash
kubectl apply -f jenkins-deployment.yaml
```
Apply:
```bash
kubectl apply -f jenkins-deployment.yaml
```
### 🚀 STEP 2 — Create Persistent Volume
Create:
```bash
vi jenkins-service.yaml
```
Paste:
```bash
kubectl apply -f jenkins-deployment.yaml
```
Apply:
```bash
kubectl apply -f jenkins-deployment.yaml
```
### 🚀 STEP 2 — Create Persistent Volume
Create:
```bash
vi jenkins-service.yaml
```
Paste:
```bash
kubectl apply -f jenkins-deployment.yaml
```
Apply:
```bash
kubectl apply -f jenkins-deployment.yaml
```
### 🚀 STEP 2 — Create Persistent Volume
Create:
```bash
vi jenkins-service.yaml
```
Paste:
```bash
kubectl apply -f jenkins-deployment.yaml
```
Apply:
```bash
kubectl apply -f jenkins-deployment.yaml
```
### 🚀 STEP 2 — Create Persistent Volume
Create:
```bash
vi jenkins-service.yaml
```
Paste:
```bash
kubectl apply -f jenkins-deployment.yaml
```
Apply:
```bash
kubectl apply -f jenkins-deployment.yaml
```
