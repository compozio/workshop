# GeoLab — "The art of using AI"
## Commercial Offer Template Generator

A modern, high-end single-page web application designed for **GeoLab** to configure, preview, and generate print-ready commercial proposals for the educational program **"The art of using AI"**.

---

### 🎨 Design System & Aesthetic
* **Vibe:** Minimalist, editorial, light mode default with high-contrast typography and subtle borders (`slate-200`). Inspired by modern design agency tools (Stripe, Linear, Notion).
* **Layout:** Dual-column split screen on desktop:
  * **Left Side:** Form controls organized by metadata, client info, line items, and commercial terms.
  * **Right Side:** Real-time live preview rendering an authentic A4 proposal sheet with drop shadows and zoom controls.
* **Branding:** 
  * Features the official program logo from `./logo.png` in the proposal header.
  * Highlights the curated tagline: *"A curated educational program at the intersection of human creativity and artificial intelligence, designed for curious minds ready to shape the future."*
  * Displays GeoLab academy credentials, official verification badges, and authorization sign-off blocks.

---

### 🚀 Key Features

1. **Client & Project Information:**
   * Client Organization Name
   * Short Description of Client / Project Scope
   * Optional Attention Contact Person & Email

2. **Dynamic Line Items (Educational Modules):**
   * Module / Product Name
   * Product Number (SKU or ID)
   * Quantity (numeric)
   * Unit Price (with customizable currency: USD `$`, EUR `€`, GEL `₾`, GBP `£`)
   * Real-time Line Total calculation (`Qty × Unit Price`)
   * Actions: **Add Line Item**, **Duplicate Line**, and **Remove Line**
   * **Quick Presets:** Instant loading of pre-configured curriculum packages (e.g., Executive 4-Module Program, Accelerated 2-Day Sprint, Individual Masterclass Seat).

3. **Live Real-time Financial Calculations:**
   * Dynamic Subtotal
   * Optional Discount percentage calculation
   * Optional Tax / VAT rate calculation
   * Prominently highlighted **Total Offer Amount**

4. **Print / Save as PDF Engine:**
   * One-click "Print / Save as PDF" button (triggers native browser print).
   * Strict `@media print` rules:
     * Completely hides editor controls, navigation headers, buttons, and canvas toolbars.
     * Enforces single-page A4 dimensions without accidental spillover.
     * Preserves exact graphics and borders using `print-color-adjust: exact`.

5. **State Persistence & Polish:**
   * Changes automatically persist in `localStorage` so refreshing never loses work.
   * "Reset" button to restore official GeoLab sample data.
   * "Clear" button for blank-canvas proposals.
   * Interactive zoom controls (`75%`, `90%`, `100%`, `Fit`).
   * Mobile-responsive toggle between Editor and Live Preview.

---

### 💻 Quick Start

You can run the application directly by opening `index.html` in any modern web browser:

```bash
# Option 1: Open directly on macOS
open index.html

# Option 2: Run a lightweight local HTTP server
python3 -m http.server 8000
# Then visit http://localhost:8000 in your browser
```

---

### 🖨️ PDF Export Tips
When saving as PDF via your browser's Print dialog (`Cmd + P` or the **Print / Save as PDF** button):
1. **Destination:** Select "Save as PDF".
2. **Paper Size:** A4 (or Letter).
3. **Margins:** Default (or Minimum).
4. **Options:** Ensure **"Background graphics"** is checked to display the subtle card backgrounds and accent borders.
