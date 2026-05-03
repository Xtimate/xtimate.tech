import { json } from "@sveltejs/kit";

const PASSWORD = "Peren_123";

export async function POST({ request, cookies }) {
  const { password } = await request.json();
  if (password === PASSWORD) {
    cookies.set("admin_auth", PASSWORD, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    });
    return json({ success: true });
  }

  return json({ success: false }, { status: 401 });
}
