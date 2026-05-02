 # 🚀 Kubernetes Monitoring Setup (Prometheus + Grafana + Alertmanager on EKS)
### **📌 Overview**
This project demonstrates how to set up a complete monitoring and alerting stack on a Kubernetes cluster using:
* Prometheus — Metrics collection
* Grafana — Visualization dashboards
* Alertmanager — Alert routing & notifications

The setup is deployed on an Amazon EKS cluster using Helm.
  
## **🚀 STEP 1 — Verify cluster access**

Run EC2:
```bash
kubectl get nodes
```
###### 👉 You should see:
  NAME                             STATUS   ROLES    AGE    VERSION
* ip-192-168-43-251.ec2.internal   Ready    <none>   151m   v1.34.7-eks-40737a8
* ip-192-168-6-144.ec2.internal    Ready    <none>   151m   v1.34.7-eks-40737a8
## **🚀 STEP 2 — Install Helm**
```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```
###### Verify:
```bash
helm version
```
## **🚀 STEP 3 — Add Prometheus Helm repo**
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```
## **🚀 STEP 4 — Create namespace**
```bash
kubectl create namespace monitoring
```
## **🚀 STEP 5 — Install Prometheus + Grafana (IMPORTANT)**
We install kube-prometheus-stack (this includes everything).
```bash
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring
```
⏳ Wait 2–3 minutes
## **🚀 STEP 6 — Check pods**
```bash
kubectl get pods -n monitoring
```
###### You should see pods like:

* prometheus-xxxx
* grafana-xxxx
* alertmanager-xxxx
* node-exporter-xxxx
## **🚀 STEP 7 — Access Grafana**
 ###### Get service:
 ```bash
kubectl get svc -n monitoring
```
Find:
 ```bash
monitoring-grafana   ClusterIP
```
 OPTION A (easy for now — NodePort)
 ```bash
kubectl edit svc monitoring-grafana -n monitoring
```
Change:
 ```YAML
type: ClusterIP
```
➡ to:
 ```YAML
type: NodePort
```
Save and exit.

Now get port:
 ```bash
kubectl get svc monitoring-grafana -n monitoring
```
Example:
 ```bash
NodePort: 32000
 ```
Open in browser:
 ```bash
http://<WorkerNodeIP>:<NodePort>
 ```
###### Get WorkerNodeIP
```bash
kubectl describe po  monitoring-grafana-**********-***** -n monitoring |grep Node
```
###### 👉 You should see:
Node:             ip-192-168-6-144.ec2.internal/192.168.6.144

fint this node name public ip
### **⚠️ If Page Not Opening**
Check:
#### 1. Security Group (VERY IMPORTANT)
Allow:
* Port 30000–32767 (NodePort range)
#### 2. Node IP
Make sure you use:
* Worker node public IP

## **🔐 STEP 8 — Get Grafana password**
 ```bash
kubectl get secret monitoring-grafana -n monitoring -o jsonpath="{.data.admin-password}" | base64 --decode
 ```
👉 Username: admin

👉 Password: (from command)
### **📊 What you will see**
**👉 Dashboards already pre-installed:**
* Node metrics
* Pod metrics
* Cluster usage
### **⚠️ Common Issues (quick fix)**
❌ Pods not starting?
 ```bash
kubectl describe pod <pod-name> -n monitoring
 ```
❌ No metrics?

Wait 2–5 minutes (Prometheus needs time)

## **✅ Final Status**

* ✔ Monitoring installed
* ✔ Pods running
* ✔ Ready for dashboard

### **🧠 What you’ve achieved**
***You now have:***
* Prometheus collecting metrics → detects problems
* Alertmanager (already installed) → sends alerts
* Grafana visualizing data → optional alert UI
* Full Kubernetes monitoring on your EKS cluster
### **🧠 How alerting works (simple)**
* Prometheus checks metrics
* Rule triggers (CPU high, pod down)
* Alertmanager sends notification (email, Slack, etc.)

## **setup alerts**
### **🚀 STEP 1 — Create Alert Rule (CPU High)**
```bash
kubectl apply -f - <<EOF
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: high-cpu-alert
  namespace: monitoring
