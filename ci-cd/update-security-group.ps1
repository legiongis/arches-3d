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
    [int]$priority
)

$nsg = Get-AzureRmNetworkSecurityGroup -ResourceGroupName $resourceGroupName -Name $networkSecurityGroupName
Set-AzureRmNetworkSecurityRuleConfig -Name $securityRuleName `
                                     -NetworkSecurityGroup $nsg `
                                     -Access $allowOrDeny `
                                     -Protocol Tcp `
                                     -SourcePortRange * `
                                     -DestinationPortRange $destinationPortRange `
                                     -SourceAddressPrefix * `
                                     -Priority $priority `
                                     -Direction Inbound `
                                     -DestinationAddressPrefix *
Set-AzureRmNetworkSecurityGroup -NetworkSecurityGroup $nsg