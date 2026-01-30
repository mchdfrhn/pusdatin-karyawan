const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Read .env file
const envPath = path.resolve(__dirname, "../.env");
const envContent = fs.readFileSync(envPath, "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const [key, value] = line.split("=");
  if (key && value) {
    env[key.trim()] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const viewName = env.NEXT_PUBLIC_VIEW_PEGAWAI_LENGKAP || "v_pegawai_lengkap";

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkView() {
  console.log(`Checking view: ${viewName}`);
  const { data, error } = await supabase.from(viewName).select("*").limit(1);

  if (error) {
    console.error("Error fetching data:", error);
    return;
  }

  if (data && data.length > 0) {
    console.log("Columns found:", Object.keys(data[0]));
    console.log("Sample Row:", data[0]);
  } else {
    console.log("No data found in view (or view is empty).");
  }
}

checkView();
