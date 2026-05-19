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

      initContainers:
      - name: fix-permissions
        image: busybox

        command:
        - sh
        - -c
        - chown -R 1000:1000 /var/jenkins_home

        volumeMounts:
        - name: jenkins-data
          mountPath: /var/jenkins_home

      containers:
      - name: jenkins
        image: jenkins/jenkins:lts-jdk17

        securityContext:
          runAsUser: 0

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
### 🚀 STEP 7 — Create Jenkins Data Directory on Node
Since we are using hostPath storage, create directory in worker/master node.
Run on the node where pod may run:
```bash
sudo mkdir -p /mnt/jenkins-data
sudo chown -R 1000:1000 /mnt/jenkins-data
sudo chmod -R 775 /mnt/jenkins-data
```
Verify:
```
ls -ld /mnt/jenkins-data
```
You should see owner:
```
1000 1000
```
because Jenkins container runs as UID 1000.
### 🚀 STEP 8 — Access Jenkins
Open browser:
```bash
http://EC2-PUBLIC-IP:32000
```
Example:
```bash
http://13.x.x.x:32000
```

### 🚀 STEP 9 — Get Jenkins Initial Password
Run:
```bash
kubectl exec -it deployment/jenkins -n jenkins -- cat /var/jenkins_home/secrets/initialAdminPassword
```
Copy password.
Paste into Jenkins UI.

### 🚀 STEP 10 — Install Suggested Plugins
Inside Jenkins:
```
Install Suggested Plugins
```
Wait 5–10 minutes.

### 🚀 STEP 11 — Create Admin User
Create:
* Username
* Password
* Email
Then save.

### 🚀 STEP 12 — Verify Jenkins Working
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

#### ✅STEP 13 — Install Required Jenkins Plugins
Open:
```
Manage Jenkins
 → Plugins
 → Available Plugins
```
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
Docker Pipeline
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
Kubernetes CLI
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

After install:
   Restart Jenkins
   ```
   kubectl rollout restart deployment jenkins -n jenkins
   ```
### ✅ STEP 14 — Install Docker Inside Jenkins Pod
Very important.
Our Jenkins pod currently cannot run:
```bash
docker build
```
because Docker CLI not installed.

### 🔥 Real DevOps Practice
Usually companies use:
* Docker socket mount
* Kaniko
* Buildah
* DinD
* Kubernetes agents
We will use:
#### Kaniko
This is real cloud-native DevOps practice.
Kaniko builds Docker images INSIDE Kubernetes without Docker daemon.
### Jenkins → Kaniko → DockerHub
Since your kubeadm cluster uses containerd, we will use:

Kaniko

instead of Docker daemon.
Flow becomes:
```
GitHub
 → Jenkins
      ↕ shared volume
 → Kaniko Build
 → DockerHub Push
 → Kubernetes Deployment Update
```

### ✅ STEP 15 — Create DockerHub Secret

Instead of docker-registry secret, create raw config.json manually
##### STEP 1 — CREATE config.json
On EC2:
```bash
mkdir docker-secret
```
Create file:
```bash
vi docker-secret/config.json
```
Paste EXACTLY:
```JSON
{
  "auths": {
    "https://index.docker.io/v1/": {
      "username": "USER_NAME",
      "password": "YOUR_PAT_TOKEN",
      "auth": "PASTE_BASE64_OUTPUT_HERE"
    }
  }
}
```
IMPORTANT:
username = Docker hub user name
password = real PAT Token
auth = base64 output ONLY

##### STEP 2 — GENERATE REAL BASE64
Run EXACTLY:
```
echo -n 'nadheer:YOUR_PAT_TOKEN' | base64
```
Example output:
```
bmFkaGVlcjpkY2tyX3BhdF9hYmNkZWYxMjM=
```
Copy ENTIRE output.

##### STEP 3 CREATE GENERIC SECRET
```bash
kubectl create secret generic dockerhub-secret \
--from-file=config.json=./docker-secret/config.json \
-n jenkins
```

##### 🎉 EXPECTED FINAL SUCCESS
Watch Logs After Push To DockerHub We Can See.
```bash
kubectl logs -f kaniko -n jenkins
```

You should FINALLY see:
```
Pushed nadheer/ecommerce-frontend:Latest
```
Then image will appear in your Docker Hub account.

### ✅ STEP 16 — CREATE SHARED PV
Create:
```bash
vi jenkins-kaniko-pv.yaml
```
Paste:
```bash
apiVersion: v1
kind: PersistentVolume

metadata:
  name: jenkins-kaniko-pv

spec:
  capacity:
    storage: 5Gi

  accessModes:
    - ReadWriteOnce

  persistentVolumeReclaimPolicy: Retain

  hostPath:
    path: /data/jenkins-kaniko-workspace
```
Apply:
```bash
kubectl apply -f jenkins-kaniko-pv.yaml
```
Check:
```bash
kubectl get pv
```

