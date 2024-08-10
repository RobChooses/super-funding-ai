// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./CampaignToken.sol";

contract CampaignManager {
    // Struct to hold campaign details
    struct Campaign {
        string projectName;
        string projectDescription;
        string projectTag;
        string projectTokenTicker;
        string[] socialLinks;
        string[] websiteLinks;
        uint256 totalAmountToRaise; // cUSD
        uint256 timePeriod; // in seconds
        // uint256 stagesCount;
        uint256[] stageAmounts; // Array of amounts for each stage
        string[] prompts; // Array of prompts for AI attestation
        address owner;
        bool isActive;
        uint256 raisedAmount; // Track the amount raised so far
        uint256 currentStage; // Track the current stage of the campaign
        address tokenAddress; // Address of the ERC20 token
        mapping(address => uint256) backers; // Track backers and their investments
        address[] backerAddresses; // Array to track the addresses of the backers
    }

    // Mapping from campaign ID to Campaign details
    mapping(uint256 => Campaign) public campaigns;

    // Mapping from owner address to array of campaign IDs
    mapping(address => uint256[]) public ownerCampaigns;

    // Counter for campaign IDs
    uint256 public campaignIdCounter;

    // Event to be emitted when a new campaign is created
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed owner,
        address tokenAddress
    );

    // Event to be emitted when a user invests in a campaign
    event InvestmentMade(
        uint256 indexed campaignId,
        address indexed investor,
        uint256 amount
    );

    // Event to be emitted when a stage is completed
    event StageCompleted(
        uint256 indexed campaignId,
        uint256 stage,
        uint256 amount
    );

    // Function to create a new campaign
    function createCampaign(
        string memory _projectName,
        string memory _projectDescription,
        string memory _projectTag,
        string memory _projectTokenTicker,
        // string memory _logoUrl,
        string[] memory _socialLinks,
        string[] memory _websiteLinks,
        uint256 _totalAmountToRaise,
        uint256 _timePeriod,
        // uint256 _stagesCount,
        uint256[] memory _stageAmounts,
        string[] memory _prompts
    ) public returns (uint256) {
        require(
            _stageAmounts.length > 0 && _stageAmounts.length <= 5,
            "Stages count must be between 1 and 5"
        );

        campaignIdCounter++;

        // Deploy ERC20 token
        CampaignToken token = new CampaignToken(
            _projectTokenTicker,
            _projectTokenTicker
        );

        Campaign storage newCampaign = campaigns[campaignIdCounter];
        newCampaign.projectName = _projectName;
        newCampaign.projectDescription = _projectDescription;
        newCampaign.projectTag = _projectTag;
        newCampaign.projectTokenTicker = _projectTokenTicker;
        // newCampaign.logoUrl = _logoUrl;
        newCampaign.socialLinks = _socialLinks;
        newCampaign.websiteLinks = _websiteLinks;
        newCampaign.totalAmountToRaise = _totalAmountToRaise;
        newCampaign.timePeriod = _timePeriod;
        // newCampaign.stagesCount = _stagesCount;
        newCampaign.stageAmounts = _stageAmounts;
        newCampaign.prompts = _prompts;
        newCampaign.owner = msg.sender;
        newCampaign.isActive = true;
        newCampaign.tokenAddress = address(token);

        // Add campaign ID to the owner's campaign list
        ownerCampaigns[msg.sender].push(campaignIdCounter);

        emit CampaignCreated(campaignIdCounter, msg.sender, address(token));

        return campaignIdCounter;
    }

    function investInCampaign(
        uint256 _campaignId,
        uint256 _amount
    ) public payable {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.isActive, "Campaign is not active");
        require(_amount > 0, "Investment must be greater than 0");
        require(
            msg.value == _amount,
            "Sent value does not match investment amount"
        );

        if (campaign.backers[msg.sender] == 0) {
            campaign.backerAddresses.push(msg.sender);
        }

        campaign.backers[msg.sender] += _amount;
        campaign.raisedAmount += _amount;

        require(
            campaign.raisedAmount <= campaign.totalAmountToRaise,
            "Investment exceeds total amount to raise"
        );

        emit InvestmentMade(_campaignId, msg.sender, _amount);
    }

    // Function to retrieve the next prompt for attestation
    function getNextPrompt(
        uint256 _campaignId
    ) public view returns (string memory) {
        Campaign storage campaign = campaigns[_campaignId];
        require(
            campaign.currentStage < campaign.stageAmounts.length,
            "No more stages to request"
        );

        return campaign.prompts[campaign.currentStage];
    }

    // Function to request the next stage of funds
    function requestNextStage(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(
            campaign.owner == msg.sender,
            "Only the owner can request next stage"
        );
        require(
            campaign.currentStage < campaign.stageAmounts.length,
            "No more stages to request"
        );

        uint256 stageAmount = campaign.stageAmounts[campaign.currentStage];
        require(
            campaign.raisedAmount >= stageAmount,
            "Insufficient funds raised for this stage"
        );

        // Mint ERC20 tokens to backers
        CampaignToken token = CampaignToken(campaign.tokenAddress);
        for (uint256 i = 0; i < campaign.backerAddresses.length; i++) {
            address backer = campaign.backerAddresses[i];
            uint256 amountInvested = campaign.backers[backer];
            uint256 tokenAmount = amountInvested; // 1 cUSD = 1 token
            token.mint(backer, tokenAmount);
        }

        campaign.currentStage++;
        withdrawFunds(_campaignId);
        emit StageCompleted(
            _campaignId,
            campaign.currentStage - 1,
            stageAmount
        );
    }

    // Function to withdraw funds by the campaign owner
    function withdrawFunds(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(
            msg.sender == campaign.owner,
            "Only the owner can withdraw funds"
        );
        // require(!campaign.isActive, "Campaign is still active");

        // Transfer funds to the owner
        uint256 amount = campaign.raisedAmount;
        campaign.raisedAmount = 0;
        payable(campaign.owner).transfer(amount);
    }
}
