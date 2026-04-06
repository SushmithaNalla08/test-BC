// js/admin.js
const { CONTRACT_ADDRESS, CONTRACT_ABI, PINATA_API_KEY, PINATA_SECRET } = CONFIG;

let web3;
let contract;
let accounts;

// Tab switching function (global)
window.openTab = function(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" border-indigo-600 text-indigo-600", " text-gray-500");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " border-indigo-600 text-indigo-600";
};

document.getElementById('connectBtn').onclick = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        accounts = await web3.eth.getAccounts();
        document.getElementById('account').innerText = accounts[0];
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        checkIfAdmin();
    } else {
        alert('Please install MetaMask');
    }
};

async function checkIfAdmin() {
    try {
        const admin = await contract.methods.admin().call();
        if (admin.toLowerCase() === accounts[0].toLowerCase()) {
            document.getElementById('issueBtn').disabled = false;
        } else {
            document.getElementById('issueBtn').disabled = true;
            alert('You are not the admin. Issue button disabled.');
        }
    } catch (e) {
        console.error('Error checking admin:', e);
        alert('Could not verify admin status. Make sure you are on the correct network.');
    }
}

document.getElementById('issueBtn').onclick = async () => {
    const studentName = document.getElementById('studentName').value;
    const course = document.getElementById('course').value;
    const issuer = document.getElementById('issuer').value;
    let studentAddress = document.getElementById('studentAddress').value;
    const file = document.getElementById('pdfFile').files[0];

    if (!studentName || !course || !issuer || !studentAddress || !file) {
        return alert('Please fill all fields and select a PDF');
    }

    if (!web3.utils.isAddress(studentAddress)) {
        alert('Invalid Ethereum address. Please check and try again.');
        return;
    }

    const issueBtn = document.getElementById('issueBtn');
    issueBtn.disabled = true;
    issueBtn.innerText = 'Issuing...';

    // Hide previous result and clear it (optional)
    const issueResult = document.getElementById('issueResult');
    issueResult.style.display = 'none';
    issueResult.innerHTML = '';

    try {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const pdfHash = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        if (pdfHash.length !== 66) {
            console.error('PDF hash length error:', pdfHash);
            alert('PDF hash calculation error');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        const metadata = JSON.stringify({ name: file.name });
        formData.append('pinataMetadata', metadata);

        const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET
            }
        });
        const ipfsHash = res.data.IpfsHash;

        if (!ipfsHash) {
            alert('IPFS upload failed');
            return;
        }

        console.log('Parameters:', { studentName, course, issuer, pdfHash, ipfsHash, studentAddress });

        // Send the actual transaction
        const receipt = await contract.methods.issueCertificate(
            studentName, course, issuer, pdfHash, ipfsHash, studentAddress
        ).send({ from: accounts[0], gas: 3000000 });

        console.log('Transaction receipt:', receipt);

        // Try to extract certId from events; if not found, generate deterministic one
        let certId = null;
        try {
            if (receipt.events && receipt.events.CertificateIssued) {
                certId = receipt.events.CertificateIssued.returnValues.certId;
            }
        } catch (e) {
            console.warn('Could not extract from events:', e);
        }

        // Fallback: generate deterministic certId from inputs using keccak256
        if (!certId) {
            try {
                const encoded = web3.eth.abi.encodeParameters(
                    ['string', 'string', 'string', 'bytes32', 'string', 'address'],
                    [studentName, course, issuer, pdfHash, ipfsHash, studentAddress]
                );
                certId = web3.utils.keccak256(encoded);
                console.log('Generated deterministic certId:', certId);
            } catch (hashError) {
                console.error('Error generating certId:', hashError);
            }
        }

        if (!certId) {
            // Last resort: surface the raw receipt for debugging
            const pdfUrl = CONFIG.PINATA_GATEWAY + ipfsHash;
            issueResult.innerHTML = `
                <strong>Certificate transaction sent.</strong><br>
                <strong>Note:</strong> Could not extract Certificate ID.<br>
                <details class="mt-2 p-2 bg-white rounded"><summary class="font-medium">Show receipt (for debugging)</summary><pre style="white-space:pre-wrap;max-height:240px;overflow:auto">${JSON.stringify(receipt, null, 2)}</pre></details>
                <strong>IPFS CID:</strong> ${ipfsHash}<br>
                <strong>PDF Hash:</strong> ${pdfHash}<br>
                <a href="${pdfUrl}" target="_blank" class="text-indigo-600 underline">View PDF</a>
            `;
        } else {
            const pdfUrl = CONFIG.PINATA_GATEWAY + ipfsHash;
            issueResult.innerHTML = `
                <strong>✅ Certificate issued successfully!</strong><br>
                <strong>Certificate ID:</strong> <code>${certId}</code><br>
                <strong>IPFS CID:</strong> <code>${ipfsHash}</code><br>
                <strong>PDF Hash:</strong> <code>${pdfHash}</code><br>
                <a href="${pdfUrl}" target="_blank" class="text-indigo-600 underline font-bold">📥 View PDF on IPFS</a>
            `;
        }
        issueResult.style.display = 'block';
    } catch (error) {
        console.error("Full error:", error);
        if (error.data) console.error("Revert data:", error.data);
        if (error.message) console.error("Error message:", error.message);
        issueResult.innerHTML = `<strong class="text-red-600">Error: ${error.message}</strong>`;
        issueResult.style.display = 'block';
    } finally {
        issueBtn.disabled = false;
        issueBtn.innerText = 'Issue Certificate';
    }
};