### ✅ STEP 17 — CREATE SHARED PVC
Create file:
```bash
vi jenkins-kaniko-pvc.yaml
```
Paste:
```bash
apiVersion: v1
kind: PersistentVolumeClaim

metadata:
  name: jenkins-kaniko-workspace
  namespace: jenkins

spec:
  accessModes:
    - ReadWriteOnce

  resources:
    requests:
      storage: 5Gi
```
Apply:
```bash
kubectl apply -f jenkins-kaniko-pvc.yaml
```
Check:
```bash
kubectl get pvc -n jenkins
```

### ✅ STEP 18 — MODIFY JENKINS DEPLOYMENT
Recreate:
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

      serviceAccountName: jenkins

      securityContext:
        fsGroup: 1000

      initContainers:
      - name: fix-permissions
        image: busybox

        command:
        - sh
        - -c
        - |
          chown -R 1000:1000 /var/jenkins_home
          chown -R 1000:1000 /workspace

        volumeMounts:
        - name: jenkins-data
          mountPath: /var/jenkins_home

        - name: shared-workspace
          mountPath: /workspace

      containers:
      - name: jenkins

        image: jenkins/jenkins:lts-jdk17

        securityContext:
          runAsUser: 0

        command:
        - sh
        - -c
        - |
          apt update && \
          apt install -y docker.io curl && \
          curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
          install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl && \
          /usr/bin/tini -- /usr/local/bin/jenkins.sh

        ports:
        - containerPort: 8080

        - containerPort: 50000

        volumeMounts:
        - name: jenkins-data
          mountPath: /var/jenkins_home

        - name: shared-workspace
          mountPath: /workspace

      volumes:
      - name: jenkins-data
        persistentVolumeClaim:
          claimName: jenkins-pvc

      - name: shared-workspace
        persistentVolumeClaim:
          claimName: jenkins-kaniko-workspace
```
✅ SAVE & EXIT

Deployment restarts automatically.
Check:
```bash
kubectl get pods -n jenkins
```
Check inside po
```
kubectl exec -it deploy/jenkins -n jenkins -- bash
kubectl --version
```
##### ✅ VERIFY kubectl INSIDE POD
```bash
kubectl exec -it deploy/jenkins -n jenkins -- bash
```
Then:
```bash
kubectl version --client
```
Expected:
```bash
Client Version: v1.xx.x
```


### ✅ VERIFY INSIDE JENKINS POD   
Run:
```bash
kubectl exec -it deploy/jenkins -n jenkins -- bash
```
Then:
```bash
df -h
```
You should see:
```bash
/workspace
```
mounted.
🚨 IMPORTANT
Kaniko pod ALSO needs same PVC mounted.
Inside overrides JSON add:
##### volumeMounts
```JOSN
{
  "name": "shared-workspace",
  "mountPath": "/workspace"
}
```
##### volumes
```JOSN
{
  "name": "shared-workspace",
  "persistentVolumeClaim": {
    "claimName": "jenkins-kaniko-workspace"
  }
}
```
##### 🎯Architecture becomes:
```
Jenkins Pod
   └── /workspace

Kaniko Pod
   └── /workspace

Shared PVC
```
### ✅ 19 Create Jenkins service account:
```
kubectl create serviceaccount jenkins -n jenkins
```
Then Check:
```
kubectl get sa -n jenkins
```
You should see:
```
jenkins
default
```


### ✅ 20 GIVE JENKINS PERMISSIONS
Create RBAC YAML.
Create file:
```
vim jenkins-rbac.yaml
```
Paste this:
```
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding

metadata:
  name: jenkins-admin

subjects:
- kind: ServiceAccount
  name: jenkins
  namespace: jenkins

roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io
```
apply:
```
kubectl apply -f jenkins-rbac.yaml
```
Verify
```
kubectl auth can-i delete pods \
--as=system:serviceaccount:jenkins:jenkins \
-n jenkins
```
Expected:
```
yes
```
### ✅ 21 FINAL JENKINS PIPELINE
#### Manage Jenkins Global Tool Configuration
```
Manage Jenkins
 → Global Tool Configuration
