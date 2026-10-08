pipeline {
    agent any
    
    environment {
        BUN_INSTALL = "${HOME}/.bun"
        PATH = "${BUN_INSTALL}/bin:${PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'bun install'
            }
        }
        
        stage('Test & Coverage') {
            steps {
                sh 'bun run test:coverage'
            }
        }
        
        stage('Trivy Scan') {
            steps {
                sh 'trivy fs . --severity HIGH,CRITICAL'
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner'
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        
        stage('Package Application') {
            steps {
                sh 'bun run build'
                sh 'zip -r app.zip dist/'
            }
        }
        
        stage('Publish & Deploy') {
            steps {
                sh 'curl -X POST http://deploy-server/api/redeploy -F "file=@app.zip"'
            }
        }
    }
}

