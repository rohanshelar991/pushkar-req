export type CandidateForm = {
  name: string;
  email: string;
  phone: string;
  education: string;
  skills: string;
  experience: string;
  city: string;
  linkedin: string;
  portfolio: string;
  notes: string;
};

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};
