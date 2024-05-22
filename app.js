const fs = require("fs");
const PdfPrinter = require("pdfmake");
const cibilJson = require("./cibiljsonMalik.json");
const {
  generateAddress,
  generateEnquiries,
  termsNExplanations,
  generateTermsNExplanation,
  footerText2,
  footerText1,
  generateHeader,
  generateColumnsWithStyle,
} = require("./utils/pdf.utils");

const fonts = {
  Roboto: {
    regular: "assets/Roboto-Regular.ttf",
    normal: "assets/Roboto-Medium.ttf",
    bold: "assets/Roboto-Bold.ttf",
    bolditalics: "assets/Roboto-BoldItalic.ttf",
    Black: "assets/Roboto-Black.ttf",
  },
};

const printer = new PdfPrinter(fonts);
const { InquiryResponseHeader, CCRResponse } = cibilJson;
const { CIRReportDataLst } = CCRResponse;
const reportData = CIRReportDataLst.filter((item) => {
  return item.CIRReportData?.ScoreDetails[0].Type === "ERS";
});
const {
  IDAndContactInfo,
  ScoreDetails,
  RetailAccountsSummary,
  RetailAccountDetails,
  Enquiries,
  EnquirySummary,
} = reportData[0]?.CIRReportData;

const scoreDetails = ScoreDetails[0];

function generateColumnsForHistory(history, keyName, label, width) {
  const columnTexts = history.map((item) => item[keyName]);
  const individualStrings = columnTexts.map((text) => text.split(",")).flat();

  return generateColumnsWithStyle(
    [label, ...individualStrings],
    ["smallPara", ...Array(individualStrings.length).fill("microText")],
    [width, ...Array(individualStrings.length).fill("*")]
  );
}

const accountDetailHistory = (history) => {
  const limitedHistory = history.slice(-24);
  return [
    generateColumnsForHistory(
      limitedHistory,
      "PaymentStatus",
      "Account Status:",
      "15%"
    ),
    generateColumnsForHistory(
      limitedHistory,
      "AssetClassificationStatus",
      "Asset Classification:",
      "15%"
    ),
    generateColumnsForHistory(
      limitedHistory,
      "SuitFiledStatus",
      "Suit Filed Status:",
      "15%"
    ),
    generateColumnsForHistory(limitedHistory, "key", "", "15%"),
  ];
};

const retailAccountDetails = RetailAccountDetails.map((accountDetails) => {
  return [
    generateColumnsWithStyle(
      [
        `Acct: ${accountDetails.AccountNumber ? "************" : ""}`,
        `Balance: ${accountDetails.Balance}`,
        `Open: ${accountDetails.Open}`,
        `Date Reported: ${accountDetails.DateReported}`,
      ],
      [
        "basicReportInfo",
        "basicReportInfo",
        "basicReportInfo",
        "basicReportInfo",
      ]
    ),
    generateColumnsWithStyle(
      [
        `Institution: ${accountDetails.Institution}`,
        `Past Due Amount:`,
        `Interest Rate: ${accountDetails.InterestRate}`,
        `Date Opened: ${accountDetails.DateOpened}`,
      ],
      [
        "basicReportInfo",
        "basicReportInfo",
        "basicReportInfo",
        "basicReportInfo",
      ]
    ),
    generateColumnsWithStyle(
      [
        `Type: ${accountDetails.Type}`,
        `Last Payment:`,
        `Last Payment Date:`,
        `Date Closed: ${accountDetails?.DateClosed || ""}`,
      ],
      [
        "basicReportInfo",
        "basicReportInfo",
        "basicReportInfo",
        "basicReportInfo",
      ]
    ),
    generateColumnsWithStyle(
      [
        `Ownership Type: ${accountDetails.OwnershipType}`,
        `Write-off Amount:`,
        `Sanction Amount: ${accountDetails.SanctionAmount}`,
        `Reason: ${accountDetails?.Reason || ""}`,
      ],
      [
        "basicReportInfo",
        "basicReportInfo",
        "basicReportInfo",
        "basicReportInfo",
      ]
    ),
    { text: "", margin: [0, 0, 0, 10] },
    generateColumnsWithStyle(
      [
        `Repayment Tenure: ${accountDetails.RepaymentTenure}`,
        `Monthly Payment Amount: ${RetailAccountsSummary.TotalMonthlyPaymentAmount}`,
        `Credit Limit: ${RetailAccountsSummary.TotalCreditLimit}`,
        `Collateral Value:`,
      ],
      [
        "basicReportInfo",
        "basicReportInfo",
        "basicReportInfo",
        "basicReportInfo",
      ]
    ),
    generateColumnsWithStyle(
      [
        `Dispute Code: ${accountDetails.DisputeCode || ""}`,
        `Term Frequency: ${accountDetails.TermFrequency || ""}`,
        ``,
        `Collateral Type:`,
      ],
      [
        "basicReportInfo",
        "basicReportInfo",
        "basicReportInfo",
        "basicReportInfo",
      ]
    ),
    { text: "", margin: [0, 0, 0, 20] },
    {
      text: `Account status: ${accountDetails.AccountStatus || ""}`,
      style: "basicReportInfo",
    },
    {
      text: `Asset Classification: ${accountDetails.AssetClassification || ""}`,
      style: "basicReportInfo",
    },
    {
      text: `Suit Filed Status:`,
      style: "basicReportInfo",
    },
    { text: "", margin: [0, 0, 0, 20] },
    {
      text: `History`,
      style: ["basicReportInfo", "underline"],
    },
    accountDetailHistory(accountDetails.History48Months),
    {
      canvas: [
        { type: "line", x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 },
      ],
    },
    { text: "", margin: [0, 0, 0, 20] },
  ];
});

