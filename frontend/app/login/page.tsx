import AppBar from "@/components/AppBar";
import AuthForm from "@/components/signupCompnents/AuthForm";
import LoginCard from "@/components/signupCompnents/LoginCard";

export default function LoginPage() {
  return (
    <div>
      <AppBar />
      <div className="flex w-9/12 mx-auto items-center gap-20 justify-center pt-30">
        <LoginCard />
        <AuthForm type="login" />
      </div>
    </div>
  );
}
