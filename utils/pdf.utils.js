const horizontalLine = {
  canvas: [
    { type: "line", x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 },
  ],
};

function generateColumnsWithStyle(texts, styles, widths) {
  const columns = texts.map((text, index) => ({
    width: (widths && widths[index]) || "*",
    text,
    style: styles[index] || {},
  }));
  return { columns };
}

function generateHeader(InquiryResponseHeader, currentPage, pageSize) {
  const margin = 40;

  const header = [
    { text: "", margin: [0, 0, 0, 5] },
    {
      text: "Equifax Credit Report with Score",
      style: ["header", "fillBrown", "center"],
      margin: [margin, 0, margin, 0],
    },
    {
      canvas: [
        { type: "line", x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 },
      ],
      margin: [margin, 0, margin, 0],
    },
    { text: "", margin: [0, 0, 0, 5] },
    {
      columns: [
        {
          width: "*",
          text: {
            text: `REPORT ORDER NO: ${InquiryResponseHeader.ReportOrderNO}`,
          },
          margin: [margin, 0, margin, 0],
          style: "smallPara",
        },
        {
          width: "*",
          text: {
            text: `Date: ${InquiryResponseHeader.Date}`,
            alignment: "right",
          },
          margin: [margin, 0, margin, 0],
          style: "smallPara",
        },
      ],
    },
    {
      columns: [
        {
          width: "*",
          text: {
            text: ``,
          },
          margin: [margin, 0, margin, 0],
          style: "smallPara",
        },
        {
          width: "*",
          text: {
            text: `Time: ${InquiryResponseHeader.Time}`,
            alignment: "right",
          },
          margin: [margin, 0, margin, 0],
          style: "smallPara",
        },
      ],
    },
    {
      canvas: [
        { type: "line", x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 },
      ],
      margin: [margin, 0, margin, 0],
    },
    { text: "", margin: [0, 0, 0, 5] },
  ];
  return header;
}

function generateAddress(addressInfo) {
  const body = [];

  body.push([
    { text: "Type", style: "columnText" },
    { text: "Address", style: "columnText" },
    { text: "State", style: "columnText" },
    { text: "Postal", style: "columnText" },
    { text: "Date Reported", style: "columnText" },
  ]);

  addressInfo.forEach((address, index) => {
    const row = [
      { text: address.Type, style: "basicReportInfo" },
      { text: address.Address, style: "basicReportInfo" },
      { text: address.State, style: "basicReportInfo" },
      { text: address.Postal, style: "basicReportInfo" },
      { text: address.ReportedDate, style: "basicReportInfo" },
    ];
    const fillColor = index % 2 == 0 ? "#E0E0E0" : "#FFFFFF";
    row.forEach((cell) => {
      cell.fillColor = fillColor;
    });
    body.push(row);
  });
  return body;
}

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

