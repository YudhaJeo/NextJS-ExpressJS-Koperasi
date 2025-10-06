'use client';
import React, { useContext, useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import Cookies from 'js-cookie';
import axios from '../../../utils/axios';
import { useRouter } from "next/navigation";

const URL = process.env.NEXT_PUBLIC_URL;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const layout = useContext(LayoutContext);
  const layoutConfig = layout?.layoutConfig ?? { inputStyle: "" };

  const toast = useRef(null);
  const router = useRouter();

  const containerClassName = classNames(
    "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
    { "p-input-filled": layoutConfig.inputStyle === "filled" }
  );

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        toast.current.show({
          severity: "warn",
          summary: "Peringatan",
          detail: "Email dan password harus diisi",
          life: 3000,
        });
        return;
      }

      const res = await axios.post(`${URL}/login`, { email, password });

    Cookies.set('accessToken', res.data.accessToken);
    Cookies.set('name', res.data.name);
    Cookies.set('role_name', res.data.role_name, { expires: 1 });
    Cookies.set('email', res.data.email, { expires: 1 });
    Cookies.set('id', res.data.id, { expires: 1 });
    
    router.push("/");

    } catch (err) {
    console.error("Login error:", err);
    const errorMessage =
        err.response?.data?.error || "Terjadi kesalahan saat login";
    toast.current.show({
        severity: "error",
        summary: "Login Gagal",
        detail: errorMessage,
        life: 3000,
    });
    }
};


  return (
        <div className={containerClassName}>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <div
                    className="w-full surface-card py-7 px-6 sm:px-8 border-round-3xl shadow-2 max-w-20rem sm:max-w-25rem"
                >
                    <div className="text-center mb-6">
                        <img
                            src={'/layout/marstech-logo.png'}
                            alt="Logo"
                            height="45"
                            className="mb-4"
                        />
                        <div className="text-900 text-2xl font-semibold mb-2">
                            Welcome Back
                        </div>
                        <span className="text-600 text-sm">
                            Enter your credentials to continue
                        </span>
                    </div>

                    <div className="flex flex-column gap-4">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="email1" className="text-900 font-medium text-sm">
                                Email
                            </label>
                            <InputText
                                id="email1"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="flex flex-column gap-2">
                            <label htmlFor="password1" className="text-900 font-medium text-sm">
                                Password
                            </label>
                            <Password
                                inputId="password1"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                feedback={false}
                                placeholder="Enter your password"
                                className="w-full p-input-icon-right"  
                                inputClassName="w-full p-3"
                            />
                        </div>

                        <Button
                            label="Sign In"
                            className="w-full mt-2 p-3"
                            onClick={handleLogin}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;