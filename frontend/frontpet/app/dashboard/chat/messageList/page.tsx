import { redirect } from "next/navigation";

export default function LegacyChatMessageListPage() {
  redirect("/owner/messages");
}
