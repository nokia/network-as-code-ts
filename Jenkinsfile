#!/bin/groovy

def jenkinsBuildToken
withCredentials([string(credentialsId: 'gitlab-build-secret-token-sdk-py', variable: 'buildToken')]) {
 jenkinsBuildToken = "${buildToken}"
}

pipeline {
  agent {
    kubernetes {
      label "k8s-sdk-py-${cto.devops.jenkins.Utils.getTimestamp()}"
      inheritFrom 'k8s-proxy'
      yaml """
        spec:
          containers:
          - name: narwhal
            image: nex-nef-docker-releases.repo.cci.nokia.net/nmp/narwhal:latest
            workingDir: /home/jenkins
            tty: true
            command:
            - cat
          - name: sonar
            image: registry1-docker-io.repo.cci.nokia.net/sonarsource/sonar-scanner-cli:5.0.1
            workingDir: /home/jenkins
            tty: true
            command:
            - cat
      """
    }
  }
  triggers {
    gitlab(
      triggerOnPush: true,
      branchFilterType: 'All',
      triggerOnMergeRequest: true,
      triggerOpenMergeRequestOnPush: "never",
      triggerOnNoteRequest: true,
      triggerOnAcceptedMergeRequest: true,
      noteRegex: "Jenkins please retry a build",
      skipWorkInProgressMergeRequest: true,
      ciSkip: false,
      setBuildDescription: true,
      addNoteOnMergeRequest: true,
      addCiMessage: true,
      addVoteOnMergeRequest: true,
      acceptMergeRequestOnSuccess: true,
      cancelPendingBuildsOnUpdate: false,
      secretToken: jenkinsBuildToken
    )
  }
  parameters {
    string(name: 'gitlabSourceBranch', defaultValue: 'master', description: 'Default branch used when built on-demand', trim: true)
  }
  environment {
    NAC_TOKEN = credentials('NAC_TOKEN')
    TEAMS_WEBHOOK = credentials('TEAMS_WEBHOOK')
    NPM_AUTH_TOKEN = credentials('NPM_AUTH_TOKEN')
    SONAR_PATH = "/opt/sonar-scanner/bin"
    SONAR_TOKEN = "sonar-token"
  }
  options {
    gitLabConnection('gitlab-ee2')  // the GitLab connection name defined in Jenkins, check the value from pipeline configure UI
    timeout(time: 60, unit: 'MINUTES')
    buildDiscarder(logRotator(daysToKeepStr: '30', artifactDaysToKeepStr: '1'))
    disableConcurrentBuilds()
    timestamps()
  }
  stages {
    stage('Setup') {
      steps {
        container('narwhal') {
          script {
            sh """
              npm config set proxy http://fihel1d-proxy.emea.nsn-net.net:8080
              npm i
            """
          }
        }        
      }
    }
    stage('Linting') {
      steps {
        container('narwhal') {
          script {
            sh """
              npm run lint
            """
          }
        }        
      }
    }
    stage('Test') {
      steps {
        container('narwhal') {
          script {
            sh """
              npm test
            """
          }
        }        
      }
    }
    stage('Audit') {
      steps {
        container('narwhal') {
          script {
            sh """
              npm audit --prod
            """
          }
        }        
      }
    }
    stage('Integration Test') {
      steps {
        container('narwhal') {
          script {
            sh """
              env | grep gitlab
              https_proxy="http://fihel1d-proxy.emea.nsn-net.net:8080" npm run integration
            """
          }
        }        
      }
    }
    stage('Sonar Scan') {
          steps {
              withCredentials([string(credentialsId: "${SONAR_TOKEN}", variable: 'sonar_login')]) {
                  container('sonar') {
                      script {
                          sh """
                              export PATH=$PATH:${SONAR_PATH}
                              sonar-scanner \
                                  -Dsonar.projectKey=nac-sdk-ts \
                                  -Dsonar.sources=./src \
                                  -Dsonar.tests=./tests \
                                  -Dsonar.host.url=${SONARQUBE_HTTPS_URL} \
                                  -Dsonar.login=${sonar_login} \
                                  -Dsonar.javascript.lcov.reportPaths=./coverage/lcov.info
                          """
                      }
                  }
              }
          }
      }
    stage('Build') {
      steps {
        container('narwhal') {
          script {
            sh """
              npm run build
            """
          }
        }
      }
    }
    stage('Installation Test'){
      steps {
        container('narwhal') {
          script {
            sh '''
                bash installation-test/installation-test-ts.sh              
                bash installation-test/installation-test-js.sh              
            '''
          }
        }
      }
    }
    stage('Publish') {
        when { expression { env.gitlabActionType == "TAG_PUSH" && env.gitlabBranch.contains("release-")} }
            steps {
                container('narwhal') {
                    script {
                        if(env.gitlabActionType == "TAG_PUSH" && env.gitlabBranch.contains("release-")) {
                            sh '''
                                npm config set -- '//registry.npmjs.org/:_authToken' "${NPM_AUTH_TOKEN}"
                                https_proxy="http://fihel1d-proxy.emea.nsn-net.net:8080" npm publish --verbose
                            '''
                        }
                    }
                }
            }
        }
  }
  post {
    success{
      updateGitlabCommitStatus name: 'build', state: 'success'
    }
    failure{
      postToTeams("Jenkins build failed see ${env.BUILD_URL} for more.", "${TEAMS_WEBHOOK}")
      updateGitlabCommitStatus name: 'build', state: 'failed'
    }
  }
}
