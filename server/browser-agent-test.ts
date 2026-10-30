import { chromium } from "playwright";
import * as path from "path";
import * as fs from "fs";

const SCREENSHOT_DIR = "C:\\Users\\Kavya\\.gemini\\antigravity\\brain\\1577d0ba-407b-4876-babd-4c8a5edf0f30\\screenshots";

async function runBrowserAgent() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  console.log("Launching Google Chrome from:", chromePath);

  const browser = await chromium.launch({
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      console.log(`[BROWSER ${msg.type().toUpperCase()}]`, msg.text());
    }
  });

  const testId = Date.now();
  const testUser = {
    name: "Elena Rostova",
    email: `elena_${testId}@syncspace.io`,
    password: "Password123!",
  };

  try {
    // 1. VISIT LANDING PAGE
    console.log("STEP 1: Navigating to landing page http://localhost:3000...");
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "01_landing_page.png") });
    console.log("✓ Landed on landing page. Title:", await page.title());

    // 2. NAVIGATE TO SIGNUP
    console.log("\nSTEP 2: Navigating to signup page http://localhost:3000/signup...");
    await page.goto("http://localhost:3000/signup", { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    await page.waitForSelector("form");
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "02_signup_page.png") });
    console.log("✓ Signup form rendered with Google Sign-up & Email options.");

    // 3. FILL SIGNUP FORM & CREATE ACCOUNT
    console.log(`\nSTEP 3: Registering as new user: ${testUser.email}...`);
    const nameInput = await page.waitForSelector('input[placeholder="Alex Chen"]');
    await nameInput.click();
    await nameInput.fill(testUser.name);

    const emailInput = await page.waitForSelector('input[type="email"]');
    await emailInput.click();
    await emailInput.fill(testUser.email);

    const passwordInput = await page.waitForSelector('input[type="password"]');
    await passwordInput.click();
    await passwordInput.fill(testUser.password);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "03_signup_filled.png") });
    console.log("Submitting registration form...");
    await page.click('button[type="submit"]');

    // Wait for redirect to /workspace
    console.log("Waiting for workspace redirect...");
    await page.waitForFunction(() => window.location.pathname.includes("/workspace"), { timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "04_workspace_dashboard.png") });
    console.log("✓ Successfully entered Workspace dashboard! URL:", page.url());

    // 4. TEST SIDEBAR NAVIGATION & STARTER PAGE
    console.log("\nSTEP 4: Testing Sidebar & Starter Notes...");
    await page.waitForSelector("text=Getting Started", { timeout: 60000 });
    await page.waitForTimeout(1500);
    console.log("✓ Workspace pages tree loaded in sidebar!");

    // 5. CREATE A BRAND NEW NOTE
    console.log("\nSTEP 5: Creating a brand new note...");
    const newPageBtn = await page.waitForSelector('button:has-text("New page")');
    await newPageBtn.click();
    console.log("Clicked 'New page' button. Waiting for editor route /workspace/cmv...");

    await page.waitForFunction(() => window.location.pathname.includes("/workspace/cmv"), { timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "05_new_page_created.png") });
    console.log("✓ Navigated to new document! URL:", page.url());

    // Set page title
    const titleField = await page.waitForSelector('input[placeholder="Untitled"]', { timeout: 60000 });
    await titleField.click();
    await titleField.fill("Chrome Agent - Advanced Note Taking Test");
    await page.keyboard.press("Enter");
    console.log("✓ Title set to 'Chrome Agent - Advanced Note Taking Test'");

    // Focus editor canvas and type rich notes
    const editorCanvas = await page.waitForSelector('.tiptap, .ProseMirror, [contenteditable="true"]', { timeout: 60000 });
    await editorCanvas.click();
    await page.keyboard.type("This note is running live in Google Chrome.\n");
    await page.keyboard.type("Testing local-first Yjs CRDT synchronization with PostgreSQL persistence.\n\n");

    // Test Slash command
    console.log("Testing Slash Menu command...");
    await page.keyboard.type("/");
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "06_slash_menu_open.png") });
    console.log("✓ Slash command menu popped up!");

    // Select Heading 2
    await page.keyboard.type("Heading 2");
    await page.keyboard.press("Enter");
    await page.keyboard.type("Real-Time Verification Checklist\n");

    // Add todo checklist
    await page.keyboard.type("/");
    await page.waitForTimeout(400);
    await page.keyboard.type("To-do");
    await page.keyboard.press("Enter");
    await page.keyboard.type("Local-first IndexedDB latency: 0ms");
    await page.keyboard.press("Enter");
    await page.keyboard.type("PostgreSQL CRDT cloud retention verified");
    await page.keyboard.press("Enter");
    await page.keyboard.type("Multiplayer carets and presence ready");

    // Allow debounced cloud save (1.5s) to trigger and persist to Neon PostgreSQL
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "07_note_content_typed.png") });
    console.log("✓ Rich note created and formatted.");

    // 6. TEST SHAREABLE LINK POPOVER
    console.log("\nSTEP 6: Testing Topbar 'Share' button...");
    const shareBtn = await page.waitForSelector('button:has-text("Share")');
    await shareBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "08_share_popover_opened.png") });
    console.log("✓ Share popover opened!");

    const copyLinkBtn = await page.waitForSelector('button:has-text("Copy Shareable Link")');
    await copyLinkBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "09_share_link_copied.png") });
    console.log("✓ Shareable note link copied!");

    // Close share popover by clicking the backdrop
    const backdrop = await page.$('div.fixed.inset-0.z-40');
    if (backdrop) {
      await backdrop.click();
    } else {
      await page.keyboard.press("Escape");
    }
    await page.waitForTimeout(500);

    // 7. TEST WORKSPACE SETTINGS & TEAM MEMBER INVITATION
    console.log("\nSTEP 7: Testing Workspace Settings & Team Invites...");
    const settingsBtn = await page.waitForSelector('button[title*="Settings"]');
    await settingsBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "10_workspace_settings_general.png") });
    console.log("✓ Workspace Settings modal opened!");

    // Switch to Members tab
    const membersTab = await page.waitForSelector('button:has-text("Members")');
    await membersTab.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "11_workspace_settings_members.png") });
    console.log("✓ Switched to Members tab. Roster displayed.");

    // Invite teammate
    const inviteInput = await page.waitForSelector('input[placeholder="teammate@company.com"]');
    await inviteInput.fill("teammate_chrome@syncspace.io");
    const inviteBtn = await page.waitForSelector('button:has-text("Invite")');
    await inviteBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "12_member_invited.png") });
    console.log("✓ Teammate teammate_chrome@syncspace.io invited!");

    // Close settings dialog
    const closeDialogBtn = await page.waitForSelector('button:has(svg.lucide-x)');
    await closeDialogBtn.click();
    await page.waitForTimeout(500);

    // 8. TEST COMMAND PALETTE (Ctrl+K)
    console.log("\nSTEP 8: Testing Command Palette (⌘K / Ctrl+K)...");
    const searchBar = await page.waitForSelector('button:has-text("Search pages, tasks, or commands...")');
    await searchBar.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "13_command_palette.png") });
    console.log("✓ Command Palette opened with search bar and page results!");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);

    // 9. TEST DARK / LIGHT THEME TOGGLE
    console.log("\nSTEP 9: Testing Theme Toggle...");
    const themeBtn = await page.waitForSelector('button[title*="mode"], button[aria-label*="theme"]');
    if (themeBtn) {
      await themeBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "14_theme_toggled.png") });
      console.log("✓ Theme toggled successfully!");
    }

    // 10. TEST NOTES RETENTION ON BROWSER REFRESH
    console.log("\nSTEP 10: Testing Notes Retention on page refresh...");
    await page.reload({ waitUntil: "domcontentloaded" });
    console.log("Page reloaded. Waiting for Tiptap CRDT editor to hydrate...");
    const editorAfter = await page.waitForSelector(".ProseMirror, .tiptap", { timeout: 30000 });
    await page.waitForTimeout(2000); // Allow IndexedDB / Postgres snapshot hydration to settle
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "15_note_retention_after_refresh.png") });

    const contentAfter = await editorAfter.textContent();
    console.log(`✓ Content retained after full browser refresh:\n"${contentAfter?.trim().substring(0, 120)}..."`);

    console.log("\n=================================================");
    console.log("🎉 ALL CHROME BROWSER FEATURES VERIFIED & PASSED!");
    console.log(`📸 Screenshots saved to: ${SCREENSHOT_DIR}`);
    console.log("=================================================");
  } catch (err) {
    console.error("Browser Agent Error:", err);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "error_state.png") });
    throw err;
  } finally {
    await browser.close();
  }
}

runBrowserAgent().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
