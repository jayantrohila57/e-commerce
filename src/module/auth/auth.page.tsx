import { KeyRound, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

const sections = [
  {
    title: "Sign In",
    description: "Access your account and pick up where you left off.",
    icon: <LogIn className="text-primary h-6 w-6" />,
    href: PATH.AUTH.SIGN_IN,
    action: "Enter",
  },
  {
    title: "Sign Up",
    description: "Join the movement. Create your space in our system.",
    icon: <UserPlus className="text-primary h-6 w-6" />,
    href: PATH.AUTH.SIGN_UP,
    action: "Join",
  },
  {
    title: "Forgot Password",
    description: "Lost your keys? No stress. We’ll send you new ones.",
    icon: <KeyRound className="text-primary h-6 w-6" />,
    href: PATH.AUTH.FORGOT_PASSWORD,
    action: "Recover",
  },
];
export const AuthPageComponent = () => {
  return (
    <div className="grid w-full grid-cols-1 gap-4">
      {sections.map((section) => (
        <Link key={section.title} href={section.href}>
          <Card className="shadow-none hover:shadow">
            <CardHeader className="py-0">
              <CardTitle>{section.title}</CardTitle>
              <CardDescription className="max-w-60">{section.description}</CardDescription>
              <CardAction> {section.icon}</CardAction>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
};
