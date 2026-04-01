import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;

  return {
    title: locale === "de" 
      ? "CloudFormation Security 2026 | AWS IaC Security & Best Practices"
      : "CloudFormation Security 2026 | AWS IaC Security & Best Practices",
    description: locale === "de"
      ? "CloudFormation Security: Stack Policies, Drift Detection, Service Roles, Secrets Management & Compliance. AWS Infrastructure as Code Security."
      : "CloudFormation security: stack policies, drift detection, service roles, secrets management & compliance. AWS IaC security.",
    keywords: [
      "CloudFormation security",
      "AWS CloudFormation hardening",
      "CloudFormation stack policy",
      "CloudFormation drift detection",
      "CloudFormation service role",
      "AWS IaC security",
      "CloudFormation compliance",
      "StackSets security",
      "AWS infrastructure security",
      "CloudFormation best practices",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/cloudformation-security`),
    },
    openGraph: {
      title: "CloudFormation Security 2026: AWS IaC Protection",
      description: "Secure CloudFormation with stack policies, drift detection, service roles & compliance controls.",
      type: "article",
      url: `${BASE_URL}/${locale}/cloudformation-security`,
    },
  };
}

export default function CloudFormationSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;
  const prefix = `/${locale}`;
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">CloudFormation Security</h1>
            <p className="text-2xl text-amber-100 mb-4">AWS IaC Security 2026</p>
            <p className="text-xl text-white/80 mb-8">Stack Policies, Drift Detection, Service Roles, Secrets Management & Compliance</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Stack Policy</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Drift Detection</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Service Role</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">StackSets</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">CloudFormation Security Architecture</h2>
            <p className="text-slate-700 text-lg mb-6">
              CloudFormation Stacks können komplette AWS-Umgebungen erstellen oder zerstören. Ohne Security könnten Stacks ungewollt gelöscht oder modifiziert werden. Stack Policies, Service Roles und Drift Detection sind essentiell.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="font-semibold text-orange-900 mb-2">Stack Protection</h3>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Stack Policies</li>
                  <li>• Termination Protection</li>
                  <li>• Change Sets</li>
                  <li>• Rollback Configuration</li>
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="font-semibold text-amber-900 mb-2">Access Control</h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Service Roles</li>
                  <li>• IAM Permissions</li>
                  <li>• SCP Restrictions</li>
                  <li>• Cross-Account</li>
                </ul>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="font-semibold text-yellow-900 mb-2">Governance</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Drift Detection</li>
                  <li>• StackSets</li>
                  <li>• Hook Policies</li>
                  <li>• Config Rules</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Stack Policy (Prevent Deletion)</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# production-stack-policy.json - Prevent Resource Modification

{
  "Statement": [
    {
      "Effect": "Deny",
      "Action": [
        "Update:Delete",
        "Update:Replace"
      ],
      "Principal": "*",
      "Resource": "LogicalResourceId/ProductionDatabase",
      "Condition": {
        "StringEquals": {
          "ResourceType": [
            "AWS::RDS::DBInstance",
            "AWS::RDS::DBCluster"
          ]
        }
      }
    },
    {
      "Effect": "Deny",
      "Action": [
        "Update:Delete",
        "Update:Replace"
      ],
      "Principal": "*",
      "Resource": "LogicalResourceId/ProductionVPC",
      "Condition": {
        "StringEquals": {
          "ResourceType": [
            "AWS::EC2::VPC",
            "AWS::EC2::Subnet",
            "AWS::EC2::RouteTable"
          ]
        }
      }
    },
    {
      "Effect": "Deny",
      "Action": [
        "Update:Delete",
        "Update:Replace"
      ],
      "Principal": "*",
      "Resource": "LogicalResourceId/VaultKMSKey",
      "Condition": {
        "StringEquals": {
          "ResourceType": [
            "AWS::KMS::Key"
          ]
        }
      }
    },
    {
      "Effect": "Deny",
      "Action": [
        "Update:*"
      ],
      "Principal": "*",
      "Resource": "LogicalResourceId/S3DataBucket",
      "Condition": {
        "StringEquals": {
          "ResourceType": [
            "AWS::S3::Bucket"
          ]
        },
        "StringNotEquals": {
          "ResourcePropertyDifference.Types": ["Add"]  # Only allow additions
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": "Update:*",
      "Principal": "*",
      "Resource": "*"
    }
  ]
}

# Apply Stack Policy
aws cloudformation set-stack-policy \\\n  --stack-name production-infrastructure \\\n  --stack-policy-body file://production-stack-policy.json

# Or during stack creation
aws cloudformation create-stack \\\n  --stack-name production-infrastructure \\\n  --template-body file://template.yaml \\\n  --stack-policy-body file://production-stack-policy.json \\\n  --enable-termination-protection`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">CloudFormation Service Role</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# cloudformation-service-role.yaml - Least Privilege Role

AWSTemplateFormatVersion: '2010-09-09'
Description: CloudFormation Service Role with Minimal Permissions

Resources:
  CloudFormationServiceRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: CloudFormation-Deployment-Role
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: cloudformation.amazonaws.com
            Action: sts:AssumeRole
            Condition:
              StringEquals:
                aws:SourceAccount: !Ref AWS::AccountId
      
      # Inline Policies (least privilege)
      Policies:
        - PolicyName: EC2Permissions
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Sid: VPCReadOnly
                Effect: Allow
                Action:
                  - ec2:DescribeVpcs
                  - ec2:DescribeSubnets
                  - ec2:DescribeSecurityGroups
                Resource: "*"
              
              - Sid: SpecificVPCModify
                Effect: Allow
                Action:
                  - ec2:CreateSecurityGroup
                  - ec2:DeleteSecurityGroup
                  - ec2:AuthorizeSecurityGroupIngress
                  - ec2:RevokeSecurityGroupIngress
                Resource: 
                  - !Sub "arn:aws:ec2:$\${AWS::Region}:$\${AWS::AccountId}:vpc/vpc-*"
                  - !Sub "arn:aws:ec2:$\${AWS::Region}:$\${AWS::AccountId}:security-group/*"
                Condition:
                  StringEquals:
                    ec2:Vpc: !ImportValue ProductionVPC
        
        - PolicyName: S3Permissions
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Sid: SpecificBucketOnly
                Effect: Allow
                Action:
                  - s3:CreateBucket
                  - s3:DeleteBucket
                  - s3:PutBucketPolicy
                  - s3:PutBucketEncryption
                  - s3:PutBucketVersioning
                Resource: 
                  - !Sub "arn:aws:s3:::company-data-$\${AWS::AccountId}-*"
                  - !Sub "arn:aws:s3:::company-data-$\${AWS::AccountId}-*/*"
        
        - PolicyName: RDSPermissions
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Sid: RDSModifyOnly
                Effect: Allow
                Action:
                  - rds:CreateDBInstance
                  - rds:ModifyDBInstance
                  - rds:DeleteDBInstance
                Resource: 
                  - !Sub "arn:aws:rds:$\${AWS::Region}:$\${AWS::AccountId}:db:production-*"
                Condition:
                  StringEquals:
                    rds:Vpc: !ImportValue ProductionVPC
        
        - PolicyName: DenyDangerous
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Sid: DenyIAMChanges
                Effect: Deny
                Action:
                  - iam:CreateUser
                  - iam:DeleteUser
                  - iam:CreateAccessKey
                  - iam:DeleteAccountPasswordPolicy
                Resource: "*"
              
              - Sid: DenyOrgChanges
                Effect: Deny
                Action:
                  - organizations:LeaveOrganization
                  - organizations:DeleteOrganization
                Resource: "*"
      
      # Permission Boundaries
      PermissionsBoundary: !Ref CloudFormationPermissionsBoundary

  CloudFormationPermissionsBoundary:
    Type: AWS::IAM::ManagedPolicy
    Properties:
      ManagedPolicyName: CloudFormation-Permissions-Boundary
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Action:
              - ec2:*
              - s3:*
              - rds:*
              - elasticloadbalancing:*
            Resource: "*"
            Condition:
              StringEquals:
                aws:RequestedRegion:
                  - !Ref AWS::Region
          
          - Effect: Deny
            Action:
              - iam:*
              - organizations:*
              - account:*
            Resource: "*"

# Use the service role
aws cloudformation create-stack \\\n  --stack-name production-infrastructure \\\n  --template-body file://template.yaml \\\n  --role-arn arn:aws:iam::123456789:role/CloudFormation-Deployment-Role`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Drift Detection & Remediation</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Lambda - Automated Drift Detection & Remediation

import boto3
import json
from datetime import datetime, timedelta

def lambda_handler(event, context):
    cf = boto3.client('cloudformation')
    sns = boto3.client('sns')
    
    # Get production stacks
    stacks = cf.list_stacks(
        StackStatusFilter=['CREATE_COMPLETE', 'UPDATE_COMPLETE']
    )
    
    drift_detected = []
    
    for stack in stacks['StackSummaries']:
        stack_name = stack['StackName']
        
        # Skip non-production stacks
        if 'production' not in stack_name.lower():
            continue
        
        # Detect drift
        drift_response = cf.detect_stack_drift(StackName=stack_name)
        drift_id = drift_response['StackDriftDetectionId']
        
        # Wait for detection (poll)
        waiter = cf.get_waiter('stack_drift_detection_complete')
        waiter.wait(StackDriftDetectionId=drift_id)
        
        # Get drift status
        drift_status = cf.describe_stack_drift_detection_status(
            StackDriftDetectionId=drift_id
        )
        
        if drift_status['StackDriftStatus'] == 'DRIFTED':
            drifted_resources = cf.describe_stack_resource_drifts(
                StackName=stack_name,
                StackResourceDriftStatusFilters=['MODIFIED', 'DELETED', 'NOT_CHECKED']
            )
            
            drift_detected.append({
                'StackName': stack_name,
                'DriftId': drift_id,
                'DriftedResources': len(drifted_resources['StackResourceDrifts']),
                'Resources': [
                    {
                        'LogicalId': r['LogicalResourceId'],
                        'Type': r['ResourceType'],
                        'Status': r['StackResourceDriftStatus'],
                        'PropertyDifferences': r.get('PropertyDifferences', [])
                    }
                    for r in drifted_resources['StackResourceDrifts']
                ]
            })
            
            # Auto-remediate specific resources
            for resource in drifted_resources['StackResourceDrifts']:
                if resource['StackResourceDriftStatus'] == 'MODIFIED':
                    logical_id = resource['LogicalResourceId']
                    
                    # Only auto-remediate safe resources
                    if resource['ResourceType'] in ['AWS::EC2::SecurityGroup', 'AWS::IAM::Role']:
                        # Create change set to remediate
                        change_set = cf.create_change_set(
                            StackName=stack_name,
                            ChangeSetName=f"drift-remediation-{datetime.now().strftime('%Y%m%d%H%M%S')}",
                            ChangeSetType='UPDATE',
                            UsePreviousTemplate=True,
                            Capabilities=['CAPABILITY_IAM']
                        )
                        
                        # Auto-execute for approved resources
                        cf.execute_change_set(
                            ChangeSetName=change_set['Id'],
                            StackName=stack_name
                        )
    
    # Send alert if drift detected
    if drift_detected:
        sns.publish(
            TopicArn='arn:aws:sns:us-east-1:123456789:security-alerts',
            Subject='CloudFormation Drift Detected',
            Message=json.dumps(drift_detected, indent=2, default=str)
        )
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'StacksChecked': len(stacks['StackSummaries']),
            'DriftDetected': len(drift_detected),
            'Details': drift_detected
        })
    }

