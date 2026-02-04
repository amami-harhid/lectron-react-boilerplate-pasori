import { useState } from "react";
type View = {
  pageTitle: string,
}
const initView: View = {
  pageTitle: '入退室チェッカー',
} as const;

export const HomePage = () =>  {
    const [view] = useState(initView);
    return (
        <>
            <h1 className="pageTitle"><span>{view.pageTitle}</span></h1>
        </>
    );
}
