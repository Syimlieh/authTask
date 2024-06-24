const fs = require("fs");
const dns = require("dns");
const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const swaggerFile = require("./swagger_output.json");
const { getUrl } = require("./config/mongo.config");
const cibilJson = require("./cibilJson.json");
const server = express();
const PDFDocument = require("pdfkit");
const { format } = require("date-fns");
// PORT
const PORT = process.env.PORT || 4000;

// CORS
server.use(cors());

// Export Json to PDF
const pdfDoc = new PDFDocument({ size: "A4" });
const today = format(new Date(), "MMMM dd, yyyy");

const pageHeight = pdfDoc.page.height;
const pageWidth = pdfDoc.page.width;

let footer = pdfDoc.linearGradient(0, 0, pageWidth, 0);
footer
  .stop(0, "#DE3232")
  .stop(1 / 3, "#470807")
  .stop(2 / 3, "#470807")
  .stop(1, "#DE3232");

const regularTextOption = {
  paragraphGap: 4,
  color: "#0000FF",
};

const continueOption = {
  paragraphGap: 3,
  continued: true,
};

const interSemiBold = "assets/fonts/Inter-SemiBold.ttf";
const interRegular = "assets/fonts/Inter-Regular.ttf";

pdfDoc.on("pageAdded", () => {
  pdfDoc.rect(0, pageHeight - 30, pageWidth, 60).fill("#770403");
  pdfDoc.fill("#000000");
});
pdfDoc.rect(0, 0, pageWidth, 50).fill("#770403");
pdfDoc.image("assets/template_logo.png", 10, 10, { width: 95 });
// footer for first page
pdfDoc.rect(0, pageHeight - 30, pageWidth, 60).fill("#770403");
pdfDoc.fill("#000000");

pdfDoc
  .font(`${interSemiBold}`, 10)
  .fill("#000000")
  .text(today, { align: "right" });
pdfDoc.font(`${interSemiBold}`, 10).text("To,", { ...regularTextOption });
pdfDoc.font(`${interSemiBold}`, 10).text(`@Fleming`, { ...regularTextOption });
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text(`@123 Street`, { ...regularTextOption });
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text(`Contact No. : @7007677873`, { ...regularTextOption });
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "Thank you for showing your interest in AFI-Dhanvriddhi Loan and giving us an opportunity to serve you.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "We are pleased to inform you that your loan application has been approved as per the below mentioned terms and conditions.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text(
    "AFI -Dhanvriddhi Loan, a brand name under Ayaan Finserve India Private Limited (RBI approved NBFC – Reg No. 14.01220)",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    ": A-118, (Old No 214-A) Vikas Marg Shakarpur , Near Solitare Hotel, Delhi- 110092  This sanction will be subject to the following Terms and Conditions:",
    { ...regularTextOption }
  );

pdfDoc.moveDown(2);

// Customer info
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Customer Name: ", continueOption)
  .font(`${interRegular}`, 10)
  .text("@Fleming", regularTextOption);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Loan Account No. ", continueOption)
  .font(`${interRegular}`, 10)
  .text("@AFI_ACC_NO", regularTextOption);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Sanctioned Loan Amount (Rs.) : ", continueOption)
  .font(`${interRegular}`, 10)
  .text(`@25000/-`, regularTextOption);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Rate of Interest (%) per day : ", continueOption)
  .font(`${interRegular}`, 10)
  .text("@1", regularTextOption);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Date of sanction : ", continueOption)
  .font(`${interRegular}`, 10)
  .text("@12/04/2024", regularTextOption);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Total Repayment Amount (Rs.) : ", continueOption)
  .font(`${interRegular}`, 10)
  .text(`@5000/-`, regularTextOption);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Tenure in Days : ", continueOption)
  .font(`${interRegular}`, 10)
  .text("@30", regularTextOption);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Repayment Date : ", continueOption)
  .font(`${interRegular}`, 10)
  .text("@25/04/2024", regularTextOption);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Penal Interest(%) per day : ", {
    ...continueOption,
    ...regularTextOption,
  })
  .font(`${interRegular}`, 10)
  .text("2", regularTextOption);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Processing Fee (Rs.) : ", { ...continueOption, ...regularTextOption })
  .font(`${interRegular}`, 10)
  .text("590.00/- (Including 18% GST)", regularTextOption);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Repayment Cheque(s) ", { ...continueOption, ...regularTextOption })
  .font(`${interRegular}`, 10)
  .text(":- ", regularTextOption);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Cheque drawn on (name of the Bank) ", {
    ...continueOption,
    ...regularTextOption,
  })
  .font(`${interRegular}`, 10)
  .text(":- ", regularTextOption);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Cheque and NACH Bouncing Charges (Rs.) :- ", {
    ...continueOption,
    ...regularTextOption,
  })
  .font(`${interRegular}`, 10)
  .text("1,000.00/- per bouncing/dishonour.", regularTextOption);