```
##### 1 — Git
(MOST IMPORTANT)
Find:
```
Git installations
```
Add:
```
Name: git
```
Path:
```
/usr/bin/git
```
##### ✅ 2 — NodeJS
(Needed for your Ecommerce project)
Install plugin first if missing:
```
NodeJS Plugin
```
Then in Global Tool Configuration:
```
NodeJS installations
```
Add:
```
Name: nodejs
```
Check:
```
Check:
```
Choose:
* NodeJS 20.x LTS
or
* NodeJS 18.x LTS
This is VERY important because your frontend/backend uses:
```
npm install
npm run build
```
Use this Jenkinsfile:
```bash
pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    environment {
        FRONTEND_IMAGE_NAME = "nadheer/ecommerce-frontend:${JOB_NAME}-${BUILD_NUMBER}"
        BACKEND_IMAGE_NAME = "nadheer/ecommerce-backend:${JOB_NAME}-${BUILD_NUMBER}"
    }

    stages {

        stage('Clone Code') {
            steps {
                dir('/workspace/app') {
                    git branch: 'master',
                    url: 'https://github.com/Nadheer18/Ecommerce-Project.git'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('/workspace/app/frontend') {
                    sh '''
                    npm install
                    npm run build
                    '''
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('/workspace/app/backend') {
                    sh '''
                    npm install
                    '''
                }
            }
        }

        stage('Kaniko Build and Push Frontend Image') {
            steps {

                sh '''
                kubectl delete pod kaniko-frontend -n jenkins --ignore-not-found=true

                kubectl run kaniko-frontend \
                --restart=Never \
                --image=gcr.io/kaniko-project/executor:latest \
                -n jenkins \
                --overrides='
                {
                  "spec": {
                    "containers": [{
                      "name": "kaniko-frontend",
                      "image": "gcr.io/kaniko-project/executor:latest",
                      "args": [
                        "--dockerfile=/workspace/app/frontend/Dockerfile",
                        "--context=/workspace/app/frontend",
                        "--destination='${FRONTEND_IMAGE_NAME}'"
                      ],
                      "volumeMounts": [
                        {
                          "name": "docker-config",
                          "mountPath": "/kaniko/.docker"
                        },
                        {
                          "name": "shared-workspace",
                          "mountPath": "/workspace"
                        }
                      ]
                    }],
                    "volumes": [
                      {
                        "name": "docker-config",
                        "secret": {
                          "secretName": "dockerhub-secret"
                        }
                      },
                      {
                        "name": "shared-workspace",
                        "persistentVolumeClaim": {
                          "claimName": "jenkins-kaniko-workspace"
                        }
                      }
                    ],
                    "restartPolicy": "Never"
                  }
                }'

                kubectl wait --for=condition=Ready pod/kaniko-frontend -n jenkins --timeout=300s

                kubectl logs -f kaniko-frontend -n jenkins
                '''
            }
        }
        
        stage('Kaniko Build and Push Backend Image') {
            steps {

                sh '''
                kubectl delete pod kaniko-backend -n jenkins --ignore-not-found=true

                kubectl run kaniko-backend \
                --restart=Never \
                --image=gcr.io/kaniko-project/executor:latest \
                -n jenkins \
                --overrides='
                {
                  "spec": {
                    "containers": [{
                      "name": "kaniko-backend",
                      "image": "gcr.io/kaniko-project/executor:latest",
                      "args": [
                        "--dockerfile=/workspace/app/backend/Dockerfile",
                        "--context=/workspace/app/backend",
                        "--destination='${BACKEND_IMAGE_NAME}'"
                      ],
                      "volumeMounts": [
                        {
                          "name": "docker-config",
                          "mountPath": "/kaniko/.docker"
                        },
                        {
                          "name": "shared-workspace",
                          "mountPath": "/workspace"
                        }
                      ]
                    }],
                    "volumes": [
                      {
                        "name": "docker-config",
                        "secret": {
                          "secretName": "dockerhub-secret"
                        }
                      },
                      {
                        "name": "shared-workspace",
                        "persistentVolumeClaim": {
                          "claimName": "jenkins-kaniko-workspace"
                        }
                      }
                    ],
                    "restartPolicy": "Never"
                  }
                }'

                kubectl wait --for=condition=Ready pod/kaniko-backend -n jenkins --timeout=300s

                kubectl logs -f kaniko-backend -n jenkins
                '''
            }
        }
        
        stage('Deploy to Kubernetes') {
    steps {

        sh '''
        kubectl apply -f /workspace/app/k8s/namespace.yaml
        kubectl apply -f /workspace/app/k8s/frontend-deployment.yaml
        kubectl apply -f /workspace/app/k8s/frontend-service.yaml
        kubectl apply -f /workspace/app/k8s/backend-deployment.yaml
        kubectl apply -f /workspace/app/k8s/backend-service.yaml
        kubectl apply -f /workspace/app/k8s/mysql-deployment.yaml
        kubectl apply -f /workspace/app/k8s/mysql-service.yaml
        kubectl apply -f /workspace/app/k8s/ingress.yaml
		kubectl apply -f /workspace/app/k8s/ecom-backend-secret.yaml
        kubectl set image deployment/frontend \
        frontend=nadheer/ecommerce-frontend:${JOB_NAME}-${BUILD_NUMBER} \
        -n ecom
        kubectl set image deployment/backend \
        backend=nadheer/ecommerce-backend:${JOB_NAME}-${BUILD_NUMBER} \
        -n ecom
        kubectl rollout status deployment/frontend -n ecom
        kubectl rollout status deployment/backend -n ecom
        '''
    }
}
    }

    post {
        always {
            sh '''
        kubectl delete pod kaniko-frontend -n jenkins --ignore-not-found=true
        kubectl delete pod kaniko-backend -n jenkins --ignore-not-found=true
        '''
            deleteDir()
        }
    }
}
```


