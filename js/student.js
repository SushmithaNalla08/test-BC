// js/student.js
const { CONTRACT_ADDRESS, CONTRACT_ABI } = CONFIG;

let web3, contract, accounts;

document.getElementById('connectBtn').onclick = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        accounts = await web3.eth.getAccounts();
        document.getElementById('account').innerText = accounts[0];
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        console.log('Available methods:', Object.keys(contract.methods));
    } else {
        alert('Install MetaMask');
    }
};

document.getElementById('loadCerts').onclick = async () => {
    if (!contract) return alert('Connect first');
    const certIds = await contract.methods.getStudentCertificates(accounts[0]).call();
    const listDiv = document.getElementById('certList');
    listDiv.innerHTML = '';
    if (certIds.length === 0) {
        listDiv.innerHTML = '<p class="text-gray-600 bg-white p-4 rounded-lg shadow">No certificates found.</p>';
        return;
    }
    for (let id of certIds) {
        const cert = await contract.methods.verifyCertificate(id).call();
        const date = new Date(Number(cert.issueDate) * 1000).toLocaleDateString();
        const ipfsLink = CONFIG.PINATA_GATEWAY + cert.ipfsHash;
        listDiv.innerHTML += `
            <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-indigo-500">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-xl font-semibold text-gray-800">${cert.studentName}</p>
                        <p class="text-gray-600">${cert.course}</p>
                        <p class="text-sm text-gray-500">Issuer: ${cert.issuer}</p>
                        <p class="text-sm text-gray-500">Date: ${date}</p>
                        <p class="text-sm mt-1">Status: ${cert.isValid ? '<span class="text-green-600 font-medium">✅ Valid</span>' : '<span class="text-red-600 font-medium">❌ Revoked</span>'}</p>
                    </div>
                    <a href="${ipfsLink}" target="_blank" class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-indigo-200 transition">📄 PDF</a>
                </div>
                <div class="mt-4 flex items-center space-x-2">
                    <input type="text" value="${window.location.origin}/verify.html?id=${id}" readonly class="flex-1 text-sm bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none">
                    <button onclick="navigator.clipboard.writeText('${window.location.origin}/verify.html?id=${id}')" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition">Copy Link</button>
                </div>
            </div>
        `;
    }
};