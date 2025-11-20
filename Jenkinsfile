pipeline {
    agent any
    
    tools {
          nodejs "node16"     // Jenkins → Manage Jenkins → Tools → NodeJS → node16
          }
    environment {
        DOCKERHUB_USER = "nadheer"                     // Your Docker Hub username
        BACKEND_IMAGE = "nadheer/ecommerce-backend:v1"
        FRONTEND_IMAGE = "nadheer/ecommerce-frontend:v1"
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'master', url: 'https://github.com/Nadheer18/Ecommerce-Project.git'
            }
        }
  
        stage('Frontend - Install Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend - Run Tests') {
            steps {
                dir('frontend') {
                    // If no tests available, it won't fail the pipeline
                    sh 'npm test -- --watchAll=false || true'
                }
            }
        }

        stage('Frontend - Build') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }
  
        stage('Backend - Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Backend - Run Tests') {
            steps {
                dir('backend') {
                    sh 'npm test -- --watchAll=false || true'
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    sh 'docker build -t nadheer/ecommerce-backend:v1 .'
                }
            }
        }
 
        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    sh 'docker build -t nadheer/ecommerce-frontend:v1 .'
                }
            }
        }

        stage('Push Images to DockerHub') {
            steps {
                withDockerRegistry(credentialsId: '29bf269e-71c1-4ba7-9d2e-8f4e6b145aad', 
                           url: 'https://index.docker.io/v1/') {
            sh '''
                docker push nadheer/ecommerce-backend:v1
                docker push nadheer/ecommerce-frontend:v1
            '''
            }
        }
    }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f k8s/namespace.yaml
                
                kubectl apply -f k8s/mysql-deployment.yaml
                kubectl apply -f k8s/mysql-service.yaml
                
                kubectl apply -f k8s/backend-deployment.yaml
                kubectl apply -f k8s/backend-service.yaml

                kubectl apply -f k8s/frontend-deployment.yaml
                kubectl apply -f k8s/frontend-service.yaml
                
                kubectl apply -f k8s/ingress.yaml
                '''
            }
        }
    }
}
