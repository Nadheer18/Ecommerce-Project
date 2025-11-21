#!/bin/bash

set -e

CLUSTER_NAME="my-cluster"
CONFIG_FILE="kind-config.yaml"

echo "🧹 Deleting old cluster if exists..."
kind delete cluster --name $CLUSTER_NAME || true


echo "🚀 Creating new Kind cluster with mapping..."
kind create cluster --name $CLUSTER_NAME --config $CONFIG_FILE


echo "🔄 Generating NEW kubeconfig..."
kind get kubeconfig --name $CLUSTER_NAME > kubeconfig


echo "📌 Updating kubeconfig for root user..."
mkdir -p ~/.kube
cp kubeconfig ~/.kube/config
echo "✔ Root kubeconfig updated."


echo "📌 Updating kubeconfig for Jenkins user..."
sudo mkdir -p /var/lib/jenkins/.kube
sudo cp kubeconfig /var/lib/jenkins/.kube/config
sudo chown -R jenkins:jenkins /var/lib/jenkins/.kube
echo "✔ Jenkins kubeconfig updated."


echo "🧪 Testing root access to cluster..."
kubectl get nodes


echo "🧪 Testing Jenkins access to cluster..."
sudo su - jenkins -c "kubectl get nodes"


echo "🌐 Installing ingress-nginx for Kind..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.1/deploy/static/provider/kind/deploy.yaml


echo "⏳ Waiting for ingress controller..."
kubectl wait --namespace ingress-nginx \
  --for=condition=available deployment/ingress-nginx-controller \
  --timeout=180s


echo "🎉 All done! Kind cluster is ready with updated kubeconfig."
echo "You can now run: kubectl apply -f k8s/"
