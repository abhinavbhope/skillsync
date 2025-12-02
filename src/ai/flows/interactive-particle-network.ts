'use server';

/**
 * @fileOverview Simulates the Interactive Particle Network for Skill Matching.
 *
 * - generateParticleNetwork - A function that returns a description of the particle network.
 * - InteractiveParticleNetworkInput - The input type for the generateParticleNetwork function.
 * - InteractiveParticleNetworkOutput - The return type for the generateParticleNetwork function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InteractiveParticleNetworkInputSchema = z.object({
  jobSeekerSkills: z
    .array(z.string())
    .describe('List of skills possessed by the job seeker.'),
  companyNeeds: z.array(z.string()).describe('List of skills needed by the company.'),
});
export type InteractiveParticleNetworkInput = z.infer<
  typeof InteractiveParticleNetworkInputSchema
>;

const InteractiveParticleNetworkOutputSchema = z.object({
  description: z.string().describe('Description of the particle network animation.'),
});
export type InteractiveParticleNetworkOutput = z.infer<
  typeof InteractiveParticleNetworkOutputSchema
>;

export async function generateParticleNetwork(
  input: InteractiveParticleNetworkInput
): Promise<InteractiveParticleNetworkOutput> {
  return interactiveParticleNetworkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interactiveParticleNetworkPrompt',
  input: {schema: InteractiveParticleNetworkInputSchema},
  output: {schema: InteractiveParticleNetworkOutputSchema},
  prompt: `You are an expert in creating captivating 3D particle network animation descriptions.

  Given the following job seeker skills and company needs, create a description for a 3D particle network animation to visualize the skill matching.

  Job Seeker Skills: {{jobSeekerSkills}}
  Company Needs: {{companyNeeds}}

  The description should focus on:
    - Visual representation of job seekers and companies as node clusters.
    - Skill particles flowing between these clusters to form connections.
    - Highlighting successful skill matches with glowing effects.
    - The overall aesthetic should be Cyber Noir / Modern Dark Tech.
  `,
});

const interactiveParticleNetworkFlow = ai.defineFlow(
  {
    name: 'interactiveParticleNetworkFlow',
    inputSchema: InteractiveParticleNetworkInputSchema,
    outputSchema: InteractiveParticleNetworkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
