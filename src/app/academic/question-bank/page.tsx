import { Suspense } from "react";
import QuestionBank from "@/core/widgets/academic/QuestionBank";

export default function QuestionBankPage() {
  return (
    <Suspense>
      <QuestionBank />
    </Suspense>
  );
}
