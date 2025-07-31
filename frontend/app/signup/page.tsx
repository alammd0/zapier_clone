import AppBar from "@/components/AppBar";
import AuthForm from "@/components/signupCompnents/AuthForm";
import Signup from "@/components/signupCompnents/Signup";

export default function SignupPage() {
  return (
    <div>
      <AppBar />

      <div className="flex w-9/12 mx-auto items-center gap-20 justify-center pt-30">
        <Signup />
        <AuthForm type="signup" />
      </div>
    </div>
  );
}
