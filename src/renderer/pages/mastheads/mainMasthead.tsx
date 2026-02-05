import { useState } from "react";
export const Masterhead = () => {
    const [pageTitle] = useState<string>('入退室チェッカー');
    return (
          <>
            <h1 className="pageTitle"><span>{pageTitle}</span></h1>
          </>
        );
}