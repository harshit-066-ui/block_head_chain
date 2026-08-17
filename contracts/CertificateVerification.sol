// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateVerification {

    // Authorized university address
    address public university;

    struct Certificate {
        string studentName;
        string course;
        string universityName;
        uint256 issueYear;
        uint256 issueTimestamp;
        bool valid;
    }

    // Certificate records are kept private
    mapping(string => Certificate) private certificates;

    // Keeps track of every certificate ID ever issued
    mapping(string => bool) private certificateExists;

    // Only the authorized university can issue or revoke
    modifier onlyUniversity() {
        require(
            msg.sender == university,
            "Only authorized university can perform this action"
        );
        _;
    }

    // The account that deploys the contract becomes the university
    constructor() {
        university = msg.sender;
    }

    // ==========================================
    // 1. ISSUE CERTIFICATE
    // ==========================================

    function issueCertificate(
        string memory id,
        string memory studentName,
        string memory course,
        string memory universityName,
        uint256 issueYear
    ) public onlyUniversity {

        // Prevent duplicate certificate IDs
        require(
            !certificateExists[id],
            "Certificate ID has already been used"
        );

        // Basic validation
        require(
            bytes(id).length > 0,
            "Certificate ID cannot be empty"
        );

        require(
            bytes(studentName).length > 0,
            "Student name cannot be empty"
        );

        require(
            bytes(course).length > 0,
            "Course cannot be empty"
        );

        require(
            bytes(universityName).length > 0,
            "University name cannot be empty"
        );

        require(
            issueYear >= 1900 && issueYear <= 2100,
            "Invalid issue year"
        );

        // Permanently mark this certificate ID as used
        certificateExists[id] = true;

        // Store the certificate
        certificates[id] = Certificate(
            studentName,
            course,
            universityName,
            issueYear,
            block.timestamp,
            true
        );
    }

    // ==========================================
    // 2. REVOKE CERTIFICATE
    // ==========================================

    function revokeCertificate(
        string memory id
    ) public onlyUniversity {

        require(
            certificateExists[id],
            "Certificate does not exist"
        );

        require(
            certificates[id].valid,
            "Certificate is already revoked"
        );

        certificates[id].valid = false;
    }

    // ==========================================
    // 3. VERIFY CERTIFICATE
    // ==========================================

    function verifyCertificate(
        string memory id
    )
        public
        view
        returns (string memory)
    {
        // Certificate ID does not exist
        if (!certificateExists[id]) {
            return "NOT VERIFIED";
        }

        // Certificate was revoked
        if (!certificates[id].valid) {
            return "REVOKED";
        }

        // Certificate exists and is currently valid
        return "VERIFIED";
    }
}