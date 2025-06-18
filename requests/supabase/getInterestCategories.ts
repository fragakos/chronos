import { createClient } from "@/utils/supabase/client";

interface InterestCategoryRow {
  name: string;
}

export const getInterestCategories = async (): Promise<string[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("interest_categories")
    .select("name");

  if (error) {
    throw new Error(error.message);
  }

  // Type assertion for safety
  return (data as InterestCategoryRow[])
    ? (data as InterestCategoryRow[]).map((row) => row.name)
    : [];
};
