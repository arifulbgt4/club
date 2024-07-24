import Connection from "./connect";
import { checkConnect } from "./action";
import DisConnection from "./disconnect";

export default async function PaymentPage() {
  const isConnect = await checkConnect();
  return <div>{!isConnect ? <Connection /> : <DisConnection />}</div>;
}
