variable "aws_region" {
  description = "AWS deployment region"
  type        = string
  default     = "ap-south-1"
}

variable "instance_type" {
  description = "EC2 compute instance type"
  type        = string
  default     = "t2.micro"
}

variable "ami_id" {
  description = "Optional custom AMI ID (leave empty to dynamically fetch latest Ubuntu 22.04 LTS)"
  type        = string
  default     = ""
}

variable "key_name" {
  description = "Optional AWS Key Pair Name for SSH access"
  type        = string
  default     = ""
}

variable "owner" {
  description = "Project Owner / Student Name"
  type        = string
  default     = "Ranjeet Choudhary"
}

variable "prn" {
  description = "Student PRN Number"
  type        = string
  default     = "202301100046"
}
