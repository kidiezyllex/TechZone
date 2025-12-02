import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useUser } from "@/context/useUserContext";
import { motion } from "framer-motion";
import { useLogin } from "@/hooks/authentication";

interface AdminLoginFormValues {
    email: string;
    password: string;
}

const AdminLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const signInMutation = useLogin();
    const { loginUser } = useUser();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<AdminLoginFormValues>({
        email: "",
        password: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await signInMutation.mutateAsync(formData);

            if (
                response &&
                response.success &&
                response.data?.token &&
                response.data?.account
            ) {
                const account = response.data.account;

                if (!account?.role || account.role.toLowerCase() !== "admin") {
                    toast.error("Tài khoản này không có quyền truy cập trang quản trị");
                    return;
                }

                loginUser(account, response.data.token);
                toast.success("Đăng nhập Admin thành công");
                navigate("/admin/statistics");
            }
        } catch (error: any) {
            toast.error("Đăng nhập Admin thất bại");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br bg-blue-200 dark:from-gray-900 dark:to-gray-800">
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute h-40 w-40 rounded-full bg-primary/60 -top-10 left-[15%] blur-3xl" />
                <div className="absolute h-52 w-52 rounded-full bg-secondary/60 top-32 right-[10%] blur-3xl" />
                <div className="absolute h-48 w-48 rounded-full bg-primary/50 -bottom-16 left-[30%] blur-3xl" />
            </div>

            <div className="w-full flex justify-center items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    <Card className="w-full shadow-lg bg-white backdrop-blur-md border border-white/40 dark:border-gray-700/60">
                        <CardHeader className="pb-4 flex flex-col items-center space-y-3 border-b border-gray-200">
                            <img
                                draggable="false"
                                src="/images/logo.png"
                                alt="logo"
                                width={100}
                                height={100}
                                className="w-auto mx-auto h-16 select-none cursor-pointer"
                                onClick={() => navigate("/")}
                            />
                            <div className="flex items-center justify-between w-full">
                                <CardTitle className="text-2xl font-bold text-maintext dark:text-white">
                                    Đăng nhập Admin
                                </CardTitle>
                                <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/40">
                                    Quản trị
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="text-maintext dark:text-gray-300 font-medium block mb-2">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="admin@techzone.vn"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="border-gray-300 dark:border-gray-700 focus-visible:ring-primary focus-visible:border-primary transition-all duration-300"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-maintext dark:text-gray-300 font-medium block mb-2">
                                        Mật khẩu
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Nhập mật khẩu Admin"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="border-gray-300 dark:border-gray-700 focus-visible:ring-primary focus-visible:border-primary transition-all duration-300 pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-maintext hover:text-maintext focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>Chỉ dành cho tài khoản quản trị viên.</span>
                                    <a
                                        href="/auth/login"
                                        className="text-primary hover:text-secondary transition-colors duration-300"
                                    >
                                        Về trang đăng nhập khách
                                    </a>
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 bg-primary hover:bg-secondary transition-all duration-300 text-base font-medium w-full py-3"
                                    disabled={signInMutation.isPending}
                                >
                                    {signInMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Đang đăng nhập...
                                        </>
                                    ) : (
                                        "Đăng nhập Admin"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminLoginPage;


