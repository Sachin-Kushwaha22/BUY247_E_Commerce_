import { useState, useEffect } from "react";

export default function UserTimer({ userBtnStart, onExpire }) {
    const OTP_DURATION = 5*60; // in seconds
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        let timer;

        if (userBtnStart) {
            if (!sessionStorage.getItem("userOtpStartTime")) {
                sessionStorage.setItem("userOtpStartTime", Date.now().toString());
            }

            const startTime = parseInt(sessionStorage.getItem("userOtpStartTime") || "0", 10);

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
            // If userBtnStart is false, reset everything
            setTimeLeft(0);
            // sessionStorage.removeItem("otpStartTime");
        }

        return () => clearInterval(timer);
    }, [userBtnStart]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return <span>{userBtnStart && timeLeft > 0 ? formatTime(timeLeft) : "00:00"}</span>;
}
