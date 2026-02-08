import { Tt } from "./text";
import { Tv } from "./view";

const ErrorMsg = ({ msg, condition }: { msg: string, condition?: boolean }) => {
    return (
        <Tv className={`w-full flex-row items-center`}>
            {(condition) && (<Tt className={`text-[12px] text-red-500`}>{msg}</Tt>)}
        </Tv>
    );
}

export default ErrorMsg;