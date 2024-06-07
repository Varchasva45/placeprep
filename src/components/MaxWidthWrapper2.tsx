import { ReactNode } from "react";
import { classNameMerge } from "../lib/tailwindMerge";

const MaxWidthWrapper2 = ({
    className,
    children
}: {
    className?: string, 
    children: ReactNode
}) => {
    return (
        <div className={classNameMerge('mx-auto w-full max-w-screen-2xl px-2.5 md:px-20', className)} >
            {children}
        </div>
    );
}

export default MaxWidthWrapper2;