document.getElementById('verifyIdBtn').onclick = async () => {
    const certId = document.getElementById('verifyCertId').value;
    if (!certId) return alert('Enter certificate ID');

    const verifyResult = document.getElementById('verifyResult');
    verifyResult.style.display = 'none';
    verifyResult.innerHTML = '';

    try {
        const cert = await contract.methods.verifyCertificate(certId).call();
        displayCert(cert, 'verifyResult');
        verifyResult.style.display = 'block';
    } catch (e) {
        console.error(e);
        verifyResult.innerHTML = '<strong class="text-red-600">Certificate not found or revoked</strong>';
        verifyResult.style.display = 'block';
    }
};

document.getElementById('verifyPdfBtn').onclick = async () => {
    const file = document.getElementById('verifyPdf').files[0];
    if (!file) return alert('Select a PDF');

    const verifyResult = document.getElementById('verifyResult');
    verifyResult.style.display = 'none';
    verifyResult.innerHTML = '';

    try {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const pdfHash = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const certId = await contract.methods.getCertificateByPdfHash(pdfHash).call();
        if (certId === '0x0000000000000000000000000000000000000000000000000000000000000000') {
            verifyResult.innerHTML = '<strong class="text-red-600">No certificate found for this PDF</strong>';
            verifyResult.style.display = 'block';
        } else {
            const cert = await contract.methods.verifyCertificate(certId).call();
            displayCert(cert, 'verifyResult');
            verifyResult.style.display = 'block';
        }
    } catch (error) {
        console.error(error);
        verifyResult.innerHTML = `<strong class="text-red-600">Error: ${error.message}</strong>`;
        verifyResult.style.display = 'block';
    }
};

function displayCert(cert, resultDivId) {
    const date = new Date(Number(cert.issueDate) * 1000).toLocaleString();
    const ipfsLink = CONFIG.PINATA_GATEWAY + cert.ipfsHash;
    document.getElementById(resultDivId).innerHTML = `
        <h4 class="font-bold text-lg mb-2">Certificate Details</h4>
        <p><span class="font-medium">Student:</span> ${cert.studentName}</p>
        <p><span class="font-medium">Course:</span> ${cert.course}</p>
        <p><span class="font-medium">Issuer:</span> ${cert.issuer}</p>
        <p><span class="font-medium">Issue Date:</span> ${date}</p>
        <p><span class="font-medium">Status:</span> ${cert.isValid ? '✅ Valid' : '❌ Revoked'}</p>
        <p><span class="font-medium">PDF Hash:</span> ${cert.pdfHash}</p>
        <p><span class="font-medium">IPFS:</span> <a href="${ipfsLink}" target="_blank" class="text-indigo-600 underline">Download PDF</a></p>
        <p><span class="font-medium">Student Address:</span> ${cert.studentAddress}</p>
    `;
}

// Open default tab on page load
document.getElementById("defaultOpen").click();