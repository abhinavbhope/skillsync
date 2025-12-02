'use server';

/**
 * @fileOverview Analyzes user-provided skills using AI to verify and structure them.
 *
 * - analyzeSkills - A function that handles the skill analysis process.
 * - AnalyzeSkillsInput - The input type for the analyzeSkills function.
 * - AnalyzeSkillsOutput - The return type for the analyzeSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSkillsInputSchema = z.object({
  skills: z.string().describe('A comma-separated list of skills provided by the user.'),
});
export type AnalyzeSkillsInput = z.infer<typeof AnalyzeSkillsInputSchema>;

const AnalyzeSkillsOutputSchema = z.object({
  verifiedSkills: z
    .array(z.string())
    .describe('A list of skills verified and structured by the AI.'),
  skillGraphData: z
    .string()
    .describe(
      'A JSON string representing the skill graph data, with nodes and edges for visualization.'
    ),
});
export type AnalyzeSkillsOutput = z.infer<typeof AnalyzeSkillsOutputSchema>;

export async function analyzeSkills(input: AnalyzeSkillsInput): Promise<AnalyzeSkillsOutput> {
  return analyzeSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSkillsPrompt',
  input: {schema: AnalyzeSkillsInputSchema},
  output: {schema: AnalyzeSkillsOutputSchema},
  prompt: `You are an AI skill verification and structuring expert.

  Your task is to analyze the skills provided by the user, verify their relevance, and structure them into a JSON skill graph.

  Skills: {{{skills}}}

  Respond with the verified skills as a list of strings and a JSON string representing the skill graph data with nodes and edges, suitable for a force-directed graph visualization.

  Ensure that the JSON string is properly formatted and valid.

  Example Output Format:
  {
    "verifiedSkills": ["JavaScript", "React", "Node.js"],
    "skillGraphData": '{
      "nodes": [
        {"id": "JavaScript", "label": "JavaScript"},
        {"id": "React", "label": "React"},
        {"id": "Node.js", "label": "Node.js"}
      ],
      "edges": [
        {"source": "React", "target": "JavaScript", "relation": "uses"},
        {"source": "Node.js", "target": "JavaScript", "relation": "uses"}
      ]
    }'
  }`,
});

const analyzeSkillsFlow = ai.defineFlow(
  {
    name: 'analyzeSkillsFlow',
    inputSchema: AnalyzeSkillsInputSchema,
    outputSchema: AnalyzeSkillsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
