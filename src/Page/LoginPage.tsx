import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams } from "react-router";
import { Loader2, Lock, Mail } from "lucide-react";
import { useAppDispatch } from "../store/hooks";
import { login } from "../store/authSlice";
import { useToast } from "../hook/useToast";
import { ApiError } from "../api/axiosInstance";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required").max(128),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (searchParams.get("sessionExpired") === "true") {
      showToast("Your session has expired. Please log in again.", "warning");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await dispatch(
        login({ email: values.email, password: values.password }),
      ).unwrap();
      navigate("/", { replace: true });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to log in. Please try again.";
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#2d1b5a] rounded-xl flex items-center justify-center text-white font-bold text-lg mb-3">
            S
          </div>
          <h1 className="text-lg font-bold text-slate-800">SimRecruiter</h1>
          <p className="text-xs text-gray-400">AI Screening Platform</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <h2 className="text-base font-bold text-slate-800 mb-1">Sign in</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your credentials to access your account.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition-colors"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
