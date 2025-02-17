# **Kubernetes Project**

**Project Overview:** The aim of this project is to use AWS EKS to produce an environment for a react application that easier scaling ability and load management, in addition to other benefits such as high availability and a simpler deployment and update process.

Technologies used in this project include:

- AWS EKS
- AWS IAM
- Docker
- AWS ECR
- MONGO DB Cloud
- Fargate

<ins>**Project Archiecture**<ins>

![](/assets/images/diagram-export-16-02-2025-10_35_25.png)

# **Project Steps**

# **1. Create your EC2 machine**

Specifications for the EC2 machine used in this project are:

   - **Amazon Machine Image:** Ubuntu Server 22.04 LTS (HVM)
   - **Instance type:** t2.medium (This could be greater or smaller depending on the complexity of your application)
   - **Storage:** 30 GB (This also could be greater or smaller depending on application complexity)
     
**Result**
![](/assets/images/Imagem1.jpg)

# **2. Install Kubectl on EC2 instance**

In order to assist with the management of the Kubernetes cluster that we are going to create, Kubectl is a handy tool in assisting with the deployment of applications, troubleshooting of pods and log viewing directly from our EC2 instance.

As we are using an Ubuntu instance, we want to follow the installation instructions from this [website](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
under the section titled "**Install using native package management**"

Installation commands are as follows:

```
sudo apt-get update
# apt-transport-https may be a dummy package; if so, you can skip that package
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
sudo mkdir -p -m 755 /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.32/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
sudo chmod 644 /etc/apt/keyrings/kubernetes-apt-keyring.gpg # allow unprivileged APT programs to read this keyring
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.32/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo chmod 644 /etc/apt/sources.list.d/kubernetes.list   # helps tools such as command-not-found to work correctly
sudo apt-get update
sudo apt-get install -y kubectl
```

**Result**

![](/assets/images/Imagem2.jpg)

Kubectl is now on the EC2 instance

# **3. Install eksctl on EC2 instance**

While Kubectl helps us with the management of our Kubernetes infrastructure from our EC2 instance, eksctl enables us to actually build the overall architecture of our cluster. 

As we are using an Ubuntu instance, we want to follow the installation instructions from this [website](https://eksctl.io/installation/), under the section under the section titled "**For Unix**"

Installation commands are as follows:

```
# for ARM systems, set ARCH to: `arm64`, `armv6` or `armv7`
ARCH=amd64
PLATFORM=$(uname -s)_$ARCH

curl -sLO "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_$PLATFORM.tar.gz"

# (Optional) Verify checksum
curl -sL "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_checksums.txt" | grep $PLATFORM | sha256sum --check

tar -xzf eksctl_$PLATFORM.tar.gz -C /tmp && rm eksctl_$PLATFORM.tar.gz

sudo mv /tmp/eksctl /usr/local/bin
```

**Result**

![](/assets/images/Imagem3.jpg)

Eksctl is now on the EC2 instance.

# **4. Install AWS CLI on EC2 instance and Access Keys**

As eksctl will be require AWS resources in order to build the cluster, and kubectl will require access to AWS resources in order to manage them from our EC2 instance, it is therefore necessary to have AWS CLI installed on the EC2 instance to help facilitate this communication between AWS resources and our instance, and invariably our cluster.

As we are using an Ubuntu instance, we want to follow the installation instructions from this [website](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html), under the section under the section titled "**Linux**"

Installation commands are as follows:

```
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
sudo apt install unzip
unzip awscliv2.zip
sudo ./aws/install
```

**Result**

![](/assets/images/Imagem4.jpg)

AWS CLI is now on the EC2 instance.

# **Access Keys**

AWS CLI allows us to run AWS commands from our EC2 instance, however in order to get into the AWS 'building' we will require access keys.

For the purpose of this project, I am creating access keys in my root account, this is **NOT** recommended by AWS, and in the majority of circumstances, the conventional approach would be to create an IAM user and set the appropriate permissions there. 

For how to create an IAM user see - [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html).

For how to manage access keys for IAM users see - [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)

After downloading your access keys, and inserting the relevant credentials following the ```aws configure``` command, you can then run ```aws sts get-caller-identity``` to verify that the right account has been linked to your EC2 instance.

# **5. Create Cluster**

We are now finally able to create our cluster using eksctl, in order to so we run the **following command:**

```eksctl create cluster --name boxing-cluster --region us-east-1 --fargate```
