import { Locale } from "@/i18n-config";
import { MultiStepLoader as Loader } from "../ui/multi-step-loader";
import {
  generatingFactStatesEl,
  generatingFactStatesEn,
} from "./utils/loadingStates";
import ReactMarkdown from "react-markdown";

type RandomFactContentProps = {
  loading: boolean;
  regenerating: boolean;
  error: string | null;
  fact: string | null;
  currentLang: Locale;
};

export const RandomFactContent = ({
  loading,
  regenerating,
  error,
  fact,
  currentLang,
}: RandomFactContentProps) => {
  if (loading || regenerating) {
    return (
      <Loader
        loadingStates={
          currentLang === "el" ? generatingFactStatesEl : generatingFactStatesEn
        }
        loading={loading}
      />
    );
  }

  if (error) {
    return <div className="bg-red-50 p-4 rounded-lg text-red-700">{error}</div>;
  }

  if (fact) {
    return (
      <div className="text-lg leading-relaxed text-left p-4 bg-[#E7CCB1]/10 rounded-lg m-3">
        <ReactMarkdown>{fact}</ReactMarkdown>
      </div>
    );
  }

  return null;
};
