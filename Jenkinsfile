pipeline {
    agent any

    environment {
        // Docker Hub username + password (ID: dockerhub)
        DOCKERHUB = credentials('dockerhub')

        // kubeconfig Secret File (ID: kubeconfig)
        KUBECONFIG_FILE = credentials('kubeconfig')

        // Docker image names
        FRONTEND_IMAGE = "nadheer/ecommerce-frontend"
        BACKEND_IMAGE  = "nadheer/ecommerce-backend"
    }

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'master', url: 'https://github.com/Nadheer18/Ecommerce-Project.git'
            }
        }

        stage('Build Frontend & Backend') {
            steps {
                sh '''
                echo "----------------------------------"
                echo "Building FRONTEND"
                echo "----------------------------------"
                cd frontend
                npm install
                npm run build
                cd ..

                echo "----------------------------------"
                echo "Building BACKEND"
                echo "----------------------------------"
                cd backend
                npm install
                cd ..
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                echo "Running FRONTEND Tests..."
                cd frontend
                npm test || true
                cd ..

                echo "Running BACKEND Tests..."
                cd backend
                npm test || true
                cd ..
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                echo "Building Docker Images..."
                cd frontend
                docker build -t nadheer/ecommerce-frontend:v1.1.1 .
                cd ..

                cd backend
                docker build -t nadheer/ecommerce-backend:v1.1.1 .
                cd ..
                '''
            }
        }

        stage('Docker Login') {
            steps {
                sh '''
                echo "$DOCKERHUB_PSW" | docker login -u "$DOCKERHUB_USR" --password-stdin
                '''
            }
        }

        stage('Docker Push') {
            steps {
                sh '''
                echo "Pushing Docker images to Docker Hub..."

                docker push $FRONTEND_IMAGE:v1.1.1
                docker push $BACKEND_IMAGE:v1.1.1
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG_FILE')]) {
                    sh '''
                    echo "Using kubeconfig: $KUBECONFIG_FILE"
                    export KUBECONFIG=$KUBECONFIG_FILE

                    echo "-------------------------------"
                    echo "Deploying to namespace: ecom"
                    echo "-------------------------------"

                    kubectl apply -f k8s/namespace.yaml
                    kubectl apply -f k8s/frontend-deployment.yaml
                    kubectl apply -f k8s/frontend-service.yaml
                    kubectl apply -f k8s/backend-deployment.yaml
                    kubectl apply -f k8s/backend-service.yaml
                    kubectl apply -f k8s/mysql-deployment.yaml
                    kubectl apply -f k8s/mysql-service.yaml
                    kubectl apply -f k8s/ingress.yaml
		    kubectl apply -f k8s/ecom-backend-secret.yaml

                    kubectl get pods -n ecom -o wide
                    '''
                }
            }
        }
    }   

    post {
        always {
            echo "Cleaning workspace..."
            cleanWs()
        }
    }
}  
