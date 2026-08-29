import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/auth.service";


const Login = () => {

    const navigate = useNavigate();


    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setLoading(true);


        try {

            const response =
                await loginUser({
                    email,
                    password
                });


            const token =
                response.data.token;

            const user =
                response.data.user;


            localStorage.setItem(
                "token",
                token
            );


            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            navigate("/");


        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page">

            <div className="login-card">

                <div className="login-header">

                    <h1>SafeReach</h1>

                    <p>
                        Sign in to manage your journeys safely.
                    </p>

                </div>


                {error && (

                    <div className="error-message">

                        {error}

                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in..."
                            : "Sign In"
                        }

                    </button>

                </form>

            </div>

        </div>

    );
};


export default Login;