// pdfDoc.font(`${interSemiBold}`, 10).text('Repayment Cheque(s) : -', continueOption, regularTextOption);
// pdfDoc.font(`${interSemiBold}`, 10).text('Cheque drawn on (name of the Bank) : -', continueOption, regularTextOption);
// pdfDoc.font(`${interSemiBold}`, 10).text('Cheque and NACH Bouncing Charges (Rs.) : 1,000.00/- per bouncing/dishonour.', regularTextOption);
// pdfDoc.font(`${interSemiBold}`, 10).text('Annualised ROI (%) : 365', regularTextOption);
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "Henceforth visiting (physically) your Workplace and Residence has your concurrence on it. Kindly request you to go through above mentioned terms and conditions and provide your kind acceptance over Email so that we can process your loan for final disbursement."
  );

pdfDoc.moveDown(2);

pdfDoc
  .font(`${interRegular}`, 10)
  .text("Best Regards", { ...regularTextOption });
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("AFI -Dhanvriddhi Loan", { ...regularTextOption });
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("(Brand Name for Ayaan Finserve India Private Limited)", {
    ...regularTextOption,
  });
pdfDoc
  .font(`${interRegular}`, 10)
  .text("Kindly Note:", { ...regularTextOption });
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "Non-payment of loan on time will adversely affect your Credit score, further reducing your chances of getting loan again",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "Upon approval the processing fee will be deducted from your Sanction amount and balance amount will be disbursed to your account.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text("This Sanction letter is valid for 24 Hours only.", {
    ...regularTextOption,
  });
pdfDoc
  .font(`${interRegular}`, 10)
  .text("You can Prepay/Repay the loan amount using our App link ", {
    ...regularTextOption,
    ...continueOption,
  })
  .font(`${interSemiBold}`, 10)
  .text("https://afife.impetusaisolutions.com");
pdfDoc.moveDown(2);

pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("TERMS AND CONDITIONS", { ...regularTextOption });
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    'The Borrower confirms to have read and understood these Terms of Agreement before accepting a personal loan (“Loan”) offer with us. By clicking on the "eSign" button, the Borrower shall be deemed to have electronically accepted these Terms of Agreement. To the extent of any inconsistency, these Terms of Agreement shall prevail.',
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "1. The Loan shall carry a fixed rate of interest specified at the time of applying for the loan.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "2. The Loan amount shall be disbursed, after debiting processing fees, in Borrower’s account only with the Bank on accepting the Personal Loan Terms of Agreement.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "3. The repayment amount shall consist of principal and interest components. The Borrower confirms to repay the repayment amount on the specified repayment date.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "4. If repayment is not done by the specified date, the Borrower will be liable for penal interest.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "5. If any repayment cheque is not honored, the Borrower will be liable for dishonor charges and penal interest.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "6. The Borrower agrees to pay the processing fee, payment dishonor charges, etc.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "7. Any overdue payment incurs interest at the penal interest rate (which is higher than the usual interest rate). We may change the interest rate if required by the statutory/regulatory authority.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "8. The Borrower agrees that fees and charges specified may be revised from time to time and binding on the Borrower.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "9. In case of any complaint, you may contact our nodal officer as per details mentioned below –"
  );
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Name :- ", { ...continueOption, ...regularTextOption })
  .font(`${interRegular}`, 10)
  .text("Amit Khanna", regularTextOption);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Contact number – ", { ...continueOption, ...regularTextOption })
  .font(`${interRegular}`, 10)
  .text("0120-4832057", regularTextOption);
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Address -  ", { ...continueOption, ...regularTextOption })
  .font(`${interRegular}`, 10)
  .text(
    "A-118, (Old No 214-A) Vikas Marg Shakarpur , Near Solitare Hotel, Delhi- 110092",
    regularTextOption
  );
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Email id – ", { ...continueOption, ...regularTextOption })
  .font(`${interRegular}`, 10)
  .text("nodalofficer@afiloans.co.in", regularTextOption);
