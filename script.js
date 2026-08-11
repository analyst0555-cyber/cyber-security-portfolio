function checkPassword() {
    alert("JavaScript is working!");
}

async function analyzeDomain() {

    const input = document.getElementById("domainInput");
    const result = document.getElementById("domainResult");

    if (!input || !result) {
        return;
    }

    let domain = input.value.trim().toLowerCase();

    if (domain === "") {
        result.textContent = "Please enter a domain name.";
        return;
    }

    domain = domain.replace(/^https?:\/\//, "");
    domain = domain.split("/")[0];

    const domainPattern =
        /^(?!-)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$/;

    if (!domainPattern.test(domain)) {

        result.innerHTML =
            "<p>❌ Invalid domain format.</p>";

        return;
    }

    result.innerHTML =
        "<p>🔎 Looking up DNS information...</p>";

    try {

        const recordTypes = ["A", "AAAA", "MX", "NS", "CNAME"];

        const dnsResults = {};

        for (const type of recordTypes) {

            const response = await fetch(
                `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`
            );

            if (!response.ok) {
                throw new Error("DNS lookup failed");
            }

            const data = await response.json();

            dnsResults[type] = data.Answer || [];
        }


        let html = `

            <div class="card">

                <h3>🌍 Domain Information</h3>

                <p>
                    <strong>Domain:</strong>
                    ${domain}
                </p>

                <p>
                    <strong>Status:</strong>
                    ✅ Valid domain format
                </p>

        `;


        // A RECORDS

        html += `<h3>IPv4 (A) Records</h3>`;

        if (dnsResults.A.length > 0) {

            html += "<ul>";

            dnsResults.A.forEach(record => {

                html += `<li>${record.data}</li>`;

            });

            html += "</ul>";

        } else {

            html += "<p>No A records found.</p>";

        }


        // AAAA RECORDS

        html += `<h3>IPv6 (AAAA) Records</h3>`;

        if (dnsResults.AAAA.length > 0) {

            html += "<ul>";

            dnsResults.AAAA.forEach(record => {

                html += `<li>${record.data}</li>`;

            });

            html += "</ul>";

        } else {

            html += "<p>No AAAA records found.</p>";

        }


        // MX RECORDS

        html += `<h3>📧 Mail (MX) Records</h3>`;

        if (dnsResults.MX.length > 0) {

            html += "<ul>";

            dnsResults.MX.forEach(record => {

                html += `<li>${record.data}</li>`;

            });

            html += "</ul>";

        } else {

            html += "<p>No MX records found.</p>";

        }


        // NS RECORDS

        html += `<h3>🗄️ Nameservers (NS)</h3>`;

        if (dnsResults.NS.length > 0) {

            html += "<ul>";

            dnsResults.NS.forEach(record => {

                html += `<li>${record.data}</li>`;

            });

            html += "</ul>";

        } else {

            html += "<p>No NS records found.</p>";

        }


        // CNAME RECORDS

        html += `<h3>🔗 CNAME Records</h3>`;

        if (dnsResults.CNAME.length > 0) {

            html += "<ul>";

            dnsResults.CNAME.forEach(record => {

                html += `<li>${record.data}</li>`;

            });

            html += "</ul>";

        } else {

            html += "<p>No CNAME records found.</p>";

        }


        html += `

            <p>
                <small>
                    DNS information retrieved using
                    DNS-over-HTTPS.
                </small>
            </p>

            </div>

        `;

        result.innerHTML = html;

    }

    catch (error) {

        console.error(error);

        result.innerHTML = `

            <p>
                ❌ Unable to retrieve DNS information.
            </p>

            <p>
                Please check the domain and try again.
            </p>

        `;

    }

}

async function checkEmailSecurity() {

    const input = document.getElementById("emailInput");
    const result = document.getElementById("emailResult");

    if (!input || !result) {
        return;
    }

    const email = input.value.trim().toLowerCase();

    if (email === "") {
        result.innerHTML =
            "<p>⚠️ Please enter an email address.</p>";
        return;
    }

    // Basic email format validation
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        result.innerHTML =
            "<p>❌ Invalid email format.</p>";

        return;
    }

    const parts = email.split("@");

    const username = parts[0];
    const domain = parts[1];

    result.innerHTML =
        "<p>🔎 Checking mail configuration for " +
        domain +
        "...</p>";

    try {

        const response = await fetch(
            `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`
        );

        if (!response.ok) {
            throw new Error("DNS request failed");
        }

        const data = await response.json();

        const mxRecords = data.Answer || [];

        let html = `

            <div class="card">

                <h3>📧 Email Analysis</h3>

                <p>
                    <strong>Email:</strong>
                    ${email}
                </p>

                <p>
                    <strong>Domain:</strong>
                    ${domain}
                </p>

                <p>
                    <strong>Format:</strong>
                    ✅ Valid
                </p>

        `;

        if (mxRecords.length > 0) {

            html += `

                <h3>📬 Mail Servers</h3>

                <p>
                    ✅ This domain publishes MX records.
                </p>

                <ul>
            `;

            mxRecords.forEach(record => {

                html +=
                    `<li>${record.data}</li>`;

            });

            html += `
                </ul>
            `;

        } else {

            html += `

                <h3>📬 Mail Servers</h3>

                <p>
                    ⚠️ No MX records were found.
                </p>

            `;

        }

        html += `

                <p>
                    <small>
                        This check analyzes the email's
                        domain and public DNS mail configuration.
                        It does not verify whether the mailbox
                        itself exists.
                    </small>
                </p>

            </div>

        `;

        result.innerHTML = html;

    } catch (error) {

        console.error(error);

        result.innerHTML = `

            <p>
                ❌ Unable to retrieve mail configuration.
            </p>

        `;

    }
}
async function checkSecurityHeaders() {

    const input = document.getElementById("urlInput");
    const result = document.getElementById("headersResult");

    if (!input || !result) {
        return;
    }

    let url = input.value.trim();

    if (url === "") {
        result.innerHTML =
            "<p>⚠️ Please enter a website URL.</p>";
        return;
    }

    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }

    try {

        new URL(url);

    } catch {

        result.innerHTML =
            "<p>❌ Invalid URL.</p>";

        return;
    }

    result.innerHTML =
        "<p>🔎 Checking security headers...</p>";

    try {

        const response = await fetch(url, {
            method: "GET",
            mode: "cors"
        });

        const headers = response.headers;

        const securityHeaders = {

            "Content-Security-Policy":
                headers.get("Content-Security-Policy"),

            "Strict-Transport-Security":
                headers.get("Strict-Transport-Security"),

            "X-Content-Type-Options":
                headers.get("X-Content-Type-Options"),

            "Referrer-Policy":
                headers.get("Referrer-Policy"),

            "Permissions-Policy":
                headers.get("Permissions-Policy")
        };


        let html = `

            <div class="card">

                <h3>🛡️ Security Header Results</h3>

                <p>
                    <strong>Website:</strong>
                    ${url}
                </p>

                <table>

                    <tr>
                        <th>Header</th>
                        <th>Status</th>
                        <th>Value</th>
                    </tr>

        `;


        for (const [name, value] of
            Object.entries(securityHeaders)) {

            if (value) {

                html += `

                    <tr>

                        <td>${name}</td>

                        <td>
                            ✅ Present
                        </td>

                        <td>
                            ${value}
                        </td>

                    </tr>

                `;

            } else {

                html += `

                    <tr>

                        <td>${name}</td>

                        <td>
                            ⚠️ Not detected
                        </td>

                        <td>
                            -
                        </td>

                    </tr>

                `;

            }

        }


        html += `

                </table>

                <p>
                    <small>
                        Results depend on the headers
                        exposed by the target server and
                        browser CORS policy.
                    </small>
                </p>

            </div>

        `;

        result.innerHTML = html;

    } catch (error) {

        console.error(error);

        result.innerHTML = `

            <div class="card">

                <h3>⚠️ Unable to Check</h3>

                <p>
                    The target website did not allow this
                    browser-based request, or the request
                    could not be completed.
                </p>

                <p>
                    This does <strong>not</strong> mean that
                    the website is missing security headers.
                </p>

                <p>
                    <small>
                        Browser CORS restrictions can prevent
                        JavaScript from reading headers from
                        another website.
                    </small>
                </p>

            </div>

        `;

    }

}
function analyzeURL() {

    const input = document.getElementById("urlAnalyzerInput");
    const result = document.getElementById("urlAnalyzerResult");

    if (!input || !result) {
        return;
    }

    let value = input.value.trim();

    if (value === "") {
        result.innerHTML =
            "<p>⚠️ Please enter a URL.</p>";
        return;
    }

    // Add a protocol if one was not supplied
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
        value = "https://" + value;
    }

    let parsedURL;

    try {
        parsedURL = new URL(value);
    } catch {

        result.innerHTML =
            "<p>❌ Invalid URL.</p>";

        return;
    }

    const protocol = parsedURL.protocol;
    const hostname = parsedURL.hostname;
    const port = parsedURL.port || (
        protocol === "https:" ? "443" :
        protocol === "http:" ? "80" :
        "Default"
    );

    const path = parsedURL.pathname || "/";
    const query = parsedURL.search || "None";
    const fragment = parsedURL.hash || "None";

    const isHTTPS = protocol === "https:";
    const hasCredentials =
        parsedURL.username !== "" ||
        parsedURL.password !== "";

    const isIPAddress =
        /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname) ||
        hostname.includes(":");

    const isNonStandardPort =
        parsedURL.port !== "" &&
        !(
            (protocol === "https:" && parsedURL.port === "443") ||
            (protocol === "http:" && parsedURL.port === "80")
        );

    const longURL = value.length > 200;

    let securityFindings = "";

    if (isHTTPS) {

        securityFindings +=
            "<li>✅ HTTPS is being used.</li>";

    } else {

        securityFindings +=
            "<li>⚠️ URL is using HTTP instead of HTTPS.</li>";

    }

    if (hasCredentials) {

        securityFindings +=
            "<li>⚠️ URL contains username/password information.</li>";

    } else {

        securityFindings +=
            "<li>✅ No URL credentials detected.</li>";

    }

    if (isIPAddress) {

        securityFindings +=
            "<li>⚠️ Host appears to be an IP address.</li>";

    } else {

        securityFindings +=
            "<li>✅ Host uses a domain name.</li>";

    }

    if (isNonStandardPort) {

        securityFindings +=
            "<li>⚠️ Non-standard port detected.</li>";

    } else {

        securityFindings +=
            "<li>✅ No unusual port detected.</li>";

    }

    if (longURL) {

        securityFindings +=
            "<li>⚠️ URL is unusually long.</li>";

    } else {

        securityFindings +=
            "<li>✅ URL length is within a normal range.</li>";

    }

    result.innerHTML = `

        <div class="card">

            <h3>🔗 URL Analysis</h3>

            <p>
                <strong>Original URL:</strong>
                ${value}
            </p>

            <p>
                <strong>Protocol:</strong>
                ${protocol}
            </p>

            <p>
                <strong>Hostname:</strong>
                ${hostname}
            </p>

            <p>
                <strong>Port:</strong>
                ${port}
            </p>

            <p>
                <strong>Path:</strong>
                ${path}
            </p>

            <p>
                <strong>Query:</strong>
                ${query}
            </p>

            <p>
                <strong>Fragment:</strong>
                ${fragment}
            </p>

            <h3>🛡️ Security Observations</h3>

            <ul>
                ${securityFindings}
            </ul>

            <p>
                <small>
                    These observations are structural checks only.
                    They do not determine whether a URL or website
                    is malicious.
                </small>
            </p>

        </div>

    `;
}