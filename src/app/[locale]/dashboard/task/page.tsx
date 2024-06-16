"use server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import Wip from "~/components/Wip";
import Str from "~/components/Str";
import PRequests from "~/components/PRequests";
import Completed from "~/components/Completed";
import Failed from "~/components/Failed";
import { getCounts } from "./action";

async function TaskPage() {
  //   const [data, setData] = useState([]);
  //   const gest = useCallback(async () => {
  //     const resp = await fetch(`/api/v1/request/own`, { method: "GET" });
  //     const res = await resp.json();
  //     setData(res);
  //   }, []);
  //   useEffect(() => {
  //     gest();
  //   }, [gest]);
  //   console.log(data);
  const total = await getCounts();
  return (
    <Tabs defaultValue="wip">
      <TabsList>
        <TabsTrigger value="wip">Work in progress </TabsTrigger>
        <TabsTrigger value="requests">
          Pending requests
          <Badge className=" ml-2  bg-yellow-500">{total?.total_request}</Badge>
        </TabsTrigger>
        <TabsTrigger value="str">
          Submitted to review
          <Badge className=" ml-2 bg-purple-500">0</Badge>
        </TabsTrigger>

        <TabsTrigger value="completed">
          Completed
          <Badge className=" ml-2  bg-green-500">0</Badge>
        </TabsTrigger>
        <TabsTrigger value="failed">
          Failed
          <Badge className=" ml-2  bg-red-500">0</Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="wip">
        <Wip />
      </TabsContent>
      <TabsContent value="str">
        <Str />
      </TabsContent>
      <TabsContent value="requests">
        <PRequests />
      </TabsContent>
      <TabsContent value="completed">
        <Completed />
      </TabsContent>
      <TabsContent value="failed">
        <Failed />
      </TabsContent>
    </Tabs>
  );
}

export default TaskPage;
