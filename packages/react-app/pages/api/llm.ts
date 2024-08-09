import type { NextApiRequest, NextApiResponse } from 'next'
import { getRespFromLLM } from "../../services/llm";


type Data = {
    results: string
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    // Process a POST request
    const { prompt } = await req.body;

    console.log('##### prompt:' + prompt);

    const { result } = await getRespFromLLM(prompt);

    console.log(result);

    res.status(200).json({ results: result })
  } else {
    // Handle any other HTTP method
    res.status(200).json({ results: 'HTTP method not handled' })
  }
}
