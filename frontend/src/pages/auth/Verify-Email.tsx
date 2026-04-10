import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link");
            return;
        }

        verifyEmail(token);
    }, []);

    const verifyEmail = async (token: string) => {
        try {
            const res = await axios.post(`http://localhost:5000/api/auth/verify-email/${token}`);

            setStatus("success");
            setMessage(res.data.message || "Email verified successfully!");

            // redirect after 2 sec
            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (err: any) {
            setStatus("error");
            setMessage(
                err?.response?.data?.message || "Verification failed"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-amber-100 p-8 rounded-lg shadow-md max-w-md w-full place-content-center">
                <h2 className="text-2xl font-bold mb-6 text-center">Verify Your Email</h2>
                <div>
                    {status === "loading" && (
                        <>
                            <h2 className="text-xl font-semibold">{message}</h2>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <h2 className="text-xl font-semibold">{message}</h2>
                            <p className="text-gray-500 mt-2">
                                Redirecting to login...
                            </p>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <h2 className="text-xl font-semibold">{message}</h2>
                            <Link to="/login" className="text-orange-500 hover:underline font-medium">Go to Login</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}