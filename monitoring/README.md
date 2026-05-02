## **🚀 STEP 1 — Verify cluster access**

Run on master node (or Ansible server with kubectl configured):
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
*Worker node public IP

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

✔ Monitoring installed
✔ Pods running
✔ Ready for dashboard









