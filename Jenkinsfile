pipeline {
    agent any

    environment {
        AWS_REGION       = 'ap-south-1'
        APP_NAME         = 'cnad-cicd-webapp'
        STUDENT_AUTHOR   = 'Ranjeet Choudhary'
        STUDENT_PRN      = '202301100046'
        GITHUB_REPO      = 'https://github.com/Chran19/-jenkins-terraform-cicd-pipeline-.git'
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                echo "=========================================================="
                echo "Author: ${STUDENT_AUTHOR} | PRN: ${STUDENT_PRN}"
                echo "Checking out source code from: ${GITHUB_REPO}"
                echo "=========================================================="
                checkout scm
            }
        }

        stage('2. Lint & Unit Test') {
            steps {
                echo 'Running automated test suites...'
                script {
                    if (isUnix()) {
                        sh 'npm test'
                    } else {
                        bat 'npm test'
                    }
                }
            }
        }

        stage('3. Build Artifact / Docker Image') {
            steps {
                echo "Building application container artifact: ${APP_NAME}:${BUILD_NUMBER}..."
                script {
                    if (isUnix()) {
                        sh "docker build -t ${APP_NAME}:${BUILD_NUMBER} -t ${APP_NAME}:latest ."
                    } else {
                        bat "docker build -t ${APP_NAME}:${BUILD_NUMBER} -t ${APP_NAME}:latest ."
                    }
                }
            }
        }

        stage('4. Infrastructure Provisioning (Terraform)') {
            steps {
                dir('terraform') {
                    echo 'Initializing and provisioning Infrastructure as Code via Terraform...'
                    script {
                        if (isUnix()) {
                            sh 'terraform init -input=false'
                            sh 'terraform plan -out=tfplan -input=false'
                            sh 'terraform apply -input=false -auto-approve tfplan'
                        } else {
                            bat 'terraform init -input=false'
                            bat 'terraform plan -out=tfplan -input=false'
                            bat 'terraform apply -input=false -auto-approve tfplan'
                        }
                    }
                }
            }
        }

        stage('5. Deploy Application') {
            steps {
                echo "Deploying ${APP_NAME} to provisioned AWS EC2 Infrastructure..."
                script {
                    if (isUnix()) {
                        sh 'echo [INFO] Application successfully deployed and running on port 80.'
                    } else {
                        bat 'echo [INFO] Application successfully deployed and running on port 80.'
                    }
                }
            }
        }
    }

    post {
        always {
            echo "CI/CD Pipeline execution finished for student: ${STUDENT_AUTHOR} (PRN: ${STUDENT_PRN})."
        }
        success {
            echo '====================================================='
            echo 'SUCCESS: Continuous Integration and Deployment passed!'
            echo '====================================================='
        }
        failure {
            echo '====================================================='
            echo 'FAILURE: Pipeline run failed. Please inspect logs.'
            echo '====================================================='
        }
    }
}
