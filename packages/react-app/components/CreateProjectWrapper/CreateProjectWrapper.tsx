"use client";
import React, { useState } from "react";
import { Label } from "../Ui/label";
import { Input } from "../Ui/input";
import { cn } from "@/lib/utils";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import DatePicker, { DateObject } from "react-multi-date-picker";

export function CreateProjectWrapper() {
  const [values, setValues] = useState([
    new DateObject().subtract(4, "days"),
    new DateObject().add(4, "days"),
  ]);
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("Form submitted");
};
   
    return (
      
    <div className="max-w-[80%] w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black border-[1px] ">
      <h2 className="font-bold text-xl text-white dark:text-neutral-200">
        Create a Project
      </h2>
      <p className="text-white text-sm max-w-sm mt-2 dark:text-neutral-300">
        Enter details of your project
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer className="mb-4">
            <Label htmlFor="projectName" className=" text-white">Project Name</Label>
            <Input
              id="projectName"
              placeholder="Enter Project name"
              type="text"
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="projectLogo" className=" text-white">Project Logo</Label>
            <Input id="projectLogo" type="file" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="tokenSymbol" className=" text-white">Token Symbol</Label>
            <Input id="tokenSymbol" type="file" />
          </LabelInputContainer>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mb-4">
          <LabelInputContainer className=" flex-1">
            <Label htmlFor="category" className=" text-white">Category</Label>
            <Input id="category" placeholder="Enter Category" type="text" />
          </LabelInputContainer>
          <LabelInputContainer className="flex-1">
            <Label htmlFor="amount" className=" text-white">How much do you want to raise in cUSD? </Label>
            <Input id="amount" placeholder="Amount" type="number" />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="flex-1 mb-4">
          <Label htmlFor="description" className=" text-white">Description </Label>
          <Input id="description" placeholder="Description" type="textarea" />
        </LabelInputContainer>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mb-4">
          <LabelInputContainer className="flex-1">
            <Label htmlFor="date-range" className=" text-white">Timeline </Label>
            <DatePicker
              value={values}
              onChange={setValues}
              range
              className="bg-dark"
              inputClass="flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm  file:border-0 file:bg-transparent 
          file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
          focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
           disabled:cursor-not-allowed disabled:opacity-50
           dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
           group-hover/input:shadow-none transition duration-400"
            />
          </LabelInputContainer>
          <LabelInputContainer className=" flex-1">
            <Label htmlFor="url" className=" text-white">URL</Label>
            <Input id="url" placeholder="url" type="text" />
          </LabelInputContainer>
        </div>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Submit
          <BottomGradient />
        </button>
      </form>
      </div>
      
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
