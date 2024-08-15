import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import AuthForm from "../layout/auth-form";
import { siteConfig } from "~/config/site";

const SignUpPromotion = async () => {
  return (
    <Card className="bg-accent p-5">
      <CardHeader className="pb-0 text-center">
        <CardTitle className="text-lg">{siteConfig().shortName}</CardTitle>
        <CardDescription>{siteConfig().description}</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm />
      </CardContent>
    </Card>
  );
};

export default SignUpPromotion;
