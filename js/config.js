// js/config.js
const CONFIG = {
    // Contract address – update this once after redeploying
    CONTRACT_ADDRESS: "0x1Eda52E0776072261874bD05D8d908dCe588Aa71",

    // ✅ Pinata Gateway URL - Your working dedicated gateway
    PINATA_GATEWAY: "https://scarlet-quick-rabbit-187.mypinata.cloud/ipfs/",
    
    // Or use a public gateway as fallback:
    // PINATA_GATEWAY: "https://gateway.pinata.cloud/ipfs/",

    // Full ABI from Remix (same for all pages)
    CONTRACT_ABI: [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "bytes32",
                    "name": "certId",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "studentName",
                    "type": "string"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "studentAddress",
                    "type": "address"
                }
            ],
            "name": "CertificateIssued",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "bytes32",
                    "name": "certId",
                    "type": "bytes32"
                }
            ],
            "name": "CertificateRevoked",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_studentName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_course",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_issuer",
                    "type": "string"
                },
                {
                    "internalType": "bytes32",
                    "name": "_pdfHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "string",
                    "name": "_ipfsHash",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "_studentAddress",
                    "type": "address"
                }
            ],
            "name": "issueCertificate",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_certId",
                    "type": "bytes32"
                }
            ],
            "name": "revokeCertificate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "admin",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "name": "certificates",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "studentName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "course",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "issuer",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "issueDate",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "isValid",
                    "type": "bool"
                },
                {
                    "internalType": "bytes32",
                    "name": "pdfHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "string",
                    "name": "ipfsHash",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "studentAddress",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_pdfHash",
                    "type": "bytes32"
                }
            ],
            "name": "getCertificateByPdfHash",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_student",
                    "type": "address"
                }
            ],
            "name": "getStudentCertificates",
            "outputs": [
                {
                    "internalType": "bytes32[]",
                    "name": "",
                    "type": "bytes32[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "name": "pdfToCertId",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "studentCertificates",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_certId",
                    "type": "bytes32"
                }
            ],
            "name": "verifyCertificate",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "studentName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "course",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "issuer",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "issueDate",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "isValid",
                    "type": "bool"
                },
                {
                    "internalType": "bytes32",
                    "name": "pdfHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "string",
                    "name": "ipfsHash",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "studentAddress",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ],

    // Pinata keys (only used by admin)
    PINATA_API_KEY: "65fec02ed9cea96bea2c",
    PINATA_SECRET: "91c36de5e6dde6f3bcd36898dcdcabb7318a0e13bb794c00bf4a332baaad684b"
};