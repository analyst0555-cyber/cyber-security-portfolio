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