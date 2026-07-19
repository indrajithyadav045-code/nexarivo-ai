import { create } from 'zustand';
type WorkspaceState={model:string;agent:string;setModel:(model:string)=>void;setAgent:(agent:string)=>void};
export const useWorkspaceStore=create<WorkspaceState>((set)=>({model:'gpt-4.1',agent:'Research Agent',setModel:(model)=>set({model}),setAgent:(agent)=>set({agent})}));
