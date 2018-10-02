[CmdletBinding()]
Param(
    [Parameter(Mandatory=$True)]
    [string]$resourceGroupName,
    [Parameter(Mandatory=$True)]
    [string]$networkSecurityGroupName,
    [Parameter(Mandatory=$True)]
    [string]$securityRuleName,
    [Parameter(Mandatory=$True)]
    [string]$allowOrDeny,
    [Parameter(Mandatory=$True)]
    [string]$destinationPortRange,
    [Parameter(Mandatory=$True)]
    [string]$destinationApplicationSecurityGroup,
    [Parameter(Mandatory=$True)]
    [int]$priority
)

$networkSecurityGroup = Get-AzureRmNetworkSecurityGroup -ResourceGroupName $resourceGroupName -Name $networkSecurityGroupName

$applicationSecurityGroup = Get-AzureRmApplicationSecurityGroup -ResourceGroupName $resourceGroupName -Name $destinationApplicationSecurityGroup

Set-AzureRmNetworkSecurityRuleConfig -Name $securityRuleName `
                                     -NetworkSecurityGroup $networkSecurityGroup `
                                     -Access $allowOrDeny `
                                     -Protocol Tcp `
                                     -SourcePortRange * `
                                     -DestinationPortRange $destinationPortRange `
                                     -SourceAddressPrefix * `
                                     -Priority $priority `
                                     -Direction Inbound `
                                     -DestinationApplicationSecurityGroup $applicationSecurityGroup
                                     
Set-AzureRmNetworkSecurityGroup -NetworkSecurityGroup $networkSecurityGroup