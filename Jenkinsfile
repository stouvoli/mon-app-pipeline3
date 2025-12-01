pipeline {
    agent {
        dockerfile {
            dir 'agent'
            // Le mapping du socket fonctionne sur Windows et Mac
            args '-u root -v /var/run/docker.sock:/var/run/docker.sock --network mon-app-pipeline2_devsecops-net'
        }
    }
    stages {
        stage('Checkout') { steps { checkout scm } }
        
        stage('Analyse SCA (Dépendances)') {
            steps {
                sh 'npm install'
                // Bloquant si failles High trouvées
                sh 'npm audit --audit-level=high' 
            }
        }
        
        stage('Analyse SAST (SonarQube)') {
            environment { scannerHome = tool 'SonarScanner' }
            steps {
                withSonarQubeEnv('SonarQube') {
       // Cette version est garantie de succès dans l'environnement Docker/Jenkins
                    sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=mon-app-pipeline -Dsonar.projectName=mon-app-pipeline -Dsonar.projectVersion=1.0 -Dsonar.sources=. -Dsonar.projectBaseDir=${WORKSPACE}"
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        
        stage('Build & Scan Image Docker') {
            steps {
                script {
                    def dockerImage = docker.build("mon-app-pipeline:${env.BUILD_ID}")
                    sh 'curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin'
                    sh "trivy image --exit-code 1 --severity CRITICAL mon-app-pipeline:${env.BUILD_ID}"
                }
            }
        }
    }
}
