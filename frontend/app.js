// ==================================================
// Academic Certificate Verification
// ==================================================


// --------------------------------------------------
// PDF.js configuration
// --------------------------------------------------

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


// --------------------------------------------------
// Blockchain configuration
// --------------------------------------------------

// Current Ganache-deployed contract
const CONTRACT_ADDRESS =
    "..............";

// Local Ganache RPC
const GANACHE_RPC =
    "http://127.0.0.1:8545";


// --------------------------------------------------
// Contract ABI
// --------------------------------------------------
//
// This is the minimum ABI required by the employer
// verification frontend.
//
// verifyCertificate() must return:
// "VERIFIED"
// "REVOKED"
// "NOT VERIFIED"
//

const CONTRACT_ABI = [
    {
        inputs: [
            {
                internalType: "string",
                name: "id",
                type: "string"
            }
        ],

        name: "verifyCertificate",

        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string"
            }
        ],

        stateMutability: "view",

        type: "function"
    }
];


// --------------------------------------------------
// HTML elements
// --------------------------------------------------

const pdfInput =
    document.getElementById("pdfInput");

const fileInfo =
    document.getElementById("fileInfo");

const scanButton =
    document.getElementById("scanButton");

const loading =
    document.getElementById("loading");

const certificateSection =
    document.getElementById("certificateSection");

const certificateIdElement =
    document.getElementById("certificateId");

const verifyButton =
    document.getElementById("verifyButton");

const result =
    document.getElementById("result");

const resultIcon =
    document.getElementById("resultIcon");

const resultStatus =
    document.getElementById("resultStatus");

const resultDetails =
    document.getElementById("resultDetails");

const errorBox =
    document.getElementById("error");


// --------------------------------------------------
// Variables
// --------------------------------------------------

let selectedFile = null;

let detectedCertificateId = null;


// --------------------------------------------------
// PDF selection
// --------------------------------------------------

pdfInput.addEventListener(
    "change",
    function () {

        clearMessages();

        selectedFile =
            pdfInput.files[0];


        if (!selectedFile) {

            scanButton.disabled = true;

            return;
        }


        if (
            selectedFile.type !==
            "application/pdf"
        ) {

            showError(
                "Please select a valid PDF file."
            );

            scanButton.disabled = true;

            return;
        }


        fileInfo.textContent =
            "Selected file: " +
            selectedFile.name;


        fileInfo.classList.remove(
            "hidden"
        );


        scanButton.disabled = false;

    }
);


// --------------------------------------------------
// Scan certificate
// --------------------------------------------------

scanButton.addEventListener(
    "click",
    async function () {

        if (!selectedFile) {
            return;
        }


        clearMessages();

        showLoading(true);


        try {

            const text =
                await extractPdfText(
                    selectedFile
                );


            console.log(
                "Extracted PDF text:",
                text
            );


            // Look for certificate IDs such as:
            // CERT001
            // CERT002
            // CERT123

            const match =
                text.match(
                    /\bCERT\d+\b/i
                );


            if (!match) {

                showLoading(false);

                showError(
                    "The PDF was read successfully, but no certificate ID such as CERT001 was found."
                );

                return;
            }


            detectedCertificateId =
                match[0].toUpperCase();


            certificateIdElement.textContent =
                detectedCertificateId;


            certificateSection.classList.remove(
                "hidden"
            );


            showLoading(false);

        }

        catch (error) {

            console.error(
                "PDF reading error:",
                error
            );


            showLoading(false);


            showError(
                "Could not read the PDF. Please make sure it is a valid text-based PDF."
            );
        }

    }
);


// --------------------------------------------------
// Extract PDF text
// --------------------------------------------------

async function extractPdfText(file) {

    const arrayBuffer =
        await file.arrayBuffer();


    console.log(
        "PDF loaded.",
        arrayBuffer.byteLength,
        "bytes"
    );


    const pdf =
        await pdfjsLib
            .getDocument({
                data: arrayBuffer
            })
            .promise;


    console.log(
        "Number of pages:",
        pdf.numPages
    );


    let completeText = "";


    for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
    ) {

        const page =
            await pdf.getPage(
                pageNumber
            );


        const content =
            await page.getTextContent();


        const pageText =
            content.items
                .map(
                    item => item.str
                )
                .join(" ");


        completeText +=
            pageText + "\n";
    }


    return completeText;
}


// --------------------------------------------------
// Verify certificate on blockchain
// --------------------------------------------------