const docDefinition = {
  content: [
    ...generateHeader(InquiryResponseHeader),
    { text: "", margin: [0, 0, 0, 20] },
    {
      text: `Consumer Name: ${IDAndContactInfo?.PersonalInfo?.Name?.FirstName}`,
      style: ["header"],
    },
    generateColumnsWithStyle(
      ["Personal Information", "Identification", "Contact Details"],
      ["fillBrown", "fillBrown", "fillBrown"]
    ),
    { text: "", margin: [0, 0, 0, 10] },
    generateColumnsWithStyle(
      [
        `Previous Name: `,
        `PAN: ${IDAndContactInfo?.IdentityInfo?.PANId[0]?.IdNumber}`,
        `Home: `,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `Alias Name: ${IDAndContactInfo?.PersonalInfo?.DateOfBirth}`,
        `Voter ID: `,
        `Office: `,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `DOB: ${IDAndContactInfo?.PersonalInfo?.DateOfBirth}`,
        `Passport ID:`,
        `Contact Details: ${IDAndContactInfo?.PhoneInfo[0]?.Number}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `Age: ${IDAndContactInfo?.PersonalInfo?.Age.Age}`,
        `UID:`,
        `Alt. Home/Other No:`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `Gender: ${IDAndContactInfo?.PersonalInfo?.Gender}`,
        `Driver's License:`,
        `Alt. Office:`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `Total Income:`,
        `Ration Card: ${IDAndContactInfo?.IdentityInfo?.RationCard[0]?.IdNumber}`,
        `Alt. Mobile:`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [`Occupation:`, `Photo Credit Card:`, `Email:`],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    { text: "", margin: [0, 0, 0, 20] },
    // {
    //   text: `Consumer Address:`,
    //   style: ["header"],
    // },
    // { text: "", margin: [0, 0, 0, 10] },
    // {
    //   layout: "lightHorizontalLines",
    //   table: {
    //     headerRows: 1,
    //     widths: ["auto", "auto", "auto", "auto", "auto"],
    //     body: generateAddress(IDAndContactInfo.AddressInfo),
    //   },
    // },
    // { text: "", margin: [0, 0, 0, 20] },
    // {
    //   text: `Equifax Score(s):`,
    //   style: ["header"],
    // },
    // { text: "", margin: [0, 0, 0, 10] },
    // generateColumnsWithStyle(
    //   [`Score Name`, `Score`, `Scoring Factors`],
    //   ["fillBrown", "fillBrown", "fillBrown"]
    // ),
    // { text: "", margin: [0, 0, 0, 10] },
    // generateColumnsWithStyle(
    //   [
    //     scoreDetails.Type,
    //     scoreDetails.Value,
    //     scoreDetails.ScoringElements.map((item) => item.Description),
    //   ],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // { text: "", margin: [0, 0, 0, 20] },
    // {
    //   text: `Account Summary:`,
    //   style: ["header"],
    // },
    // { text: "", margin: [0, 0, 0, 10] },
    // {
    //   text: "Consolidated Credit Summary",
    //   style: ["basicReportInfo", "center", "fillBrown"],
    // },
    // {
    //   text: "OVERALL",
    //   style: ["basicReportInfo", "center", "fillGreen"],
    // },
    // generateColumnsWithStyle(
    //   [
    //     `Number of Open Accounts: ${RetailAccountsSummary.NoOfAccounts}`,
    //     `Number of Past Due Accounts: ${RetailAccountsSummary.TotalPastDue}`,
    //     `Total Outstanding Balance: ${RetailAccountsSummary.TotalBalanceAmount}`,
    //   ],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // {
    //   text: "RETAIL",
    //   style: ["basicReportInfo", "center", "fillGreen"],
    // },
    // generateColumnsWithStyle(
    //   [
    //     `Number of Open Accounts: ${RetailAccountsSummary.NoOfAccounts}`,
    //     `Number of Past Due Accounts: ${RetailAccountsSummary.TotalPastDue}`,
    //     `Total Outstanding Balance: ${RetailAccountsSummary.TotalBalanceAmount}`,
    //   ],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // generateColumnsWithStyle(
    //   [
    //     `Total Accounts: ${RetailAccountsSummary.NoOfAccounts}`,
    //     `Total Past Due Amount: ${RetailAccountsSummary.TotalPastDue}`,
    //     `Recent Account: ${RetailAccountsSummary.RecentAccount}`,
    //   ],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // generateColumnsWithStyle(
    //   [
    //     `Total Sanction Amount: ${RetailAccountsSummary.TotalSanctionAmount}`,
    //     `Total High Credit: ${RetailAccountsSummary.TotalHighCredit}`,
    //     `Oldest Account: ${RetailAccountsSummary.OldestAccount}`,
    //   ],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // { text: "", margin: [0, 0, 0, 20] },
    // ...generateHeader(InquiryResponseHeader),
    // { text: "", margin: [0, 0, 0, 10] },
    // {
    //   text: "Accounts",
    //   style: ["basicReportInfo", "center", "fillBrown"],
    // },
    // {
    //   text: "RETAIL",
    //   style: ["basicReportInfo", "center", "fillGreen"],
    // },
    // retailAccountDetails,
    // {
    //   text: `Enquiries:`,
    //   style: ["header"],
    // },
    // { text: "", margin: [0, 0, 0, 10] },
    // {
    //   layout: "lightHorizontalLines",
    //   table: {
    //     headerRows: 1,
    //     widths: ["*", "*", "*", "*", "*"],
    //     body: generateEnquiries(Enquiries),
    //   },
    // },
    // { text: "", margin: [0, 0, 0, 20] },
    // {
    //   text: `Input Enquiry:`,
    //   style: ["header"],
    // },
    // { text: "", margin: [0, 0, 0, 10] },
    // generateColumnsWithStyle(
    //   [
    //     `Personal & Account Information`,
    //     `ID & Phone Numbers`,
    //     `Contact Details`,
    //   ],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // generateColumnsWithStyle(
    //   [
    //     `Consumer’s First Name: ${IDAndContactInfo.PersonalInfo.Name.FirstName}`,
    //     `PAN: Voter`,
    //     `Address Information 1:`,
    //   ],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // generateColumnsWithStyle(
    //   [`Father:`, `ID: Passport`, `Address: `],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // generateColumnsWithStyle(
    //   [`Husband:`, `ID:`, `State: ${IDAndContactInfo.AddressInfo[0].State}`],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // generateColumnsWithStyle(
    //   [
    //     `DOB: ${IDAndContactInfo.PersonalInfo.DateOfBirth}`,
    //     `UID:`,
    //     `Postal: ${IDAndContactInfo.AddressInfo[0].Postal}`,
    //   ],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // generateColumnsWithStyle(
    //   [
    //     `Gender: ${IDAndContactInfo.PersonalInfo.Gender}`,
    //     `Driver's License:`,
    //     `Address Information 2:`,
    //   ],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // generateColumnsWithStyle(
    //   [
    //     `Inquiry / Request Purpose: ${EnquirySummary.Purpose}`,
    //     `Ration ID: ${IDAndContactInfo?.IdentityInfo?.RationCard[0]?.IdNumber}`,
    //     `Address:`,
    //   ],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // generateColumnsWithStyle(
    //   [
    //     `Member ID / Unique Account Number:`,
    //     `ID - Other: ID`,
    //     `State: ${IDAndContactInfo.AddressInfo[0].State}`,
    //   ],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // generateColumnsWithStyle(
    //   [
    //     `Transaction Amount:`,
    //     `- Other: Home:`,
    //     `Postal: ${IDAndContactInfo.AddressInfo[0].Postal}`,
    //   ],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // generateColumnsWithStyle(
    //   [
    //     `Inquiry Account 1:`,
    //     `Phone:`,
    //     `Address Information 3: ${
    //       IDAndContactInfo.AddressInfo[2]?.Address || ""
    //     }`,
    //   ],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // generateColumnsWithStyle(
    //   [
    //     `Inquiry Account 2:`,
    //     `Mobile Phone:${IDAndContactInfo.PhoneInfo[0].Number}`,
    //     `Address:`,
    //   ],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // generateColumnsWithStyle(
    //   [`Inquiry Account 3:`, `Other Phone:`, `State:`],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // generateColumnsWithStyle(
    //   [`Inquiry Account 4:`, ``, `Postal:`],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // generateColumnsWithStyle(
    //   [``, ``, `Branch ID:`],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // generateColumnsWithStyle(
    //   [``, ``, `Kendra / Centre ID:`],
    //   ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    // ),
    // { text: "", margin: [0, 0, 0, 20] },
    // {
    //   text: `Glossary, Terms and Explanations:`,
    //   style: ["header"],
    // },
    // { text: "", margin: [0, 0, 0, 10] },
    // {
    //   text: `History`,
    //   style: ["basicReportInfo", "underline"],
    // },
    // {
    //   layout: "lightHorizontalLines",
    //   table: {
    //     headerRows: 1,
    //     widths: ["auto", "auto"],
    //     body: generateTermsNExplanation(termsNExplanations),
    //   },
    // },
    // { text: "", margin: [0, 0, 0, 20] },
    // {
    //   canvas: [
    //     { type: "line", x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 },
    //   ],
    // },
    // { text: "", margin: [0, 0, 0, 20] },
    // generateColumnsWithStyle(
    //   [`Contact Us:`, `Phone:`, `Fax:`, `Email:`],
    //   ["footerText", "footerText", "footerText", "footerText"]
    // ),
    // { text: "", margin: [0, 0, 0, 20] },
    // {
    //   canvas: [
    //     { type: "line", x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 },
    //   ],
    // },
    // { text: footerText1, style: ["center", "smallPara"] },
    // { text: "", margin: [0, 0, 0, 10] },
    // { text: footerText2, style: ["center", "smallPara"] },
  ],

  styles: {
    mainHeader: {
      fontSize: 18,
      bold: true,
      alignment: "center",
    },
    header: {
      fontSize: 16,
      bold: true,
    },
    headerText: {
      fontSize: 10,
      lineHeight: 1,
    },
    basicReportInfo: {
      lineHeight: 2,
      fontSize: 10,
    },
    fillBrown: {
      color: "#772019",
      bold: true,
    },
    fillGreen: {
      color: "#11998e",
      bold: true,
      margin: [0, 0, 0, 0],
    },
    center: {
      alignment: "center",
    },
    underline: {
      decoration: "underline",
    },
    widthSize: {
      width: "20%",
    },
    smallPara: {
      lineHeight: 1,
      fontSize: 8,
    },
    microText: {
      lineHeight: 1,
      fontSize: 6,
    },
    footerText: {
      alignment: "center",
      color: "#666666",
      fontSize: 8,
    },
  },
};

// PDF MAKE
var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream("cibil.pdf"));
pdfDoc.end();
