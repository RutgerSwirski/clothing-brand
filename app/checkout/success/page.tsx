import { Suspense } from "react";
import SuccessCheckoutPage from "./SuccessCheckoutPage";

export default function SuccessPageWrapper() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SuccessCheckoutPage />
    </Suspense>
  );
}
