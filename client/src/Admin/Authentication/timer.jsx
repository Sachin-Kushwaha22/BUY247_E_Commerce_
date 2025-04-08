import { useState, useEffect } from "react";

export default function Timer({ btnStart, onExpire }) {
    const OTP_DURATION = 5*60; // in seconds
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        let timer;

        if (btnStart) {
            // Set start time only if not already set
            if (!sessionStorage.getItem("otpStartTime")) {
                sessionStorage.setItem("otpStartTime", Date.now().toString());
            }

            const startTime = parseInt(sessionStorage.getItem("otpStartTime") || "0", 10);

            const updateTimer = () => {
                const now = Date.now();
                const elapsed = Math.floor((now - startTime) / 1000);
                const remaining = OTP_DURATION - elapsed;

                if (remaining <= 0) {
                    clearInterval(timer);
                    // sessionStorage.removeItem("otpStartTime");
                    setTimeLeft(0);
                    onExpire?.(); // optional chaining in case not passed
                } else {
                    setTimeLeft(remaining);
                }
            };

            updateTimer(); // initial call
            timer = setInterval(updateTimer, 1000);
        } else {
            // If btnStart is false, reset everything
            setTimeLeft(0);
            // sessionStorage.removeItem("otpStartTime");
        }

        return () => clearInterval(timer);
    }, [btnStart]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return <span>{btnStart && timeLeft > 0 ? formatTime(timeLeft) : "00:00"}</span>;
}
