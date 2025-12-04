resource "aws_instance" "worker" {
  count                  = var.node_count - 2 # master + jenkins
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = var.key_name
  subnet_id              = aws_subnet.public_subnet.id
  vpc_security_group_ids = [aws_security_group.k8s_sg.id]

  root_block_device {
    volume_size = 30
  }

  tags = {
    Name = "k8s-worker-${count.index + 1}"
  }

  user_data = file("scripts/worker.sh")
}

