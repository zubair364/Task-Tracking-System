import { getUserFromCookies } from "@/app/actions/auth-actions";
import { UserNav } from "@/components/user-nav";

export async function UserHeader() {
  const { user } = await getUserFromCookies();

  if (!user) {
    return null;
  }

  return <UserNav user={user} />;
}
