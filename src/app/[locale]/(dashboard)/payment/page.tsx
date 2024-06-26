import Connection from "./connect";
import { checkConnect } from "./action";
import DisConnection from "./disconnect";

const PaymentPage = async () => {
  const isConnect = await checkConnect();
  return <div>{!isConnect ? <Connection /> : <DisConnection />}</div>;
};

export default PaymentPage;