# CloudWatch Event Rule for scheduled drift detection
# EventBridge Rule: Daily at 2 AM
{
  "source": ["aws.events"],
  "detail-type": ["Scheduled Event"],
  "resources": ["arn:aws:events:us-east-1:123456789:rule/daily-drift-check"]
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">StackSets for Multi-Account Governance</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# stackset-administration.yaml - Multi-Account StackSet

AWSTemplateFormatVersion: '2010-09-09'
Description: Security Baseline StackSet for All Accounts

Parameters:
  TargetOUID:
    Type: String
    Description: AWS Organizations OU ID

Resources:
  SecurityBaselineStackSet:
    Type: AWS::CloudFormation::StackSet
    Properties:
      StackSetName: security-baseline
      Description: Security baseline for all accounts
      PermissionModel: SERVICE_MANAGED  # Use Organizations
      AutoDeployment:
        Enabled: true
        RetainStacksOnAccountRemoval: false
      
      TemplateURL: https://s3.amazonaws.com/company-templates/security-baseline.yaml
      
      Parameters:
        - ParameterKey: EnableGuardDuty
          ParameterValue: "true"
        - ParameterKey: EnableCloudTrail
          ParameterValue: "true"
        - ParameterKey: EnableConfig
          ParameterValue: "true"
      
      StackInstancesGroup:
        - DeploymentTargets:
            OrganizationalUnitIds:
              - !Ref TargetOUID
          Regions:
            - us-east-1
            - us-west-2
            - eu-west-1
            - eu-central-1
      
      OperationPreferences:
        FailureToleranceCount: 1
        MaxConcurrentCount: 5
        RegionConcurrencyType: PARALLEL
      
      Capabilities:
        - CAPABILITY_IAM
        - CAPABILITY_AUTO_EXPAND

# StackSet Instance with Service Role
StackSetInstance:
  Type: AWS::CloudFormation::StackSet
  Properties:
    StackSetName: network-baseline
    TemplateURL: https://s3.amazonaws.com/company-templates/vpc-baseline.yaml
    
    ExecutionRoleName: AWSCloudFormationStackSetExecutionRole
    AdministrationRoleARN: !Sub "arn:aws:iam::$\${ManagementAccountId}:role/AWSCloudFormationStackSetAdministrationRole"
    
    StackInstancesGroup:
      - DeploymentTargets:
          Accounts:
            - "123456789012"
            - "123456789013"
        Regions:
          - us-east-1
    
    OperationPreferences:
      FailureTolerancePercentage: 20
      MaxConcurrentPercentage: 50`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">CloudFormation Security Assessment</h2>
            <a href={`${prefix}/check`} className="inline-block px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold">Assessment Starten</a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "CloudFormation Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
