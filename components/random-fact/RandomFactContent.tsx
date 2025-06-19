import { MultiStepLoader as Loader } from "../ui/multi-step-loader";
import { generatingFactStates } from "./utils/loadingStates";
import ReactMarkdown from "react-markdown";

type RandomFactContentProps = {
  loading: boolean;
  regenerating: boolean;
  error: string | null;
  fact: string | null;
};

export const RandomFactContent = ({
  loading,
  regenerating,
  error,
  fact,
}: RandomFactContentProps) => {
  if (loading || regenerating) {
    return <Loader loadingStates={generatingFactStates} loading={loading} />;
  }

  if (error) {
    return <div className="bg-red-50 p-4 rounded-lg text-red-700">{error}</div>;
  }

  if (fact) {
    return <ReactMarkdown>{fact}</ReactMarkdown>;
  }

  return null;
};
