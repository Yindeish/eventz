import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const useDay = () => {

    function formatTime(date: string | Date) {
        return dayjs(date).fromNow(true);
    }

    return {formatTime}
}

export default useDay;