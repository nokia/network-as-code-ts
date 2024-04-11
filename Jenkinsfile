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
              npm audit
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
    stage('Build') {
      steps {
        container('narwhal') {
          script {
            sh """
            """
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
