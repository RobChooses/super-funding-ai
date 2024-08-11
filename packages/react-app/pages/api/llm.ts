import type { NextApiRequest, NextApiResponse } from 'next'
import { getRespFromLLM } from "../../services/llm";

import { ethers } from "ethers";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

type Data = {
    validity: string,
    critique: string,
    attestationUID: string,
    txHash: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Process a POST request
    const { prompt } = await req.body;

    console.log('##### prompt:' + prompt);

    const { model, modelResponseObject } = await getRespFromLLM(prompt);

    console.log(modelResponseObject);

    const easContractAddress = "0x4200000000000000000000000000000000000021";                // OP-Sepolia
    const schemaUID = "0x200e2ef14debf63e2e36e1660b154efdb3eaf3a06b8f15b8970eabcd5b61ecc2"; // Schema on OP-Sepolia

    const provider = new ethers.AlchemyProvider("optimism-sepolia", process.env.NEXT_PUBLIC_ALCHEMY_API_KEY);  
    const signer = new ethers.Wallet(process.env.ETH_KEY as string, provider);              // Platform wallet, used to register schema
    const eas = new EAS(easContractAddress);

    // Signer must be an ethers-like signer.
    await eas.connect(signer);

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder("string conditionToVerify,string lmmModel,string validity,string critique");
    const encodedData = schemaEncoder.encodeData([
      { name: "conditionToVerify", value: prompt, type: "string" },
      { name: "lmmModel", value: model, type: "string" },
      { name: "validity", value: modelResponseObject.validity, type: "string" },
      { name: "critique", value: modelResponseObject.critique, type: "string" }
    ]);

    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: "0x0000000000000000000000000000000000000000",
        expirationTime: 0n,
        revocable: false, // Be aware that if your schema is not revocable, this MUST be false
        data: encodedData,
      },
    });
  
    const newAttestationUID = await tx.wait();
    console.log("New attestation UID:", newAttestationUID);
    console.log("Transaction receipt:", tx.receipt);

    res.status(200).json({ 
      "validity": modelResponseObject.validity,
      "critique": modelResponseObject.critique,
      "attestationUID": newAttestationUID,
      "txHash": tx.receipt?.hash
     })
  } else {
    // Handle any other HTTP method
    res.status(500).json({ error: "Unable to handle non HTTP method" });
  }
}
