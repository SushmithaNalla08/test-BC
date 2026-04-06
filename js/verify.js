// js/verify.js
const { CONTRACT_ADDRESS, CONTRACT_ABI } = CONFIG;

let web3;
let contract;

window.onload = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    } else {
        alert('MetaMask is recommended for best experience. You can still use this page, but some features may not work.');
    }

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
        document.getElementById('certId').value = id;
        verifyById(id);
    }
};

document.getElementById('verifyIdBtn').onclick = async () => {
    const certId = document.getElementById('certId').value.trim();
    if (!certId) return alert('Please enter a certificate ID');
    await verifyById(certId);
};

async function verifyById(certId) {
    if (!contract) return alert('Contract not initialized. Make sure MetaMask is connected and the network is correct.');
    try {
        const cert = await contract.methods.verifyCertificate(certId).call();
        displayCert(cert);
    } catch (error) {
        console.error(error);
        document.getElementById('result').innerHTML = '<p class="text-red-600 font-semibold">❌ Invalid or revoked certificate</p>';
        document.getElementById('result').classList.remove('hidden');
    }
}

document.getElementById('verifyPdfBtn').onclick = async () => {
    const file = document.getElementById('verifyPdf').files[0];
    if (!file) return alert('Select a PDF file');

    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const pdfHash = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    try {
        const certId = await contract.methods.getCertificateByPdfHash(pdfHash).call();
        if (certId === '0x0000000000000000000000000000000000000000000000000000000000000000') {
            document.getElementById('result').innerHTML = '<p class="text-red-600 font-semibold">❌ No certificate found for this PDF</p>';
        } else {
            const cert = await contract.methods.verifyCertificate(certId).call();
            displayCert(cert);
        }
    } catch (error) {
        console.error(error);
        document.getElementById('result').innerHTML = '<p class="text-red-600 font-semibold">❌ Error verifying PDF</p>';
    }
};

function displayCert(cert) {
    const date = new Date(Number(cert.issueDate) * 1000).toLocaleString();
    const ipfsLink = `https://gateway.pinata.cloud/ipfs/${cert.ipfsHash}`;
    document.getElementById('result').innerHTML = `
        <h3 class="text-xl font-bold text-green-600 mb-3">✅ Valid Certificate</h3>
        <p><span class="font-medium">Student:</span> ${cert.studentName}</p>
        <p><span class="font-medium">Course:</span> ${cert.course}</p>
        <p><span class="font-medium">Issuer:</span> ${cert.issuer}</p>
        <p><span class="font-medium">Issue Date:</span> ${date}</p>
        <p><span class="font-medium">Status:</span> ${cert.isValid ? '✅ Valid' : '❌ Revoked'}</p>
        <p><span class="font-medium">PDF:</span> <a href="${ipfsLink}" target="_blank" class="text-indigo-600 underline">Download</a></p>
        <p><span class="font-medium">Student Address:</span> ${cert.studentAddress}</p>
    `;
    document.getElementById('result').classList.remove('hidden');
}