spec:
  groups:
  - name: cpu-alerts
    rules:
    - alert: HighCPUUsage
      expr: sum(rate(container_cpu_usage_seconds_total{container!=""}[1m])) by (pod) > 0.5
      for: 1m
      labels:
        severity: warning
      annotations:
        summary: "High CPU usage detected"
        description: "Pod CPU usage is above threshold"
EOF
```
### ***🔍 Verify rule***
```bash
kubectl get prometheusrule -n monitoring
```
### **🚀 STEP 2 — Configure Alertmanager (Email)**
#### **STEP 1 — Create Alertmanager config file**
Now we tell Alertmanager where to send alerts

On your server:
```bash
vi alertmanager.yaml
```
Paste this:
```bash
global:
  resolve_timeout: 5m

route:
  receiver: email-alert

receivers:
- name: email-alert
  email_configs:
  - to: your-email@gmail.com
    from: your-email@gmail.com
    smarthost: smtp.gmail.com:587
    auth_username: your-email@gmail.com
    auth_password: your-app-password
    require_tls: true
```
🔐 IMPORTANT (Gmail)

### ***👉 You MUST use:***

* Gmail App Password

  NOT normal password
#### **🚀 STEP 2 — Create Kubernetes secret**
```bash
kubectl create secret generic alertmanager-config \
  --from-file=alertmanager.yaml \
  -n monitoring
```
#### **🚀 STEP 3 — Update Alertmanager to use this config**
Run:
```bash
kubectl edit alertmanager monitoring-kube-prometheus-alertmanager -n monitoring
```
Find:
```YAML
configSecret:
```
Change to:
```YAML
configSecret: alertmanager-config
```
##### ***🧠 Where exactly to add it***
```bash
spec:
  affinity:
  ...
  alertmanagerConfigNamespaceSelector: {}
  alertmanagerConfigSelector: {}
```
👉 You will add it just below these lines

***✅ Final edited section should look like this:***
```bash
spec:
  alertmanagerConfigNamespaceSelector: {}
  alertmanagerConfigSelector: {}
  configSecret: alertmanager-config
```
##### ***⚠️ Important (very important)***
👉 Do NOT put it:

* inside metadata ❌
* inside status ❌

👉 Only inside:
```YAML
spec:
```
##### ***🚀 After adding***
Save and exit editor
### **🚀 STEP 3 — Restart Alertmanager**
```bash
kubectl delete pod -l alertmanager=monitoring-kube-prometheus-alertmanager -n monitoring
```
### **🔍 STEP 4 — Check logs**
```bash
kubectl logs -n monitoring -l alertmanager=monitoring-kube-prometheus-alertmanager
```
****👉 You should see:****
```bash
Loading configuration file
```
### **🚀 STEP 5 — Trigger alert**
Crash pod again:
```bash
kubectl exec -it <your-pod> -n <namespace> -- kill 1
```
Wait 1–2 minutes
### **🔍 Check alerts in Grafana**
Go to:
👉 Grafana → Alerting → Alert rules
### **🔍 Check alerts in Prometheus UI**
Run:
```bash
kubectl port-forward svc/monitoring-kube-prometheus-prometheus 9090 -n monitoring
```
Open:
```bash
http://localhost:9090
```
if we want open our personal laptop?
Open cmd :
```bash
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP> -L 9090:localhost:9090
```
### **🔍 Check alerts in Alertmanager UI**
Run:
```bash
kubectl port-forward svc/alertmanager-operated 9093 -n monitoring
```
Open:
```bash
http://localhost:9093
```
### **📩 STEP  — Check email**
* Inbox
* Spam
#### **⚠️ If email not coming**
Check:
**1. Wrong password ❌**
👉 Use Gmail App Password
**2.Logs error**
```bash
kubectl logs -n monitoring <alertmanager-pod>
```
Look for:
* smtp error
* auth failed