pdfDoc.moveDown(1);
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "10. In case of late payment of EMI/ Bulleted payment and by signing on Key Fact Sheets, you are authorising us that we can refer your name and mobile number and other details to our collection agency – Eminent BPO services for allowing the recovery manager to contact you to discuss the repayment of EMI and loan amount along with penal interest and other charges, if any."
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "11. The company will not allow multiple partial payments. Any partial payment of a loan, including those towards foreclosure, must be made in a single transaction, covering both the principal and the interest accrued up to that day."
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text("12. The Borrower agrees to pay applicable Goods and Service Tax.");
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "Borrower Representations – The Borrower represents and covenants that the Borrower:",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text("• will use the Loan amount for legitimate purposes.", {
    ...regularTextOption,
  });
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "• will not use the Loan for any speculative, antisocial, or prohibited purposes. If the Loan funds have been used for purposes as stated above, we shall be entitled to do all acts and things that we deem necessary to comply with its policies. The Borrower agrees to bear all costs and expenses incurs as a result thereof.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "• shall notify, within 7 calendar days, if any information given by the Borrower changes. In the specific event of a change in address due to relocation or any other reason, the Borrower shall intimate the new address as soon as possible but no later than 15 days of such a change.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "• information of the Borrower with us is correct, complete, and updated.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "• has read and understood the Privacy Policy available on our website.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Notice")
  .font(`${interRegular}`, 10)
  .text(
    " – We may send Loan-related notices, statements, or any other communication to the Borrower by in-app messages, short message system (SMS), Whatsapp messaging service, electronic mail, ordinary prepaid post, or personal delivery to Borrower’s registered communication address.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "Communication and notices sent by in-app messages/facsimile/SMS/email will be considered to have been sent and received by the Borrower on the same day irrespective of carrier delays. Communication and notices sent by pre-paid mail will be considered to have been delivered on the day immediately after the date of posting.",
    { ...regularTextOption }
  );
