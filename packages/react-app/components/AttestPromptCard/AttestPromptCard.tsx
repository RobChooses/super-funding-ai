"use client";
import React, { useState } from "react";
import { Label } from "../Ui/label";
import { Input } from "../Ui/input";
import { cn } from "@/lib/utils";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { AttestationShareablePackageObject, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import tw from "tailwind-styled-components";
import { Spinner } from "../assets/Spinner";
import Link from "next/link";

type Validity = "true" | "false" | "misleading" | "invalid" | "unsure";

const Container = tw.div`
  min-h-screen 
  w-full 
  relative 
  overflow-hidden
`;

const TextArea = tw.textarea`
  w-full 
  bg-gray-700 
  rounded-lg 
  p-4 
  mb-4 
  text-white 
  focus:ring-2 
  focus:ring-indigo-500 
  focus:outline-none 
  transition-all 
  duration-300 
  ease-in-out
`;

const PromptDisplay = tw.div`
  mb-6 
  p-4 
  bg-gray-700 
  rounded-lg 
  text-white
`;

const PromptTitle = tw.h3`
  font-bold 
  mb-2 
  text-xl 
  text-indigo-300
`;

const PromptText = tw.p`
  text-gray-300
`;

const ResultWrapper = tw.div`
  mt-6 
  p-6 
  bg-gray-700 
  rounded-lg 
  text-white
`;

const ResultTitle = tw.h3`
  font-bold 
  mb-4 
  text-xl 
  text-indigo-300
`;

const ResultValidity = tw.p`
  font-semibold 
  text-2xl 
  mb-4 
  capitalize
`;

const ResultCritique = tw.p`
  text-gray-300 
  leading-relaxed
`;

const ResultAttestationUID = tw.p`
  text-blue-300 
`;

const ResultTxHash = tw.a`
  text-blue-300
  underline
`;


const Button = tw.button<{ $isPublish?: boolean }>`
  flex-1 
  ${p => (p.$isPublish ? "bg-green-500 hover:bg-green-600" : "bg-indigo-500 hover:bg-indigo-600")}
  text-white 
  font-bold 
  py-3 
  px-6 
  rounded-lg 
  transition-colors 
  duration-300 
  ease-in-out 
  transform 
  hover:scale-105 
  focus:outline-none 
  focus:ring-2 
  ${p => (p.$isPublish ? "focus:ring-green-500" : "focus:ring-indigo-500")}
  focus:ring-opacity-50
`;


export function AttestPromptCard() {
  const [ prompt, setPrompt ] = useState("");
  const [ result, setResult ] = useState<{ critique: string; validity: string, attestationUID: string, txHash: string} | null>(null);
  const [ isLoading, setIsLoading ] = useState(false);

  const handleSubmit = async (e: React.MouseEvent) => {
    if (result) {
      setResult(null);
      setPrompt("");
      return;
    }

    e.preventDefault();
    setIsLoading(true);
    setResult(null)

    try {
      const response = await fetch("/api/llm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setResult({
        validity: data.validity as string,
        critique: data.critique as string,
        attestationUID:  data.attestationUID as string,
        txHash: data.txHash as string
      });
    
    } catch (error) {
      console.error("Error:", error);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };


   
  return (
    <Container>
      <div className="space-y-4">
        {!result ? (
          <TextArea
            rows={4}
            placeholder="This is the prompt that's saved when you created."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
        ) : (
          <PromptDisplay>
            <PromptTitle>Your prompt:</PromptTitle>
            <PromptText>{prompt}</PromptText>
          </PromptDisplay>
        )}
      </div>
      {result && (
        <ResultWrapper>
          <ResultTitle>AI attests this prompt condition to be:</ResultTitle>
          <ResultValidity>{result.validity}</ResultValidity>
          <ResultCritique>{result.critique}</ResultCritique>
          <ResultAttestationUID>{result.attestationUID}</ResultAttestationUID>

          <Link
            href={`https://optimism-sepolia.blockscout.com/tx/${result.txHash}`}
            target={"_blank"}
          >
          <ResultTxHash>{result.txHash}</ResultTxHash>

          </Link>
        </ResultWrapper>
      )}
      <Button disabled={isLoading} onClick={handleSubmit}>
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Spinner />
                  <span className={"ml-2"}>Verifying...</span>
                </span>
              ) : result ? (
                "Start Over"
              ) : (
                "Verify prompt"
              )}
            </Button>
    </Container>
  );
}
