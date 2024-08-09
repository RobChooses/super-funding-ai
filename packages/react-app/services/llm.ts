import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

type ModelResponseObject = {
  validity: string;
  critique: string;
};

export async function getRespFromLLM(prompt: string) {
  // Define the tools for the agent to use
  const agentTools = [new TavilySearchResults({ maxResults: 3 })];
  console.log('## step 2');

  const agentModel = new ChatOpenAI({ temperature: 0 });

  console.log('## step 3');

  // Initialize memory to persist state between graph runs
  const agentCheckpointer = new MemorySaver();
    const agent = createReactAgent({
    llm: agentModel,
    tools: agentTools,
    checkpointSaver: agentCheckpointer,
  });

  console.log('## step 4');

  const agentFinalState = await agent.invoke(
    { messages: [new HumanMessage(prompt)] },
    { configurable: { thread_id: "42" } },
  );

  console.log('## step 5');

  const result = agentFinalState.messages[agentFinalState.messages.length - 1].content;

  console.log(
    agentFinalState.messages[agentFinalState.messages.length - 1].content,
  );

//   const agentNextState = await agent.invoke(
//     { messages: [new HumanMessage("what about ny")] },
//     { configurable: { thread_id: "42" } },
//   );
  
//   console.log(
//     agentNextState.messages[agentNextState.messages.length - 1].content,
//   );

// //   const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//   });

//   const model = "gpt-4o";

//   const completion = await openai.chat.completions.create({
//     model: model,
//     messages: [
//       {
//         role: "system",
//         content:
//           "You are a truth bot. Your job is to take whatever input you are given and opine on how true it may or may not be. Your critique should be 1-4 sentences max. the JSON schema should be { validity: 'true'|'false'|'misleading|'invalid'|'unsure', critique: string }. If the input is not a statement, then return invalid.",
//       },
//       { role: "user", content: statement },
//     ],
//     max_tokens: 200,
//     response_format: {
//       type: "json_object",
//     },
//   });

//   const result = completion.choices[0].message.content;

  // const modelResponseObject: ModelResponseObject = JSON.parse(result!);
  // return { model, modelResponseObject };
  return { result }
}