pdfDoc.font(`${interSemiBold}`, 10).text("Consent to Disclose");
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "• The Borrower has no objection in and gives consent for sharing Loan details including",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "Borrower’s personal details to branches, affiliates, services providers, agents, contractors, surveyors, agencies, credit bureaus, etc. in or outside India, to enable us to provide services under the arrangement with the third parties including customized solutions and marketing services. The Borrower confirms that the authorization given above shall be valid till written communication of withdrawal of Borrower’s consent is acknowledged by us.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "• The Borrower understands and accepts the risks involved in sharing personal information including sensitive personal information like account details with a third party.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "• The Borrower consents to share Borrower’s personal information with third parties for processing, statistical or risks analysis, conducting credit or anti-money laundering checks, designing financial services or related products, marketing financial services or related products, customer recognition on our website/app, offering relevant product and service offers to customers, etc.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "• The Borrower agrees that we may disclose Borrower’s information to the Reserve Bank of India, other statutory/regulatory authorities, arbitrator, credit bureaus, local authorities, credit rating agency, information utility, marketing agencies, and service providers if required.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "• The Borrower authorizes to provide monthly details of the Loan Account and the credit facilities extended to the Borrower to credit information companies. We may obtain information on credit facilities availed by the Borrower from other financial institutions to determine whether we can extend additional credit facilities. On the regularization of the Borrowers account, we will update the credit information companies accordingly.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "• The Borrower authorizes to verify any of the information of the Borrower including Borrower’s credit standing from anyone we may consider appropriate including credit bureaus, local authority, credit rating agencies etc.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "• The Borrower authorizes us to inform Borrower’s employer of any default in repayment and agrees to do things necessary to fulfill Borrower’s obligations.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "• Our records about the Loan shall be conclusive and binding on the Borrower.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interRegular}`, 10)
  .text(
    "• In case of default in repayment of the Loan amount, Borrower authorizes us and our collection assistance specialist engaged, to contact Borrower over phone, office or visit Borrower’s residence or such other place where Borrower is located.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Effective Date")
  .font(`${interRegular}`, 10)
  .text(
    " – These Terms of Agreement shall be effective from the date of disbursal of the loan amount.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Assignment")
  .font(`${interRegular}`, 10)
  .text(
    " – The Borrower agrees that, with or without intimation to the Borrower, be authorized to sell and /or assign to any third party, the Loan and all outstanding dues under this Agreement, in any manner, in whole or in part, and on such terms as we may decide. Any such sale or assignment shall bind the Borrower, and the Borrower shall accept the third party as its sole creditor or creditor jointly with us and in such event, the Borrower shall pay us or such creditor or as we may direct, the outstanding amounts due from the Borrower under this Agreement.",
    { ...regularTextOption }
  );
pdfDoc
  .font(`${interSemiBold}`, 10)
  .text("Governing Law & Jurisdiction")
  .font(`${interRegular}`, 10)
  .text(
    " – The Loan shall be governed by the laws of India and all claims and disputes arising out of or in connection with the Loan shall be settled by arbitration. Any arbitration award/ direction passed shall be final and binding on the parties. The language of the arbitration shall be English/Hindi and the venue of such arbitration shall be in New Delhi.",
    { ...regularTextOption }
  );

pdfDoc.moveDown(1);

pdfDoc.image("assets/afi_signature2.png", { width: 100 });
pdfDoc.moveDown(4);
pdfDoc
  .font(`${interRegular}`, 9)
  .text("Authorized Signatory - AFI", { ...regularTextOption });

pdfDoc.moveDown(1);

pdfDoc.image("assets/afi_contact.png", { width: pageWidth - 150 });

pdfDoc.moveDown(4);
pdfDoc.font(`${interSemiBold}`, 10).text("Ayaan Finserve India Pvt. Ltd.", {
  ...regularTextOption,
  align: "center",
});

pdfDoc
  .font(`${interRegular}`, 9)
  .text(
    "Office No. 907, 10th Floor, K M Trade Tower, Near Radission Blu Hotel Kaushambi, Ghaziabad, Pin Code 201010",
    { ...regularTextOption, align: "center" }
  );

pdfDoc.rect(0, pageHeight - 30, pageWidth, 30);
pdfDoc.fill(footer);

// PDF Kit
pdfDoc.pipe(fs.createWriteStream("pdf.aggrement.pdf"));
pdfDoc.end();

// should be before passport
server.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

server.use(passport.initialize());

server.use(passport.session());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // limit each IP to 100 requests per 15 minutes
  message: "Too many requests from this IP, please try again later",
  statusCode: 429,
});

// Apply the rate limiter middleware to all requests
server.use(limiter);

server.listen(PORT, () => {
  console.log(`Backend Server running on PORT: [${PORT}]`);
});

// Swagger
server.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

server.use(express.json());
server.use(express.urlencoded({ extended: true, limit: "500mb" }));

// Mongo
const mongoUrl = getUrl();
console.log("mongoUrl", mongoUrl);
mongoose
  .connect(mongoUrl, {
    authSource: "admin",
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log("Failed to connect to Database:\n" + err));
const db = mongoose.connection;
db.on("open", () => {
  console.log("Connection established.");
});

// require("./routes")(server);

// Response for Non existant routes
server.use("*", (req, res) => {
  console.log("req.url", req.url);
  const message = "You reached a route that is not defined on this server.";
  return res.status(404).json({
    message,
  });
});
