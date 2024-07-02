import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import AuthForm from "../layout/auth-form";

const SignUpPromotion = async () => {
  return (
    <Card className="bg-accent p-5">
      <CardHeader className="pb-0 text-center">
        <CardTitle className="text-lg">
          Become a problem solver or publish your issue
        </CardTitle>
        <CardDescription>
          Encouraging individuals to either take on the role of solving existing
          problems or to share their own issues for others to address, fostering
          a collaborative and supportive environment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm />
      </CardContent>
    </Card>
  );
};

export default SignUpPromotion;
