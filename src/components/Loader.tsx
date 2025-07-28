import { CircularProgress } from "@mui/material";
import { FC } from "react";

export const Loader: FC = () => {
    return <div className="z-50 bg-zinc-100 dark:bg-zinc-800  flex items-center justify-center h-screen w-screen">
        <CircularProgress color="secondary" />
    </div>
}