verifyButton.addEventListener(
    "click",
    async function () {

        if (!detectedCertificateId) {
            return;
        }


        clearError();

        showLoading(true);


        try {

            // --------------------------------------
            // Load ethers.js from local installation
            // --------------------------------------

            const {
                ethers
            } = await import(
                "ethers"
            );


            // --------------------------------------
            // Connect directly to Ganache
            // --------------------------------------

            const provider =
                new ethers.JsonRpcProvider(
                    GANACHE_RPC
                );


            // --------------------------------------
            // Check blockchain connection
            // --------------------------------------

            const network =
                await provider.getNetwork();


            console.log(
                "Connected to blockchain:",
                network
            );


            // --------------------------------------
            // Create contract instance
            // --------------------------------------

            const contract =
                new ethers.Contract(
                    CONTRACT_ADDRESS,
                    CONTRACT_ABI,
                    provider
                );


            // --------------------------------------
            // Verify certificate
            // --------------------------------------

            console.log(
                "Checking certificate:",
                detectedCertificateId
            );


            const status =
                await contract.verifyCertificate(
                    detectedCertificateId
                );


            console.log(
                "Blockchain result:",
                status
            );


            // --------------------------------------
            // Display result
            // --------------------------------------

            showBlockchainResult(
                status
            );

        }

        catch (error) {

            console.error(
                "Verification error:",
                error
            );


            showLoading(false);


            showError(
                getBlockchainErrorMessage(
                    error
                )
            );
        }

    }
);


// --------------------------------------------------
// Display blockchain result
// --------------------------------------------------

function showBlockchainResult(status) {

    showLoading(false);


    result.className =
        "result";


    const normalized =
        String(status)
            .trim()
            .toUpperCase();


    // ----------------------------------------------
    // VERIFIED
    // ----------------------------------------------

    if (
        normalized ===
        "VERIFIED"
    ) {

        result.classList.add(
            "verified"
        );


        resultIcon.textContent =
            "✓";


        resultStatus.textContent =
            "VERIFIED";


        resultDetails.innerHTML = `

            <p>
                Certificate
                <strong>
                    ${detectedCertificateId}
                </strong>
                is valid and has been verified
                on the blockchain.
            </p>

        `;
    }


    // ----------------------------------------------
    // REVOKED
    // ----------------------------------------------

    else if (
        normalized ===
        "REVOKED"
    ) {

        result.classList.add(
            "revoked"
        );


        resultIcon.textContent =
            "⚠";


        resultStatus.textContent =
            "REVOKED";


        resultDetails.innerHTML = `

            <p>
                Certificate
                <strong>
                    ${detectedCertificateId}
                </strong>
                was issued but has been revoked.
            </p>

        `;
    }


    // ----------------------------------------------
    // NOT VERIFIED
    // ----------------------------------------------

    else {

        result.classList.add(
            "not-verified"
        );


        resultIcon.textContent =
            "✕";


        resultStatus.textContent =
            "NOT VERIFIED";


        resultDetails.innerHTML = `

            <p>
                Certificate
                <strong>
                    ${detectedCertificateId}
                </strong>
                could not be verified.
            </p>

        `;
    }


    result.classList.remove(
        "hidden"
    );
}


// --------------------------------------------------
// Blockchain error handling
// --------------------------------------------------

function getBlockchainErrorMessage(error) {

    console.error(
        "Full blockchain error:",
        error
    );


    if (
        error.message &&
        error.message.includes(
            "ECONNREFUSED"
        )
    ) {

        return (
            "Could not connect to Ganache. " +
            "Please make sure Ganache is running on 127.0.0.1:8545."
        );
    }


    if (
        error.code ===
        "NETWORK_ERROR"
    ) {

        return (
            "Blockchain network connection failed. " +
            "Please check that Ganache is running."
        );
    }


    return (
        "Blockchain verification failed. " +
        "Check that Ganache is running and that the contract address is correct."
    );
}


// --------------------------------------------------
// UI functions
// --------------------------------------------------

function showLoading(show) {

    if (show) {

        loading.classList.remove(
            "hidden"
        );

    }

    else {

        loading.classList.add(
            "hidden"
        );
    }
}


// --------------------------------------------------
// Show error
// --------------------------------------------------

function showError(message) {

    errorBox.textContent =
        message;


    errorBox.classList.remove(
        "hidden"
    );
}


// --------------------------------------------------
// Clear error
// --------------------------------------------------

function clearError() {

    errorBox.classList.add(
        "hidden"
    );
}


// --------------------------------------------------
// Clear messages
// --------------------------------------------------

function clearMessages() {

    errorBox.classList.add(
        "hidden"
    );


    result.classList.add(
        "hidden"
    );


    certificateSection.classList.add(
        "hidden"
    );
}


// --------------------------------------------------
// Application startup
// --------------------------------------------------

console.log(
    "Academic Certificate Verification loaded."
);

console.log(
    "Ganache RPC:",
    GANACHE_RPC
);

console.log(
    "Contract:",
    CONTRACT_ADDRESS
);
