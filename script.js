function checkPassword() {

    const password = document.getElementById("password");
    const result = document.getElementById("result");

    if (!password || !result) {
        return;
    }

    const value = password.value;

    if (value === "") {
        result.textContent = "⚠️ Please enter a password.";
        return;
    }

    let score = 0;

    if (value.length >= 8) {
        score++;
    }

    if (/[A-Z]/.test(value)) {
        score++;
    }

    if (/[a-z]/.test(value)) {
        score++;
    }

    if (/[0-9]/.test(value)) {
        score++;
    }

    if (/[^A-Za-z0-9]/.test(value)) {
        score++;
    }


    if (score <= 2) {

        result.textContent =
            "🔴 Weak password";

    } else if (score === 3 || score === 4) {

        result.textContent =
            "🟡 Medium password";

    } else {

        result.textContent =
            "🟢 Strong password";

    }
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
function identifyHash() {

    const input = document.getElementById("hashInput");
    const result = document.getElementById("hashResult");

    if (!input || !result) {
        return;
    }

    const hash = input.value.trim().toLowerCase();

    if (hash === "") {
        result.innerHTML =
            "<p>⚠️ Please enter a hash.</p>";
        return;
    }

    const hexPattern = /^[a-f0-9]+$/;

    if (!hexPattern.test(hash)) {
        result.innerHTML =
            "<p>❌ This does not appear to be a hexadecimal hash.</p>";
        return;
    }

    const length = hash.length;

    let possibleHashes = [];

    if (length === 32) {
        possibleHashes.push("MD5");
    }

    if (length === 40) {
        possibleHashes.push("SHA-1");
    }

    if (length === 56) {
        possibleHashes.push("SHA-224");
    }

    if (length === 64) {
        possibleHashes.push("SHA-256");
    }

    if (length === 96) {
        possibleHashes.push("SHA-384");
    }

    if (length === 128) {
        possibleHashes.push("SHA-512");
    }

    if (possibleHashes.length === 0) {

        result.innerHTML = `

            <p>
                ⚠️ No common hash format matches
                this length.
            </p>

            <p>
                Length: ${length} hexadecimal characters
            </p>

        `;

        return;
    }

    result.innerHTML = `

        <h3>🔢 Possible Hash Format(s)</h3>

        <p>
            <strong>Length:</strong>
            ${length} hexadecimal characters
        </p>

        <ul>
            ${possibleHashes
                .map(hashType => `<li>✅ ${hashType}</li>`)
                .join("")}
        </ul>

        <p>
            <small>
                Hash identification based on length and
                character pattern cannot guarantee the
                original hashing algorithm.
            </small>
        </p>

    `;
}


async function generateHash(algorithm) {

    const input =
        document.getElementById("hashTextInput");

    const result =
        document.getElementById("hashGenerateResult");

    if (!input || !result) {
        return;
    }

    const text = input.value;

    if (text === "") {

        result.innerHTML =
            "<p>⚠️ Enter some text first.</p>";

        return;
    }

    try {

        const encoder = new TextEncoder();

        const data = encoder.encode(text);

        const hashBuffer =
            await crypto.subtle.digest(
                algorithm,
                data
            );

        const hashArray =
            Array.from(
                new Uint8Array(hashBuffer)
            );

        const hashHex =
            hashArray
                .map(byte =>
                    byte.toString(16).padStart(2, "0")
                )
                .join("");

        result.innerHTML = `

            <h3>🔐 ${algorithm}</h3>

            <p>
                <strong>Input:</strong>
                ${text}
            </p>

            <p>
                <strong>Hash:</strong>
            </p>

            <pre>${hashHex}</pre>

        `;

    } catch (error) {

        console.error(error);

        result.innerHTML =
            "<p>❌ Unable to generate hash.</p>";

    }
}
function analyzeIP() {

    const ipInput = document.getElementById("ipInput");
    const cidrInput = document.getElementById("cidrInput");
    const result = document.getElementById("ipResult");

    if (!ipInput || !cidrInput || !result) {
        return;
    }

    const ip = ipInput.value.trim();
    const cidrValue = cidrInput.value.trim();

    if (ip === "") {
        result.innerHTML = "<p>⚠️ Please enter an IP address.</p>";
        return;
    }

    /*
     * ==========================================
     * IPv6
     * ==========================================
     */

    if (ip.includes(":")) {

        function isValidIPv6(address) {

            if (address.includes(".")) {
                return false;
            }

            if ((address.match(/::/g) || []).length > 1) {
                return false;
            }

            const parts = address.split(":");

            if (address.includes("::")) {

                const left = address.split("::")[0];
                const right = address.split("::")[1];

                const leftParts =
                    left === "" ? [] : left.split(":");

                const rightParts =
                    right === "" ? [] : right.split(":");

                if (
                    leftParts.length +
                    rightParts.length >= 8
                ) {
                    return false;
                }

                const allParts =
                    leftParts.concat(rightParts);

                return allParts.every(function (part) {
                    return /^[0-9a-fA-F]{1,4}$/.test(part);
                });

            } else {

                if (parts.length !== 8) {
                    return false;
                }

                return parts.every(function (part) {
                    return /^[0-9a-fA-F]{1,4}$/.test(part);
                });
            }
        }

        if (!isValidIPv6(ip)) {

            result.innerHTML =
                "<p>❌ Invalid IPv6 address.</p>";

            return;
        }

        let cidr =
            cidrValue === ""
                ? 128
                : Number(cidrValue);

        if (
            !Number.isInteger(cidr) ||
            cidr < 0 ||
            cidr > 128
        ) {

            result.innerHTML =
                "<p>❌ IPv6 CIDR must be between 0 and 128.</p>";

            return;
        }

        let classification = "Global / Public";

        const lowerIP = ip.toLowerCase();

        if (lowerIP === "::1") {
            classification = "Loopback";
        }
        else if (
            lowerIP.startsWith("fe8:") ||
            lowerIP.startsWith("fe9:") ||
            lowerIP.startsWith("fea:") ||
            lowerIP.startsWith("feb:")
        ) {
            classification = "Link-local";
        }
        else if (
            lowerIP.startsWith("fc") ||
            lowerIP.startsWith("fd")
        ) {
            classification = "Unique Local Address";
        }
        else if (
            lowerIP.startsWith("ff")
        ) {
            classification = "Multicast";
        }

        result.innerHTML = `

            <div class="card">

                <h3>🌐 IPv6 Analysis</h3>

                <p>
                    <strong>IP Address:</strong>
                    ${ip}
                </p>

                <p>
                    <strong>Type:</strong>
                    IPv6
                </p>

                <p>
                    <strong>Classification:</strong>
                    ${classification}
                </p>

                <p>
                    <strong>CIDR:</strong>
                    /${cidr}
                </p>

                <p>
                    <strong>Address Size:</strong>
                    128 bits
                </p>

                <p>
                    <strong>Address Space:</strong>
                    2<sup>128</sup> possible addresses
                </p>

                <p>
                    <strong>Network Prefix:</strong>
                    /${cidr}
                </p>

                <p>
                    <small>
                        IPv6 address validation and
                        classification are performed
                        locally in your browser.
                    </small>
                </p>

            </div>

        `;

        return;
    }


    /*
     * ==========================================
     * IPv4
     * ==========================================
     */

    const octets = ip.split(".");

    if (
        octets.length !== 4 ||
        octets.some(function (octet) {

            return (
                !/^\d+$/.test(octet) ||
                Number(octet) < 0 ||
                Number(octet) > 255
            );

        })
    ) {

        result.innerHTML =
            "<p>❌ Invalid IPv4 address.</p>";

        return;
    }

    const numbers = octets.map(Number);

    let cidr =
        cidrValue === ""
            ? 32
            : Number(cidrValue);

    if (
        !Number.isInteger(cidr) ||
        cidr < 0 ||
        cidr > 32
    ) {

        result.innerHTML =
            "<p>❌ IPv4 CIDR must be between 0 and 32.</p>";

        return;
    }

    const ipNumber =
        (
            (
                (
                    numbers[0] * 256 +
                    numbers[1]
                ) * 256 +
                numbers[2]
            ) * 256 +
            numbers[3]
        ) >>> 0;

    const mask =
        cidr === 0
            ? 0
            : (0xFFFFFFFF << (32 - cidr)) >>> 0;

    const network =
        (ipNumber & mask) >>> 0;

    const broadcast =
        (network | (~mask >>> 0)) >>> 0;

    function numberToIP(number) {

        return [
            (number >>> 24) & 255,
            (number >>> 16) & 255,
            (number >>> 8) & 255,
            number & 255
        ].join(".");
    }

    const networkIP =
        numberToIP(network);

    const broadcastIP =
        numberToIP(broadcast);

    let classification = "Public";

    if (
        numbers[0] === 10 ||
        (
            numbers[0] === 172 &&
            numbers[1] >= 16 &&
            numbers[1] <= 31
        ) ||
        (
            numbers[0] === 192 &&
            numbers[1] === 168
        )
    ) {
        classification = "Private";
    }

    if (numbers[0] === 127) {
        classification = "Loopback";
    }

    if (
        numbers[0] === 169 &&
        numbers[1] === 254
    ) {
        classification = "Link-local";
    }

    let usableHosts;

    if (cidr <= 30) {
        usableHosts =
            Math.pow(2, 32 - cidr) - 2;
    }
    else if (cidr === 31) {
        usableHosts = 2;
    }
    else {
        usableHosts = 1;
    }

    let firstHost =
        networkIP;

    let lastHost =
        broadcastIP;

    if (cidr <= 30) {

        firstHost =
            numberToIP(network + 1);

        lastHost =
            numberToIP(broadcast - 1);
    }

    result.innerHTML = `

        <div class="card">

            <h3>🌐 IPv4 Analysis</h3>

            <p>
                <strong>IP Address:</strong>
                ${ip}
            </p>

            <p>
                <strong>Type:</strong>
                IPv4
            </p>

            <p>
                <strong>Classification:</strong>
                ${classification}
            </p>

            <p>
                <strong>CIDR:</strong>
                /${cidr}
            </p>

            <p>
                <strong>Network Address:</strong>
                ${networkIP}
            </p>

            <p>
                <strong>Broadcast Address:</strong>
                ${broadcastIP}
            </p>

            <p>
                <strong>First Usable Host:</strong>
                ${firstHost}
            </p>

            <p>
                <strong>Last Usable Host:</strong>
                ${lastHost}
            </p>

            <p>
                <strong>Usable Hosts:</strong>
                ${usableHosts}
            </p>

        </div>

    `;
}   
function analyzeLog() {

    const input = document.getElementById("logInput");
    const result = document.getElementById("logResult");

    if (!input || !result) {
        return;
    }

    const log = input.value.trim();

    if (log === "") {

        result.innerHTML =
            "<p>⚠️ Please paste one or more log entries.</p>";

        return;
    }

    const lines = log
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line !== "");

    let failedLogins = 0;
    let successfulLogins = 0;
    let accountLockouts = 0;

    const sourceIPs = {};
    const usernames = {};

    lines.forEach(function(line) {

        /*
         * Extract IP address
         */

        const ipMatch =
            line.match(
                /\b(?:\d{1,3}\.){3}\d{1,3}\b/
            );

        if (ipMatch) {

            const ip = ipMatch[0];

            if (!sourceIPs[ip]) {
                sourceIPs[ip] = 0;
            }

            sourceIPs[ip]++;
        }


        /*
         * Extract username
         */

        const userMatch =
            line.match(
                /(?:for|user|username)[ =]+([a-zA-Z0-9._-]+)/i
            );

        if (userMatch) {

            const username = userMatch[1];

            if (!usernames[username]) {
                usernames[username] = 0;
            }

            usernames[username]++;
        }


        /*
         * Failed authentication
         */

        if (
            /failed password/i.test(line) ||
            /authentication failure/i.test(line) ||
            /login failed/i.test(line) ||
            /failed login/i.test(line)
        ) {

            failedLogins++;
        }


        /*
         * Successful authentication
         */

        if (
            /accepted password/i.test(line) ||
            /authentication successful/i.test(line) ||
            /login successful/i.test(line)
        ) {

            successfulLogins++;
        }


        /*
         * Account lockout
         */

        if (
            /account locked/i.test(line) ||
            /account lockout/i.test(line)
        ) {

            accountLockouts++;
        }

    });


    /*
     * Brute-force detection
     */

    let bruteForceDetected = false;
    let suspiciousIP = "";

    for (const ip in sourceIPs) {

        if (sourceIPs[ip] >= 3) {

            bruteForceDetected = true;
            suspiciousIP = ip;

            break;
        }
    }


    /*
     * Determine severity
     */

    let severity = "Low";

    if (accountLockouts > 0) {
        severity = "High";
    }
    else if (bruteForceDetected) {
        severity = "High";
    }
    else if (failedLogins > 0) {
        severity = "Medium";
    }


    /*
     * Event classification
     */

    let eventType = "General Authentication Activity";

    if (bruteForceDetected) {

        eventType =
            "Possible Brute-Force Activity";

    }
    else if (accountLockouts > 0) {

        eventType =
            "Account Lockout Activity";

    }
    else if (failedLogins > 0) {

        eventType =
            "Failed Authentication Activity";

    }
    else if (successfulLogins > 0) {

        eventType =
            "Successful Authentication Activity";
    }


    /*
     * Build IP summary
     */

    let ipSummary = "";

    const ipList =
        Object.keys(sourceIPs);

    if (ipList.length === 0) {

        ipSummary =
            "<li>No source IP addresses detected.</li>";

    }
    else {

        ipSummary = ipList
            .map(function(ip) {

                return `
                    <li>
                        <strong>${ip}</strong>
                        → ${sourceIPs[ip]} event(s)
                    </li>
                `;

            })
            .join("");
    }


    /*
     * Build username summary
     */

    let usernameSummary = "";

    const usernameList =
        Object.keys(usernames);

    if (usernameList.length === 0) {

        usernameSummary =
            "<li>No usernames detected.</li>";

    }
    else {

        usernameSummary = usernameList
            .map(function(username) {

                return `
                    <li>
                        <strong>${username}</strong>
                        → ${usernames[username]} event(s)
                    </li>
                `;

            })
            .join("");
    }


    /*
     * Detection message
     */

    let detectionMessage =
        "No obvious repeated authentication pattern detected.";

    if (bruteForceDetected) {

        detectionMessage =
            `⚠️ Possible brute-force activity detected from ${suspiciousIP}.`;

    }
    else if (accountLockouts > 0) {

        detectionMessage =
            "⚠️ Account lockout activity detected.";

    }
    else if (failedLogins > 0) {

        detectionMessage =
            "⚠️ Failed authentication activity detected.";
    }


    /*
     * Display result
     */

    result.innerHTML = `

        <div class="card">

            <h3>📊 SOC Log Analysis</h3>

            <p>
                <strong>Total Events:</strong>
                ${lines.length}
            </p>

            <p>
                <strong>Failed Logins:</strong>
                ${failedLogins}
            </p>

            <p>
                <strong>Successful Logins:</strong>
                ${successfulLogins}
            </p>

            <p>
                <strong>Account Lockouts:</strong>
                ${accountLockouts}
            </p>

            <p>
                <strong>Event Type:</strong>
                ${eventType}
            </p>

            <p>
                <strong>Severity:</strong>
                ${severity}
            </p>


            <h3>🌐 Source IP Summary</h3>

            <ul>
                ${ipSummary}
            </ul>


            <h3>👤 Username Summary</h3>

            <ul>
                ${usernameSummary}
            </ul>


            <h3>🚨 Detection</h3>

            <p>
                ${detectionMessage}
            </p>


            <p>
                <small>
                    This is an automated triage aid.
                    Results should be validated by a
                    security analyst before taking action.
                </small>
            </p>

        </div>

    `;
}   
function loadLogFile() {

    const fileInput =
        document.getElementById("logFile");

    const logInput =
        document.getElementById("logInput");

    if (!fileInput || !logInput) {
        return;
    }

    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    const allowedTypes = [
        ".log",
        ".txt"
    ];

    const fileName =
        file.name.toLowerCase();

    const validFile =
        allowedTypes.some(function(extension) {
            return fileName.endsWith(extension);
        });

    if (!validFile) {

        alert(
            "Please select a .log or .txt file."
        );

        fileInput.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {

        logInput.value =
            event.target.result;

    };

    reader.onerror = function() {

        alert(
            "Unable to read the selected file."
        );

    };

    reader.readAsText(file);
}
function updateSOCDashboard() {

    const input = document.getElementById("logInput");
    const dashboard = document.getElementById("socDashboard");

    if (!input || !dashboard) {
        return;
    }

    const log = input.value.trim();

    if (log === "") {
        dashboard.innerHTML = "";
        return;
    }

    const lines = log
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line !== "");

    let failedLogins = 0;
    let successfulLogins = 0;
    let accountLockouts = 0;

    const sourceIPs = {};
    const usernames = {};

    lines.forEach(function(line) {

        const ipMatch =
            line.match(
                /\b(?:\d{1,3}\.){3}\d{1,3}\b/
            );

        if (ipMatch) {

            const ip = ipMatch[0];

            sourceIPs[ip] =
                (sourceIPs[ip] || 0) + 1;
        }


        const userMatch =
            line.match(
                /(?:for|user|username)[ =]+([a-zA-Z0-9._-]+)/i
            );

        if (userMatch) {

            const username = userMatch[1];

            usernames[username] =
                (usernames[username] || 0) + 1;
        }


        if (
            /failed password/i.test(line) ||
            /authentication failure/i.test(line) ||
            /login failed/i.test(line) ||
            /failed login/i.test(line)
        ) {

            failedLogins++;
        }


        if (
            /accepted password/i.test(line) ||
            /authentication successful/i.test(line) ||
            /login successful/i.test(line)
        ) {

            successfulLogins++;
        }


        if (
            /account locked/i.test(line) ||
            /account lockout/i.test(line)
        ) {

            accountLockouts++;
        }

    });


    const uniqueIPs =
        Object.keys(sourceIPs).length;

    const uniqueUsers =
        Object.keys(usernames).length;


    let topIP = "None";

    let topIPCount = 0;

    Object.keys(sourceIPs).forEach(function(ip) {

        if (sourceIPs[ip] > topIPCount) {

            topIP = ip;
            topIPCount = sourceIPs[ip];

        }

    });


    let topUser = "None";

    let topUserCount = 0;

    Object.keys(usernames).forEach(function(username) {

        if (usernames[username] > topUserCount) {

            topUser = username;
            topUserCount = usernames[username];

        }

    });


    let severity = "Low";

    if (accountLockouts > 0) {

        severity = "High";

    } else if (failedLogins >= 3) {

        severity = "High";

    } else if (failedLogins > 0) {

        severity = "Medium";
    }


    dashboard.innerHTML = `

        <div class="card">

            <h3>📊 SOC Dashboard</h3>

            <p>
                <strong>Total Events:</strong>
                ${lines.length}
            </p>

            <p>
                <strong>Failed Logins:</strong>
                ${failedLogins}
            </p>

            <p>
                <strong>Successful Logins:</strong>
                ${successfulLogins}
            </p>

            <p>
                <strong>Account Lockouts:</strong>
                ${accountLockouts}
            </p>

            <p>
                <strong>Unique Source IPs:</strong>
                ${uniqueIPs}
            </p>

            <p>
                <strong>Unique Usernames:</strong>
                ${uniqueUsers}
            </p>

            <p>
                <strong>Top Source IP:</strong>
                ${topIP}
                (${topIPCount} event(s))
            </p>

            <p>
                <strong>Most Targeted Username:</strong>
                ${topUser}
                (${topUserCount} event(s))
            </p>

            <p>
                <strong>Overall Severity:</strong>
                ${severity}
            </p>

        </div>

    `;
}