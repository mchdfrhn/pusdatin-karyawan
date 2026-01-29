const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from .env",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const email = process.argv[2] || "admin@example.com";
const password = process.argv[3] || "password123";

async function createUser() {
  console.log(`Creating user: ${email}...`);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error("Error creating user:", error.message);
    return;
  }

  console.log("User created successfully!");
  console.log("User ID:", data.user.id);
  console.log("Email:", data.user.email);
  console.log("Password:", password);
}

createUser();
