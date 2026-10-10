import { SimpleHeader } from "@/components/sections/Simple";
import { Button } from "@/components/ui/Button";
export default function NotFound() {
  return (<><SimpleHeader title="Page not found" lead="That page doesn’t exist or has moved." /><div className="container-x py-16"><Button href="/">Back to home</Button></div></>);
}
