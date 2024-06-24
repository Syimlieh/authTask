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
  generateEnquiriesSummary,
  retailAccountDetails,
} = require("./utils/pdf.utils");

const fonts = {
  Inter: {
    light: "assets/fonts/inter-Light.ttf",
    regular: "assets/fonts/inter-Regular.ttf",
    normal: "assets/fonts/inter-Regular.ttf",
    semibold: "assets/fonts/inter-SemiBold.ttf",
    bold: "assets/fonts/inter-Bold.ttf",
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
  RecentActivities,
} = reportData[0]?.CIRReportData;

const horizontalLine = {
  canvas: [
    { type: "line", x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 },
  ],
};

const homeContact = IDAndContactInfo.PhoneInfo.filter(
  (item) => item.typeCode === "H"
);
const mobileContact = IDAndContactInfo.PhoneInfo.filter(
  (item) => item.typeCode === "M"
);
const officeContact = IDAndContactInfo.PhoneInfo.filter(
  (item) => item.typeCode === "T"
);

const dob = new Date(IDAndContactInfo?.PersonalInfo?.DateOfBirth);
const monthDiff = Math.abs(new Date().getMonth() - dob.getMonth());

const scoreDetails = ScoreDetails[0];

const { InquiryRequestInfo } = reportData[0];
const inquiryHomeContact = InquiryRequestInfo.InquiryPhones.filter(
  (item) => item.PhoneType[0] === "H"
);
const inquiryMobileContact = InquiryRequestInfo.InquiryPhones.filter(
  (item) => item.PhoneType[0] === "M"
);
const inquiryOfficeContact = InquiryRequestInfo.InquiryPhones.filter(
  (item) => item.PhoneType[0] === "T"
);

const docDefinition = {
  header: function (currentPage, pageCount, pageSize) {
    return generateHeader(InquiryResponseHeader, currentPage, pageSize);
  },
  content: [
    // ...generateHeader(InquiryResponseHeader),
    { text: "", margin: [0, 0, 0, 20] },
    {
      text: `Consumer Name: ${IDAndContactInfo?.PersonalInfo?.Name?.FullName}`,
      style: ["header"],
    },
    { text: "", margin: [0, 0, 0, 10] },
    generateColumnsWithStyle(
      ["Personal Information", "Identification", "Contact Details"],
      ["columnText", "columnText", "columnText"]
    ),
    { text: "", margin: [0, 0, 0, 10] },
    generateColumnsWithStyle(
      [
        `Previous Name: `,
        `PAN: ${IDAndContactInfo?.IdentityInfo?.PANId[0]?.IdNumber || ""}`,
        `Home: ${homeContact?.[0]?.Number || ""}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `Alias Name: ${
          IDAndContactInfo?.PersonalInfo?.[" AliasName"].Name || ""
        }`,
        `Voter ID: ${
          IDAndContactInfo?.IdentityInfo?.VoterID[0]?.IdNumber || ""
        }`,
        `Office: ${officeContact?.[0]?.Number || ""}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `DOB: ${IDAndContactInfo?.PersonalInfo?.DateOfBirth}`,
        `Passport ID:`,
        `Mobile: ${mobileContact?.[0]?.Number || ""}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `Age: ${IDAndContactInfo?.PersonalInfo?.Age.Age} Years ${monthDiff} Month`,
        `UID:`,
        `Alt. Home/Other No: ${homeContact?.[1]?.Number}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `Gender: ${IDAndContactInfo?.PersonalInfo?.Gender}`,
        `Driver's License:`,
        `Alt. Office: ${officeContact?.[1]?.Number}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `Total Income: ${IDAndContactInfo?.PersonalInfo?.TotalIncome || ""}`,
        `Ration Card: ${
          IDAndContactInfo?.IdentityInfo?.RationCard?.[0]?.IdNumber || ""
        }`,
        `Alt. Mobile: ${mobileContact?.[1]?.Number}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `Occupation:`,
        `Photo Credit Card:`,
        `Email: ${IDAndContactInfo?.EmailAddressInfo?.[0]?.EmailAddress}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    { text: "", margin: [0, 0, 0, 20] },
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 5,
          x2: 595 - 2 * 40,
          y2: 5,
          lineWidth: 1,
        },
      ],
    },
    { text: "", margin: [0, 0, 0, 20] },
    {
      text: `Consumer Address:`,
      style: ["header"],
    },
    { text: "", margin: [0, 0, 0, 10] },
    {
      layout: "lightHorizontalLines",
      table: {
        headerRows: 1,
        widths: ["auto", "auto", "auto", "auto", 100],
        body: generateAddress(IDAndContactInfo.AddressInfo),
      },
    },
    { text: "", margin: [0, 0, 0, 20] },
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 5,
          x2: 595 - 2 * 40,
          y2: 5,
          lineWidth: 1,
        },
      ],
    },
    { text: "", margin: [0, 0, 0, 20] },
    {
      text: `Equifax Score(s):`,
      style: ["header"],
    },
    { text: "", margin: [0, 0, 0, 10] },
    generateColumnsWithStyle(
      [`Score Name`, `Score`, `Scoring Factors`],
      ["columnText", "columnText", "columnText"]
    ),
    { text: "", margin: [0, 0, 0, 10] },
    {
      columns: [
        {
          width: "*",
          text: {
            text: scoreDetails.Name,
          },
          style: "basicReportInfo",
        },
        {
          width: "*",
          text: {
            text: scoreDetails.Value,
          },
          style: "basicReportInfo",
        },
        {
          ul: scoreDetails.ScoringElements.map((item) => item.Description),
          style: "basicReportInfo",
        },
      ],
    },
    { text: "", margin: [0, 0, 0, 20] },
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 5,
          x2: 595 - 2 * 40,
          y2: 5,
          lineWidth: 1,
        },
      ],
    },
    { text: "", margin: [0, 0, 0, 20] },
    {
      text: `Recent Activity:`,
      style: ["header"],
    },
    { text: "", margin: [0, 0, 0, 10] },
    {
      text: `Recent Activity last(90 days):`,
      style: ["columnText", "center"],
    },
    { text: "", margin: [0, 0, 0, 10] },
    generateColumnsWithStyle(
      [
        `Total Enquiries: ${RecentActivities.TotalInquiries}`,
        `Account Opened: ${RecentActivities.AccountsOpened}`,
        `Account Updated: ${RecentActivities.AccountsUpdated}`,
        `Account Deliquent: ${RecentActivities.AccountsDeliquent}`,
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
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 5,
          x2: 595 - 2 * 40,
          y2: 5,
          lineWidth: 1,
        },
      ],
    },
    { text: "", margin: [0, 0, 0, 20] },
    {
      text: `Summary:`,
      style: ["header"],
    },
    { text: "", margin: [0, 0, 0, 10] },
    {
      text: "Credit Report Summary",
      style: ["columnText", "center"],
    },
    { text: "", margin: [0, 0, 0, 10] },
    generateColumnsWithStyle(
      [
        `Number of Accounts: ${RetailAccountsSummary.NoOfAccounts}`,
        `Total balance Amount: ${RetailAccountsSummary.TotalBalanceAmount}`,
        `Recent Account: ${RetailAccountsSummary.RecentAccount}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `Number of Open Accounts: ${RetailAccountsSummary.NoOfActiveAccounts}`,
        `Total Past Due Amount: ${RetailAccountsSummary.TotalPastDue}`,
        `Oldest Account: ${RetailAccountsSummary.OldestAccount}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `Number of Past Due Accounts: ${RetailAccountsSummary.NoOfPastDueAccounts}`,
        `Total High Credit: ${RetailAccountsSummary.TotalHighCredit}`,
        `Total Credit Limit: ${RetailAccountsSummary.TotalCreditLimit}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `Number of Write-off Accounts: ${RetailAccountsSummary.NoOfWriteOffs}`,
        `Total Sanction Amount: ${RetailAccountsSummary.TotalSanctionAmount}`,
        `Single Highest Credit: ${RetailAccountsSummary.SingleHighestCredit}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `Number of Zero Balance Accounts: ${RetailAccountsSummary.NoOfZeroBalanceAccounts}`,
        `Total Monthly Payment: ${RetailAccountsSummary.TotalMonthlyPaymentAmount}`,
        `Single Highest Sanction: ${RetailAccountsSummary.SingleHighestSanctionAmount}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `Most Severe status < 24 Month: ${RetailAccountsSummary.MostSevereStatusWithIn24Months}`,
        `Average Open Balance: ${RetailAccountsSummary.AverageOpenBalance}`,
        `Single Highest Balance: ${RetailAccountsSummary.SingleHighestBalance}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    { text: "", margin: [0, 0, 0, 20] },
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 5,
          x2: 595 - 2 * 40,
          y2: 5,
          lineWidth: 1,
        },
      ],
    },
    { text: "", margin: [0, 0, 0, 20] },
    {
      text: `Account Details:`,
      style: ["header"],
    },
    {
      text: "Accounts",
      style: ["columnText", "center"],
    },
    { text: "", margin: [0, 0, 0, 10] },
    retailAccountDetails(RetailAccountDetails, RetailAccountsSummary),
    {
      text: `Enquiries Summary:`,
      style: ["header"],
    },
    { text: "", margin: [0, 0, 0, 10] },
    {
      layout: "lightHorizontalLines",
      table: {
        headerRows: 1,
        widths: ["*", "*", "*", "*", "*", "*"],
        body: generateEnquiriesSummary(EnquirySummary),
      },
    },
    { text: "", margin: [0, 0, 0, 20] },
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 5,
          x2: 595 - 2 * 40,
          y2: 5,
          lineWidth: 1,
        },
      ],
    },
    { text: "", margin: [0, 0, 0, 20] },
    {
      text: `Enquiries:`,
      style: ["header"],
    },
    { text: "", margin: [0, 0, 0, 10] },
    {
      layout: "lightHorizontalLines",
      table: {
        headerRows: 1,
        widths: ["*", "*", "*", "*", "*"],
        body: generateEnquiries(Enquiries),
      },
    },
    { text: "", margin: [0, 0, 0, 20] },
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 5,
          x2: 595 - 2 * 40,
          y2: 5,
          lineWidth: 1,
        },
      ],
    },
    { text: "", margin: [0, 0, 0, 20] },
    {
      text: `Input Enquiry:`,
      style: ["header"],
    },
    { text: "", margin: [0, 0, 0, 10] },
    generateColumnsWithStyle(
      [
        `Personal & Account Information`,
        `ID & Phone Numbers`,
        `Contact Details`,
      ],
      ["columnText", "columnText", "columnText"]
    ),
    { text: "", margin: [0, 0, 0, 10] },
    generateColumnsWithStyle(
      [
        `Consumer Name: ${IDAndContactInfo.PersonalInfo.Name.FullName}`,
        `PAN: ${IDAndContactInfo?.IdentityInfo?.PANId[0]?.IdNumber || ""}`,
        `Address Information 1:`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `DOB: ${InquiryRequestInfo?.DOB}`,
        `Voter ID:`,
        `Address: ${
          InquiryRequestInfo.InquiryAddresses?.[0]?.AddressLine1 || ""
        }`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `Gender: ${IDAndContactInfo.PersonalInfo?.Gender || ""}`,
        `Passport Id: `,
        `State: ${InquiryRequestInfo?.InquiryAddresses?.[0]?.State || ""}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `Inquiry / Request Purpose: ${
          InquiryRequestInfo?.InquiryPurpose || ""
        }`,
        `UID: `,
        `Postal: ${InquiryRequestInfo.InquiryAddresses?.[0]?.Postal || ""}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [`Transaction Amount:`, `Driver's License`, `Address information 2: `],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `Inquiry Account 1:`,
        `Home Phone: ${inquiryHomeContact?.[0]?.Number || ""}`,
        `Address: ${
          InquiryRequestInfo.InquiryAddresses?.[1]?.AddressLine1 || ""
        } `,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `Inquiry Account 2:`,
        `Mobile Phone: ${inquiryMobileContact?.[0]?.Number || ""}`,
        `State: ${InquiryRequestInfo?.InquiryAddresses?.[1]?.State || ""}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        `Inquiry Account 3:`,
        `Other Phone: ${inquiryOfficeContact?.[0]?.Number || ""}`,
        `Postal: ${InquiryRequestInfo.InquiryAddresses?.[1]?.Postal || ""}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [`Inquiry Account 4:`, ``, `Postal: Address Information 3`],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        ``,
        ``,
        `Address: ${
          InquiryRequestInfo.InquiryAddresses?.[2]?.AddressLine1 || ""
        } `,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        ``,
        ``,
        `State: ${InquiryRequestInfo?.InquiryAddresses?.[2]?.State || ""}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    generateColumnsWithStyle(
      [
        ``,
        ``,
        `Postal: ${InquiryRequestInfo.InquiryAddresses?.[2]?.Postal || ""}`,
      ],
      ["basicReportInfo", "basicReportInfo", "basicReportInfo"]
    ),
    { text: "", margin: [0, 0, 0, 20] },
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 5,
          x2: 595 - 2 * 40,
          y2: 5,
          lineWidth: 1,
        },
      ],
    },
    { text: "", margin: [0, 0, 0, 20] },
    {
      text: `Glossary, Terms and Explanations:`,
      style: ["header"],
    },
    { text: "", margin: [0, 0, 0, 10] },
    {
      text: `History`,
      style: ["header", "underline"],
    },
    { text: "", margin: [0, 0, 0, 10] },
    {
      layout: "lightHorizontalLines",
      table: {
        headerRows: 1,
        widths: ["auto", "auto"],
        body: generateTermsNExplanation(termsNExplanations),
      },
    },
    { text: "", margin: [0, 0, 0, 20] },
    horizontalLine,
    { text: "", margin: [0, 0, 0, 20] },
    generateColumnsWithStyle(
      [
        `Contact Us:`,
        `Phone: 1800 209 3247`,
        `Fax: +91-22-6112-7950`,
        `Email: ecissupport@equifax.com`,
      ],
      ["footerText", "footerText", "footerText", "footerText"]
    ),
    { text: "", margin: [0, 0, 0, 20] },
    {
      canvas: [
        { type: "line", x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 },
      ],
    },
    { text: "", margin: [0, 0, 0, 20] },
    { text: footerText1, style: ["center", "smallPara"] },
    { text: "", margin: [0, 0, 0, 10] },
    { text: footerText2, style: ["center", "smallPara"] },
  ],

  styles: {
    mainHeader: {
      fontSize: 14,
      bold: true,
      alignment: "center",
      color: "#772019",
    },
    header: {
      fontSize: 12,
      bold: true,
    },
    columnText: {
      fontSize: 9,
      lineHeight: 1,
      bold: true,
      color: "#772019",
    },
    basicReportInfo: {
      lineHeight: 1.4,
      fontSize: 8,
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
    right: {
      alignment: "right",
    },
    underline: {
      decoration: "underline",
    },
    widthSize: {
      width: "20%",
    },
    smallPara: {
      lineHeight: 1,
      fontSize: 7,
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
  defaultStyle: {
    font: "Inter",
  },
  pageMargins: [40, 60, 60, 60],
};

// PDF MAKE
var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream("cibil.pdf"));
pdfDoc.end();
