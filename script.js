function checkPassword() {
    alert("JavaScript is working!");
}

function analyzeDomain() {

    const input = document.getElementById("domainInput");
    const result = document.getElementById("domainResult");

    let domain = input.value.trim().toLowerCase();

    if (domain === "") {
        result.innerHTML = "<p>Please enter a domain name.</p>";
        return;
    }

    // Remove protocol if the user enters a URL
    domain = domain.replace(/^https?:\/\//, "");

    // Remove path
    domain = domain.split("/")[0];

    // Basic domain validation
    const domainPattern =
        /^(?!-)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$/;

    if (!domainPattern.test(domain)) {

        result.innerHTML = `
            <p>
                ❌ Invalid domain format.
                <br>
                Example: example.com
            </p>
        `;

        return;
    }

    const parts = domain.split(".");

    const tld = "." + parts[parts.length - 1];

    const domainName = parts[parts.length - 2];

    result.innerHTML = `

        <div class="card">

            <h3>Domain Information</h3>

            <p>
                <strong>Domain:</strong>
                ${domain}
            </p>

            <p>
                <strong>Domain Name:</strong>
                ${domainName}
            </p>

            <p>
                <strong>TLD:</strong>
                ${tld}
            </p>

            <p>
                <strong>Labels:</strong>
                ${parts.length}
            </p>

            <p>
                <strong>Status:</strong>
                ✅ Valid domain format
            </p>

        </div>

    `;
}

function analyzeDomain() {

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
        result.textContent = "❌ Invalid domain format.";
        return;
    }

    const parts = domain.split(".");

    const tld = "." + parts[parts.length - 1];
    const domainName = parts[parts.length - 2];

    result.innerHTML =
        "Domain: " + domain + "<br>" +
        "Domain Name: " + domainName + "<br>" +
        "TLD: " + tld + "<br>" +
        "Labels: " + parts.length + "<br>" +
        "Status: ✅ Valid domain format";
}
function analyzeDomain() {

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

        result.textContent =
            "❌ Invalid domain format.";

        return;
    }

    const parts = domain.split(".");

    const tld =
        "." + parts[parts.length - 1];

    const domainName =
        parts[parts.length - 2];

    result.innerHTML =
        "<strong>Domain:</strong> " + domain + "<br>" +
        "<strong>Domain Name:</strong> " + domainName + "<br>" +
        "<strong>TLD:</strong> " + tld + "<br>" +
        "<strong>Labels:</strong> " + parts.length + "<br>" +
        "<strong>Status:</strong> ✅ Valid domain format";
}