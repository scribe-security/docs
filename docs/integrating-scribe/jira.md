# Integrate Scribe Hub with Jira

Use this guide to connect your Jira project to Scribe Hub, allowing you to open issues directly from the Vulnerability Details dialog.

---

## Prerequisites

- **Jira Project Administrator** access to the target project
- Project type: **Company‑managed** (Classic)  
  To verify, run:
  ```bash
  GET https://<your-domain>/rest/api/latest/project
  ```
  Confirm that `"style":"Classic"` appears in the project entry.

---

## 1. Create an Issue Collector in Jira

1. Go to **Project settings → Issue Collectors** and click **Add Issue Collector**.  
   - If the tab is missing, open:
     ```
     https://<your-domain>/secure/AddCollector!default.jspa?projectKey=<PROJECT_KEY>
     ```
2. Configure the collector:
   - **Name:** `Scribe Integration`
   - **Issue type:** `Bug`
   - **Reporter:** e.g., `automation@somedomain.com`
   - **Options:**
     - ✓ Attempt to match submitter email address
     - ☐ Collect browser info
   - **Trigger text:** Custom (e.g., "Raise a bug")
3. Click **Submit**.
4. On the confirmation page, note the **Collector ID** from the URL or the embedded JavaScript snippet (e.g., `f5779bb6`).

---

## 2. Configure Scribe Hub

1. In Scribe Hub, navigate to **Integrations → Jira** and click **Connect**.
2. Enter the following:
   - **Jira domain:** `<your_company>.atlassian.com` (or local FQDN)
   - **Collector ID:** the value from step 1 (e.g., `f5779bb6`)
   - **Reporter email:** `automation@somedomain.com`
3. Click **Test**.
   - A dialog should open with sample title and description.
4. If the test succeeds, click **Add**.  
   The integration status will turn **Connected**.

---

## 3. Open Jira Issues from Scribe Hub

Once connected, you can click **Create Jira Issue** in any Vulnerability Details dialog. A form will appear to raise a new ticket in your configured project.

---

*For more help, contact your Jira administrator or Scribe support.*