const retailAccountDetails = (RetailAccountDetails, RetailAccountsSummary) => {
  return RetailAccountDetails.map((accountDetails) => {
    return [
      generateColumnsWithStyle(
        [
          `Acct: ${accountDetails.AccountNumber ? "************" : ""}`,
          `Balance: ${accountDetails.Balance || ""}`,
          `Open: ${accountDetails.Open || ""}`,
          `Date Reported: ${accountDetails.DateReported || ""}`,
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
          `Institution: ${accountDetails.Institution || ""}`,
          `Past Due Amount: ${accountDetails.PastDueAmount || ""}`,
          `Interest Rate: ${accountDetails.InterestRate || ""}`,
          `Date Opened: ${accountDetails.DateOpened || ""}`,
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
          `Type: ${accountDetails.AccountType || ""}`,
          `Last Payment: ${accountDetails.LastPayment || ""}`,
          `Last Payment Date: ${accountDetails.LastPaymentDate || ""}`,
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
          `Ownership Type: ${accountDetails.OwnershipType || ""}`,
          `Write-off Amount:`,
          `Sanction Amount: ${accountDetails.SanctionAmount || ""}`,
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
          `Days Past Due: `,
          `Institution Type: `,
          `First Days Past Due Date: `,
          ``,
        ],
        [
          "basicReportInfo",
          "basicReportInfo",
          "basicReportInfo",
          "basicReportInfo",
        ]
      ),
      generateColumnsWithStyle(
        [` `, `Max Days Past Due: `, ` `, ``],
        [
          "basicReportInfo",
          "basicReportInfo",
          "basicReportInfo",
          "basicReportInfo",
        ]
      ),

      generateColumnsWithStyle(
        [
          `Repayment Tenure: ${accountDetails.RepaymentTenure || ""}`,
          `Monthly Payment Amount: ${
            RetailAccountsSummary.TotalMonthlyPaymentAmount || ""
          }`,
          `Credit Limit: ${RetailAccountsSummary.TotalCreditLimit || ""}`,
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
        text: `Asset Classification: ${
          accountDetails.AssetClassification || ""
        }`,
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
};

function generateEnquiriesSummary(enquiry) {
  const body = [];
  body.push([
    { text: "Purpose", style: "columnText" },
    { text: "Total", style: "columnText" },
    { text: "Past 30 Days", style: "columnText" },
    { text: "Past 12 Months", style: "columnText" },
    { text: "Past 24 Months", style: "columnText" },
    { text: "Recent", style: "columnText" },
  ]);

  const row = [
    { text: enquiry.Purpose, style: "smallPara" },
    { text: enquiry.Total, style: "smallPara" },
    { text: enquiry.Past30Days, style: "smallPara" },
    { text: enquiry.Past12Months, style: "smallPara" },
    { text: enquiry.Past24Months, style: "smallPara" },
    { text: enquiry.Recent, style: "smallPara" },
  ];
  body.push(row);
  return body;
}

function generateEnquiries(enquiries) {
  const body = [];
  const limitQueries = enquiries.slice(0, 6);
  body.push([
    { text: "Institution", style: "columnText" },
    { text: "Date", style: "columnText" },
    { text: "Time", style: "columnText" },
    { text: "Purpose", style: "columnText" },
    { text: "Amount", style: "columnText" },
  ]);

  limitQueries.forEach((enquiry) => {
    const row = [
      { text: enquiry.Institution, style: "smallPara" },
      { text: enquiry.Date, style: "smallPara" },
      { text: enquiry.Time, style: "smallPara" },
      { text: enquiry.RequestPurpose, style: "smallPara" },
      { text: enquiry.Amount, style: "smallPara" },
    ];
    body.push(row);
  });
  return body;
}

const termsNExplanations = [
  { code: "000", description: "current account" },
  { code: "CLSD", description: "Paid or closed account/zero balance" },
  { code: "NEW", description: "New Account" },
  { code: "LNSB", description: "Loan Submitted" },
  { code: "LAND", description: "Loan Approved - Not yet disbursed" },
  { code: "INAC", description: "Account is Inactive" },
  { code: "CON", description: "Contact Member for Status" },
  { code: "DEC", description: "Loan Declined" },
  { code: "01+", description: "1-30 days past due" },
  { code: "31+", description: "31-60 days past due" },
  { code: "61+", description: "61-90 days past due" },
  { code: "91+", description: "91-120 days past due" },
  { code: "121+", description: "121 - 179 days past due" },
  { code: "181+", description: "180 or more days past due" },
  { code: "STD", description: "Standard" },
  { code: "SUB", description: "Sub-standard" },
  { code: "DBT", description: "Doubtful" },
  { code: "LOS", description: "Loss" },
  { code: "SMA", description: "Special Mention Accounts" },
  {
    code: "SMA 0",
    description:
      "Principal or interest payment not overdue for more than 30 days but account showing signs of incipient stress",
  },
  {
    code: "SMA 1",
    description: "Principal or interest payment overdue between 31-60 days",
  },
  {
    code: "SMA 2",
    description:
      "Principal or interest payment overdue between 61 - 90 days, and NA (Not applicable)",
  },
  { code: "DBT 1", description: "Doubtful -1" },
  { code: "DBT 2", description: "Doubtful -2" },
  { code: "DBT 3", description: "Doubtful -3" },
  { code: "NPA", description: "Non Performing Assets" },
  { code: "1000", description: "0 Day Past Due" },
  { code: "1001", description: "1 Day Past Due" },
  { code: "1002", description: "2 Day Past Due" },
  {
    code: "1nnn",
    description: "Nnn Days Past Due (Note: Nnn is the actual number of days)",
  },
  { code: "1999", description: "999 or above Days Past Due" },
  { code: "OPN", description: "Open" },
  { code: "CLSD", description: "Closed By Payment" },
  { code: "SET", description: "Settled & Closed" },
  { code: "WOF", description: "Written Off" },
  { code: "PWOS", description: "Post Write Off Settled" },
  { code: "WOF", description: "Charge Off/Written Off" },
  { code: "INV", description: "Invoked" },
  { code: "DEV", description: "Devolved" },
  { code: "RES", description: "Restructured Loan" },
  { code: "RGM", description: "Restructured Loan - Govt Mandate" },
  { code: "RNC", description: "Restructured Due to Natural Calamity" },
  { code: "NS ", description: "Not a Suit Filed Case" },
  { code: "SF", description: "Suit Filed" },
  { code: "WDF", description: "Willful Default" },
  { code: "SFR", description: "Suit Filed-Restructured" },
  { code: "SFWD", description: "Suit Filed-Willful Default" },
  { code: "SFWO", description: "Suit Filed and Written Off" },
  { code: "WDWO", description: "Willful Default and Written Off" },
  { code: "SWDW", description: "Suit Filed, Willful Default and Written Off" },
  { code: "FPD", description: "First Payment Default" },
  { code: "TP", description: "Trial in Progress" },
  { code: "DI", description: "Decree issued by court" },
  { code: "ED", description: "Execution of Decree" },
  { code: "NAOC", description: "Notional Amount of Contract" },
  {
    code: "NAORC",
    description: "Notional Amount of Out-standing Restructured Contracts",
  },
  {
    code: "WAMPOC",
    description: "Weighted Average maturity period of Contracts",
  },
  { code: "*", description: "Data Not Reported" },
  { code: "DPD", description: "Days Past Due" },
  { code: "RCV", description: "Restructured Due to COVID19" },
  { code: "ERS", description: "Equifax Risk Score" },
  { code: "CF", description: "Credit Facilities" },
  { code: "FY", description: "Financial Year" },
  { code: "CIN", description: "Corporate Identity Number" },
  { code: "TIN", description: "Taxpayer Identification Number" },
  { code: "PAN", description: "Permanent Account Number" },
  { code: "DUNS", description: "Data Universal Numbering System" },
  { code: "Date of Inc.", description: "Date of Incorporation" },
  { code: "On-Member", description: "Your Institution" },
  { code: "Off-Member", description: "Other Institution" },
  { code: "PSU", description: "Public Sector Undertaking" },
  { code: "Pvt", description: "Private Limited" },
  {
    code: "NBFC",
    description:
      "Non-Bank Financial Institution / Non-Banking Financial Company",
  },
  { code: "WC", description: "Working Capital" },
  { code: "NF", description: "Non-Funded" },
  { code: "TL", description: "Term Loan" },
  { code: "FX", description: "Forex" },
  { code: "01", description: "Account Ownership Disputed" },
  { code: "02", description: "Account Status Disputed" },
  { code: "03", description: "Account Balance Disputed" },
  { code: "04", description: "Account Ownership Type Disputed" },
  { code: "05", description: "Account Needs to be closed" },
  { code: "06", description: "Account History Disputed" },
  { code: "07", description: "Suit Filed / Willful Status Disputed" },
  { code: "08", description: "Asset Classification Status Disputed" },
  { code: "09", description: "Sanction Amount Disputed" },
  { code: "10", description: "Name Correction Requested" },
  { code: "11", description: "Address information Disputed" },
  { code: "12", description: "DOB Disputed" },
  { code: "13", description: "Contact Number Disputed" },
  { code: "14", description: "Gender Flag Disputed" },
  { code: "15", description: "Total Income Disputed" },
  { code: "16", description: "Occupation Disputed" },
  { code: "17", description: "Pan Information Disputed" },
  { code: "18", description: "Voter Information Disputed" },
  { code: "19", description: "Passport Information Disputed" },
  { code: "20", description: "Driver's License information Disputed" },
  { code: "21", description: "State Code Disputed" },
  { code: "22", description: "Date closed Disputed" },
  { code: "23", description: "Credit Limit Disputed" },
  { code: "24", description: "Write-off / Settled Amount Disputed" },
  { code: "25", description: "Loan / Credit Type Disputed" },
  { code: "26", description: "Collateral Details Disputed" },
  { code: "27", description: "Email Id Disputed" },
  { code: "28", description: "MFI - Loan Category Disputed" },
  { code: "29", description: "MFI - Repayment Frequency Disputed" },
  { code: "30", description: "MFI - Installment Amount Disputed" },
  { code: "31", description: "MFI - Key Person Name Disputed" },
  { code: "32", description: "Dispute Closed" },
];

function generateTermsNExplanation(terms) {
  const body = [];

  body.push([
    { text: "Code", style: "columnText" },
    { text: "Description", style: "columnText" },
  ]);

  terms.forEach((enquiry, index) => {
    const row = [
      {
        text: enquiry.code,
        style: "smallPara",
      },
      {
        text: enquiry.description,
        style: "smallPara",
      },
    ];
    const fillColor = index % 2 == 0 ? "#E0E0E0" : "#FFFFFF";
    row.forEach((cell) => {
      cell.fillColor = fillColor;
    });

    body.push(row);
  });
  return body;
}

const footerText1 =
  "This report is to be used subject to and in compliance with the Membership agreement entered into between the Member/Specified User and Equifax Credit Information Services Private Limited ('ECIS'), in the case of Members/Specified Users of ECIS. In other cases, the use of this report is governed by the terms and conditions of ECIS, contained in the Application form submitted by the customer/user.";

const footerText2 =
  "The information contained in this report is derived from various Members/sources which are not controlled by ECIS. ECIS provides this report on a best effort basis and does not guarantee the timeliness, correctness or completeness of the information contained therein, except as explicitly stated in the Membership agreement/terms and conditions of ECIS, as the case may be";

module.exports = {
  generateHeader,
  generateColumnsWithStyle,
  generateAddress,
  generateEnquiries,
  retailAccountDetails,
  generateEnquiriesSummary,
  termsNExplanations,
  generateTermsNExplanation,
  footerText1,
  footerText2,
};
