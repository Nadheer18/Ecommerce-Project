############################################################
# Terraform Initialization & Required Providers
############################################################

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

############################################################
# AWS Provider
############################################################

#provider are defined in provider.tf 

############################################################
# VPC + Networking + Security Groups
############################################################

# VPC is created in vpc.tf
# Subnets are created in subnets.tf
# Route tables & IGW in routing.tf
# Security groups in security-groups.tf


############################################################
# EC2 Instances (K8s Master + Workers)
############################################################

# Master node in ec2-master.tf
# Worker nodes in ec2-workers.tf


############################################################
# Jenkins EC2 Server
############################################################

# Jenkins server created in jenkins-server.tf


############################################################
# Outputs (IP Address etc.)
############################################################

# Outputs are defined in outputs.tf

