pipeline {
    agent any

    environment {
        NODE_VERSION = '20'  // Set to Node.js 20
        PNPM_VERSION = '7'   // Set pnpm version directly
        DOCKER_HUB_USERNAME = credentials('DOCKER_HUB_USERNAME')  // Docker Hub username stored in Jenkins
        DOCKER_HUB_CREDENTIALS_ID = 'docker-hub-credentials'  // Docker Hub PAT credentials stored in Jenkins
        DEPLOY_SERVER = credentials('DEPLOY_SERVER')  
        DEPLOY_USER = credentials('DEPLOY_USER') 
        SSH_PASSWORD = credentials('SSH_PASSWORD') 
    }

    stages {
        stage('Setup') {
            steps {
                script {
                    // Install Node.js and pnpm
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
                    // Using Docker Hub credentials to authenticate for pushing
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_HUB_CREDENTIALS_ID) {
                        // Tag the Docker image using the Docker Hub username and build number
                        def customImage = docker.build("${DOCKER_HUB_USERNAME}/balancee-task:${env.BUILD_NUMBER}")
                        // Push the image with the specific build number tag
                        customImage.push()
                        // Also push the image with the 'latest' tag
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
