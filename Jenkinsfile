pipeline {
    agent any

    environment {
        NODE_VERSION = credentials('NODE_VERSION') 
        PNPM_VERSION = credentials('PNPM_VERSION') 
        DOCKER_HUB_USERNAME = credentials('DOCKER_HUB_USERNAME') 
        DEPLOY_SERVER = credentials('DEPLOY_SERVER')  
        DEPLOY_USER = credentials('DEPLOY_USER') 
        SSH_PASSWORD = credentials('SSH_PASSWORD') 
    }

    stages {
        stage('Setup') {
            steps {
                script {
                    // Install Node.js
                    sh "curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -"
                    sh 'sudo apt-get install -y nodejs'
                    sh "sudo npm install -g pnpm@${PNPM_VERSION}"
                }
            }
        }

        stage('Build') {
            steps {
                sh 'pnpm install'
                sh 'pnpm build'
            }
        }

        stage('Test') {
            steps {
                sh 'pnpm run test'
            }
        }

        stage('Docker Build and Push') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                        def customImage = docker.build("${DOCKER_HUB_USERNAME}/balancee-task:${env.BUILD_NUMBER}")
                        customImage.push()
                        customImage.push("latest")
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    def remote = [:]
                    remote.name = 'deployment-server'
                    remote.host = DEPLOY_SERVER
                    remote.user = DEPLOY_USER
                    remote.password = SSH_PASSWORD
                    remote.allowAnyHosts = true

                    sshCommand remote: remote, command: """
                        echo "Connecting to server ${DEPLOY_SERVER}"
                        cd balancee-task || exit
                        git pull origin main
                        docker pull ${DOCKER_HUB_USERNAME}/balancee-task:latest
                        docker-compose up -d
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
