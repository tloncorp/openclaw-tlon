/**
 * Debug script to find the correct scry path for DM history
 */

const testUserUrl = process.env.TEST_USER_URL || "http://localhost:80";
const testUserShip = process.env.TEST_USER_SHIP?.replace(/^~/, "") || "lagrev-ridsyp-nocsyx-lassul";
const testUserCode = process.env.TEST_USER_CODE || "";
const botShip = process.env.TLON_SHIP?.replace(/^~/, "") || "sidwyn-nimnev-nocsyx-lassul";

async function main() {
  console.log("Ship URL:", testUserUrl);
  console.log("Ship:", testUserShip);
  console.log("Bot ship:", botShip);

  // Authenticate
  const loginRes = await fetch(`${testUserUrl}/~/login`, {
    method: "POST",
    body: `password=${testUserCode}`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  
  const cookie = loginRes.headers.get("set-cookie")?.split(";")[0];
  if (!cookie) {
    console.log("Login failed!");
    return;
  }
  console.log("Authenticated!\n");

  // Chat app scry exploration
  const paths = [
    `/~/scry/chat/full.json`,
    `/~/scry/chat/briefs.json`,
    `/~/scry/chat/chats.json`,
    `/~/scry/chat/clubs.json`,
    `/~/scry/chat/whom.json`,
    `/~/scry/chat/writs.json`,
    
    // Try the dm format without json
    `/~/scry/chat/dm/~${botShip}/writs/newest/20`,
    
    // Activity app (might have DM activity)
    `/~/scry/activity/v4/all.json`,
    `/~/scry/activity/all.json`,
    
    // Channels DMs
    `/~/scry/channels/v1/init.json`,
    `/~/scry/channels/v2/init.json`,
    `/~/scry/channels/v4/init.json`,
  ];

  for (const path of paths) {
    try {
      console.log(`Trying: ${path}`);
      const res = await fetch(`${testUserUrl}${path}`, {
        headers: { Cookie: cookie },
      });
      
      if (res.ok) {
        const data = await res.json();
        const str = JSON.stringify(data, null, 2);
        console.log("✓ SUCCESS");
        // Show keys if it's an object
        if (typeof data === "object" && data !== null && !Array.isArray(data)) {
          console.log("  Keys:", Object.keys(data).slice(0, 10).join(", "));
        }
        if (str.length < 500) {
          console.log("  Data:", str);
        } else {
          console.log("  Data:", str.slice(0, 500) + "...\n");
        }
      } else {
        console.log(`✗ ${res.status}`);
      }
    } catch (err: any) {
      console.log(`✗ ERROR: ${err.message || err}`);
    }
  }
}

main().catch(console.error);
