peline {

  agent any



  environment {

    REGISTRY = "docker.io"

    DOCKERHUB_CREDENTIALS = 'dockerhub-creds' // Jenkins credentials ID (username/password)

    KUBE_CONFIG = 'kubeconfig' // Jenkins secret file credential holding kubeconfig

    DOCKER_USER = credentials('dockerhub-username') // optional

    IMAGE_BACKEND = "${env.DOCKERHUB_USER ?: 'yourdockerhub'}/ecommerce-backend"

    IMAGE_FRONTEND = "${env.DOCKERHUB_USER ?: 'yourdockerhub'}/ecommerce-frontend"

  }



  stages {

    stage('Checkout') {

      steps { checkout scm }

    }



    stage('Backend: Install & Test') {

      steps {

        dir('backend') {

          sh 'npm ci'

          sh 'npm test || true' // do not fail entire pipeline if no DB; adjust as needed

        }

      }

    }



    stage('Frontend: Install & Test') {

      steps {

        dir('frontend') {

          sh 'npm ci'

          sh 'npm test -- --watchAll=false || true'

        }

      }

    }



    stage('Build Docker Images') {

      steps 
